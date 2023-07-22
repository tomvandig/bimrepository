
const process = require("process");
const fs = require("fs");
const path = require("path");
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

function PropTypeToType(prop)
{
    if (prop.type === "array")
    {
        return `${PropTypeToType(prop.items)}[]`;
    }
    else if (prop.type === "number")
    {
        return `number`;
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
    else if (propType === "number")
    {
        return `0`;
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
    else if (propType === "number")
    {
        return "PropertyType.Number";
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
    exportDefinitionToArray(referenceId: number): SchemaT {
        let schemaObj = new SchemaT();
        schemaObj.id = [${schema["$id"].map(e => `"${e}"`).join(",")}];
        schemaObj.referenceId = referenceId;
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
            componentObj.data.push(MakeArrayStart(${varname}.length));
            ${varname}.forEach((item) => {
                ${genPropertyExportCode("item", property.items)}
            });
            componentObj.data.push(MakeArrayEnd());
        `;
    }
    else if (property.type === "number")
    {
        return dedent`
            componentObj.data.push(MakeNumber(${varname}));
        `;
    }
    else if (property.type === "string")
    {
        return dedent`
            componentObj.data.push(MakeString(${varname}));
        `;
    }
    else if (property.type === "bool")
    {
        return dedent`
            componentObj.data.push(MakeBool(${varname}));
        `;
    }
    else if (property.type === "ref")
    {
        return dedent`
            componentObj.data.push(MakeRef(${varname}!));
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
    if (property.type === "number")
    {
        return `GetNumber(componentObj)`;
    }
    else if (property.type === "string")
    {
        return `GetString(componentObj)`;
    }
    else if (property.type === "bool")
    {
        return `GetBool(componentObj)`;
    }
    else if (property.type === "ref")
    {
        return `GetRef(componentObj)`;
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
            let count = GetArrayStart(componentObj);
            for (let i = 0; i < count; i++)
            {
                obj.${name}.push(${genSimpleImportType(property.items)});
            }
            Expect(componentObj, ComponentDataType.ArrayEnd);
        `;
    }
    else
    {
        return `
            obj.${name} = ${genSimpleImportType(property)};
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

function genClass(schema)
{
    console.log(schema);

    let id = schema["$id"];
    let comment = schema["$comment"];

    let name = id[id.length - 1];
    let code =  dedent`
        ${comment ? `// ${comment}` : ""}
        export class ${name} extends ECSComponent {

            constructor(id: UUID4) {
                super("${id.join("_")}", id);
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
    let schema = JSON.parse(fs.readFileSync(inputFile));

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
    
    let helperImports = [
        "Expect", 
        "GetArrayStart", 
        "GetNumber", 
        "GetString",
        "GetBool",
        "GetRef",
        "MakeRef",
        "MakeArrayEnd", 
        "MakeArrayStart", 
        "MakeNumber",
        "MakeString",
        "MakeBool"
    ]

    let fbimports = [
        `import * as flatbuffers from 'flatbuffers';`,
        `import { ECSComponent, Reference, UUID4 } from '${libPrefix}/client/ts/ecs';`,
        `import { ${bimRepoImports.join(", ")} } from '${libPrefix}/schema/bimrepo';`,
        `import { ${helperImports.join(", ")} } from '${libPrefix}/client/ts/helper';`,
    ].join("\n");
    let header = `\n/*\n${JSON.stringify(schema, null, 4)}\n*/\n\n${fbimports}\n`;
    let output = `${header}\n${genClass(schema)}`;

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
