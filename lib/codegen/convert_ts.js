
const process = require("process");
const fs = require("fs");
const path = require("path");
const dedent = require("dedent");
var indent = require('indent.js');
var shajs = require('sha.js');
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

function PropTypeToType(prop)
{
    if (prop.type === "array")
    {
        return `${PropTypeToType(prop.items)}[]`;
    }
    else if (prop.type === "int32")
    {
        return `number`;
    }
    else if (prop.type === "float32")
    {
        return `number`;
    }
    else if (prop.type === "blob")
    {
        return `number[]`;
    }
    else if (prop.type === "string")
    {
        return `string`;
    }
    else if (prop.type === "bool")
    {
        return `boolean`;
    }
    else if (prop.type === "ref")
    {
        return `Reference<${prop.reftype.join(".")}> | null`;
    }

    throw new Error(`<unknown type ${prop.type}>`);
}

function defaultValue(propType)
{
    if (propType === "array")
    {
        return `[]`;
    }
    else if (propType === "int32")
    {
        return `0`;
    }
    else if (propType === "float32")
    {
        return `0`;
    }
    else if (propType === "blob")
    {
        return `[]`;
    }
    else if (propType === "string")
    {
        return `""`;
    }
    else if (propType === "bool")
    {
        return `false`;
    }
    else if (propType === "ref")
    {
        return "null";
    }

    throw new Error(`<unknown type ${propType}>`);
}

function genProp(name, prop)
{
    return `${name}: ${PropTypeToType(prop)} = ${defaultValue(prop.type)};`;
}

