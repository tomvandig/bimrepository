
const process = require("process");
const fs = require("fs");
const dedent = require("dedent");
var indent = require('indent.js');
const highlight = require('cli-highlight').highlight

console.log(process.argv[2]);

function namespace(name, code)
{
    return dedent`
        export namespace ${name} {
            ${code}
        }
    `;
}

function genArray(prop)
{
    if (prop.items.type === "number")
    {
        return `number[]`;
    }

    return `<unknown type ${prop.items.type}>`;
}

function genProp(name, prop)
{
    if (prop.type === "array")
    {
        return `${name}: ${genArray(prop)} = [];`;
    }
    if (prop.type === "number")
    {
        return `${name}: number = 0`;
    }

    return `<unknown type ${prop.type}>`;
}

function propTypeToFBType(propType)
{
    if (propType === "array")
    {
        return "PropertyType.Array";
    }
    else if (propType === "number")
    {
        return "PropertyType.Number";
    }
    return "PropertyType.Unknown";
}

function genItems(propname, property)
{
    return `
        ${propname}.items = new ItemsT();
        ${propname}.items.type = ${propTypeToFBType(property.items.type)};
    `;
}

function genPropertySchemaCode(name, property)
{
    let propname = `prop_${name}`;

    return `
        // property ${name}
        {
            let ${propname} = new propertyT();

            ${propname}.name = "${name}";
            ${propname}.type = ${propTypeToFBType(property.type)};
            ${property.type === "array" ? genItems(propname, property) : ""}

            schemaObj.schemaShape.properties.push(${propname});
        }
    `;
}

function genSchemaShapeCode(shape)
{
    return `
        schemaObj.schemaShape = new shapeT();

        ${Object.keys(shape).map(pname => genPropertySchemaCode(pname, shape[pname])).join("\n")}
    `;
}

function genSchemaExportCode(schema)
{
    return `
    static exportDefinitionToArray(builder: flatbuffers.Builder) {
        let schemaObj = new SchemaT();
        schemaObj.id = [${schema["$id"].map(e => `"${e}"`).join(",")}];
        schemaObj.schemaversion = "${schema["$schemaversion"]}";
        schemaObj.comment = "${schema["$comment"]}";
        schemaObj.description = "${schema["description"]}";

        ${genSchemaShapeCode(schema.shape)}

        Schema.finishSchemaBuffer(builder, schemaObj.pack(builder));
    }
    `
}

function genPropertyExportCode(name, property)
{
    if (property.type === "array")
    {
        return `
            // property ${name}
            componentObj.data.push(TokenType.ArrayStart);
            componentObj.data.push(this.${name}.length);
            this.${name}.forEach((item) => componentObj.data.push(item));
            componentObj.data.push(TokenType.ArrayEnd);
        `;
    }
    else if (property.type === "number")
    {
        return `
            // property ${name}
            componentObj.data.push(TokenType.Number);
            componentObj.data.push(this.${name});
        `;
    }
    else
    {
        return `<unknown property type ${property.type} for prop ${name}`;
    }
}

function genComponentExportCode(schema)
{
    return `
    exportToDataArray(builder: flatbuffers.Builder){
        let componentObj = new ComponentT();

        componentObj.type = [${schema["$id"].map(e => `"${e}"`).join(",")}];

        ${Object.keys(schema.shape).map(prop => genPropertyExportCode(prop, schema.shape[prop])).join("\n")}
        
        Component.finishComponentBuffer(builder, componentObj.pack(builder));
    }
    `
}

function genPropertyImportCode(name, property)
{
    if (property.type === "array")
    {
        return `
            // property ${name}
            if (componentObj.data.shift() != TokenType.ArrayStart) throw new Error("Expected ArrayStart");
            let count = componentObj.data.shift()!;
            for (let i = 0; i < count; i++)
            {
                obj.${name}.push(componentObj.data.shift()!);
            }
            if (componentObj.data.shift() != TokenType.ArrayEnd) throw new Error("Expected ArrayEnd");
        `;
    }
    else if (property.type === "number")
    {
        return `
            // property ${name}
            if (componentObj.data.shift() != TokenType.Number) throw new Error("Expected number");
            obj.${name} = componentObj.data.shift()!;
        `;
    }
    else
    {
        return `<unknown property type ${property.type} for prop ${name}`;
    }
}

function genComponentImportCode(name, schema)
{
    return `
    
    static buildFromDataArray(buf: flatbuffers.ByteBuffer): ${name} {
        let componentObj = new ComponentT();
        Component.getRootAsComponent(buf).unpackTo(componentObj);

        // TODO: check if component type matches the class

        let obj = new ${name}();
        
        ${Object.keys(schema.shape).map(prop => genPropertyImportCode(prop, schema.shape[prop])).join("\n")}

        return obj;
    }
    `
}

function genClass(schema)
{
    console.log(schema);

    let id = schema["$id"];
    let comment = schema["$comment"];

    let name = id[id.length - 1];
    let code =  dedent`
        ${comment ? `// ${comment}` : ""}
        export class ${name} {
            
            // properties
            ${Object.keys(schema.shape).map(prop => genProp(prop, schema.shape[prop])).join("\n")}
            // end properties

            // methods
            validate(): boolean {
                return false;
            }

            ${genComponentExportCode(schema)}
            // end methods

            // statics
            ${genComponentImportCode(name, schema)}
            
            ${genSchemaExportCode(schema)}
            // end statics
        }
    `;

    for (let i = id.length - 2; i >= 0; i--)
    {
        code = namespace(id[i], code);
    }
    
    var indented = indent.js(code, {tabString: '    '});

    return indented;
}

function convert(path)
{
    let schema = JSON.parse(fs.readFileSync(path));

    let fbimports = [
        `import * as flatbuffers from 'flatbuffers';`,
        `import { Schema, SchemaT } from '../bimrepo/schema';`,
        `import { shapeT } from '../bimrepo/shape';`,
        `import { propertyT } from '../bimrepo/property';`,
        `import { ItemsT } from '../bimrepo/items';`,
        `import { PropertyType } from '../bimrepo/property-type';`,
        `import { Component, ComponentT } from '../bimrepo/component';`,
        `import { TokenType } from '../bimrepo/token-type';`,
    ].join("\n");
    let header = `\n/*\n${JSON.stringify(schema, null, 4)}\n*/\n\n${fbimports}\n`;
    let output = `${header}\n${genClass(schema)}`;

    let cliOutput = highlight(output, {ignoreIllegals: true});

    console.log(cliOutput);

    fs.writeFileSync("./output/out.ts", output);
}

convert("./schema/cartesianpoint.json");