function propTypeToFBType(propType)
{
    if (propType === "array")
    {
        return "PropertyType.Array";
    }
    else if (propType === "int32")
    {
        return "PropertyType.Int32";
    }
    else if (propType === "float32")
    {
        return "PropertyType.Float32";
    }
    else if (propType === "blob")
    {
        return "PropertyType.Blob";
    }
    else if (propType === "string")
    {
        return "PropertyType.String";
    }
    else if (propType === "bool")
    {
        return "PropertyType.Boolean";
    }
    else if (propType === "ref")
    {
        return "PropertyType.Ref";
    }
    
    throw new Error(`unknown type ${propType}`);
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
    exportDefinitionToArray(): SchemaT {
        let schemaObj = new SchemaT();
        schemaObj.id = [${schema["$id"].map(e => `"${e}"`).join(",")}];
        schemaObj.hash = this.getTypeHash();
        schemaObj.schemaversion = "${schema["$schemaversion"]}";
        schemaObj.comment = "${schema["$comment"]}";
        schemaObj.description = "${schema["description"]}";

        ${genSchemaShapeCode(schema.shape)}

        return schemaObj;
    }
    `
}

function genPropertyExportCode(varname, property)
{
    if (property.type === "array")
    {
        return dedent`
            componentObj.data.push(helper.MakeArrayStart(${varname}.length));
            ${varname}.forEach((item) => {
                ${genPropertyExportCode("item", property.items)}
            });
            componentObj.data.push(helper.MakeArrayEnd());
        `;
    }
    else if (property.type === "int32")
    {
        return dedent`
            componentObj.data.push(helper.MakeInt32(${varname}));
        `;
    }
    else if (property.type === "float32")
    {
        return dedent`
            componentObj.data.push(helper.MakeFloat32(${varname}));
        `;
    }
    else if (property.type === "blob")
    {
        return dedent`
            componentObj.data.push(helper.MakeBlob(${varname}));
        `;
    }
    else if (property.type === "string")
    {
        return dedent`
            componentObj.data.push(helper.MakeString(${varname}));
        `;
    }
    else if (property.type === "bool")
    {
        return dedent`
            componentObj.data.push(helper.MakeBool(${varname}));
        `;
    }
    else if (property.type === "ref")
    {
        return dedent`
            componentObj.data.push(helper.MakeRef(${varname}!));
        `;
    }
    else
    {
        throw new Error(`unknown property ${property.type}`);
    }
}


function genNamedPropertyExportCode(name, property)
{
    return dedent`
        // property ${name}
        ${genPropertyExportCode(`this.${name}`, property)}
    `;
}

function genComponentExportCode(schema)
{
    return `
    exportToDataArray(id: ComponentIdentifierT): ComponentT {
        let componentObj = new ComponentT();
        componentObj.id = id;

        ${Object.keys(schema.shape).map(prop => genNamedPropertyExportCode(prop, schema.shape[prop])).join("\n")}
        
        return componentObj;
    }
    `
}

function genSimpleImportType(property)
{
    if (property.type === "int32")
    {
        return `helper.GetInt32(componentObj)`;
    }
    else if (property.type === "float32")
    {
        return `helper.GetFloat32(componentObj)`;
    }
    else if (property.type === "blob")
    {
        return `helper.GetBlob(componentObj)`;
    }
    else if (property.type === "string")
    {
        return `helper.GetString(componentObj)`;
    }
    else if (property.type === "bool")
    {
        return `helper.GetBool(componentObj)`;
    }
    else if (property.type === "ref")
    {
        return `helper.GetRef(componentObj)`;
    }
    else
    {
        throw new Error(`unknown property ${property.type}`);
    }
}

function genPropertyImportCode(name, property)
{
    if (property.type === "array")
    {
        return `
            let count = helper.GetArrayStart(componentObj);
            for (let i = 0; i < count; i++)
            {
                ${name}.push(${genSimpleImportType(property.items)});
            }
            helper.Expect(componentObj, ComponentDataType.ArrayEnd);
        `;
    }
    else
    {
        return `
            ${name} = ${genSimpleImportType(property)};
        `;
    }
}

function genNamedPropertyImportCode(name, property)
{
    return `
        // property ${name}
        {
            ${genPropertyImportCode(`obj.${name}`, property)}
        }
    `
}

function genComponentImportCode(name, schema)
{
    return `
    
    static importFromDataArray(componentObj: ComponentT): ${name} {
        // TODO: check if component type matches the class

        let obj = new ${name}(UUID4.FromFB(componentObj.id?.entity!));
        
        ${Object.keys(schema.shape).map(prop => genNamedPropertyImportCode(prop, schema.shape[prop])).join("\n")}

        return obj;
    }
    `
}

function genClass(schema, hash)
{
    console.log(schema);

    let id = schema["$id"];
    let comment = schema["$comment"];

    let name = id[id.length - 1];
    let code =  dedent`
        ${comment ? `// ${comment}` : ""}
        export class ${name} extends ECSComponent {

            constructor(id: UUID4) {
                super("${id.join("_")}", "${hash}", id);
            }
            
            // properties
            ${Object.keys(schema.shape).map(prop => genProp(prop, schema.shape[prop])).join("\n")}
            // end properties

            // methods
            validate(): boolean {
                return false;
            }

            ${genComponentExportCode(schema)}
            ${genSchemaExportCode(schema)}
            // end methods

            // statics
            ${genComponentImportCode(name, schema)}
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

function convert(inputFile, outputdir, libPrefix)
{
    let bytes = fs.readFileSync(inputFile);
    let hash = shajs('sha256').update(bytes).digest('hex');
    let schema = JSON.parse(bytes);

    let bimRepoImports = [
        "Component", 
        "ComponentT", 
        "ItemsT",
        "PropertyType",
        "ComponentDataType", 
        "ComponentIdentifierT",
        "SchemaT", 
        "propertyT", 
        "shapeT"
    ];
    
    let fbimports = [
        `import * as flatbuffers from 'flatbuffers';`,
        `import { ECSComponent, Reference, UUID4 } from '${libPrefix}/client/ts/ecs';`,
        `import { ${bimRepoImports.join(", ")} } from '${libPrefix}/schema/bimrepo';`,
        `import * as helper from '${libPrefix}/client/ts/helper';`,
    ].join("\n");
    let header = `\n/*\n${JSON.stringify(schema, null, 4)}\n*/\n\n${fbimports}\n`;
    let output = `${header}\n${genClass(schema, hash)}`;

    let cliOutput = highlight(output, {ignoreIllegals: true});

    console.log(cliOutput);

    let outputPath = path.join(outputdir, "ts", `${schema.$id.join("_")}.ts`);

    fs.writeFileSync(outputPath, output);
}

let inputFile = process.argv[2];
let outputDir = process.argv[3];
let libPrefix = process.argv[4];

console.log(`Inputfile ${inputFile} outputdir ${outputDir}`);

convert(inputFile, outputDir, libPrefix);
