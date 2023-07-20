
const process = require("process");
const fs = require("fs");
const path = require("path");
const dedent = require("dedent");
var indent = require('indent.js');
const highlight = require('cli-highlight').highlight

function namespace(name, code)
{
    return dedent`
        namespace ${name} {
            ${code}
        }
    `;
}

function genArray(prop)
{
    if (prop.items.type === "number")
    {
        return `List<int>`;
    }

    return `<unknown type ${prop.items.type}>`;
}


function PropTypeToType(prop)
{
    if (prop.type === "array")
    {
        return `List<${PropTypeToType(prop.items)}>`;
    }
    else if (prop.type === "number")
    {
        return `int`;
    }
    else if (prop.type === "string")
    {
        return `string`;
    }
    else if (prop.type === "bool")
    {
        return `bool`;
    }
    else if (prop.type === "ref")
    {
        return `Reference<${prop.reftype.join(".")}>`;
    }

    throw new Error(`<unknown type ${prop.type}>`);
}

function defaultValue(propType)
{
    if (propType === "array")
    {
        return `new()`;
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
    return `${PropTypeToType(prop)} ${name} = ${defaultValue(prop.type)};`;
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
        ${propname}.Items = new ItemsT();
        ${propname}.Items.Type = ${propTypeToFBType(property.items.type)};
    `;
}

function genPropertySchemaCode(name, property)
{
    let propname = `prop_${name}`;

    return `
        // property ${name}
        {
            var ${propname} = new propertyT();

            ${propname}.Name = "${name}";
            ${propname}.Type = ${propTypeToFBType(property.type)};
            ${property.type === "array" ? genItems(propname, property) : ""}

            schemaObj.SchemaShape.Properties.Add(${propname});
        }
    `;
}

function genSchemaShapeCode(shape)
{
    return `
        schemaObj.SchemaShape = new shapeT();

        schemaObj.SchemaShape.Properties = new List<propertyT>();

        ${Object.keys(shape).map(pname => genPropertySchemaCode(pname, shape[pname])).join("\n")}
    `;
}

function genSchemaExportCode(schema)
{
    return `
    public override SchemaT exportDefinitionToArray() {
        var schemaObj = new SchemaT();
        schemaObj.Id = new List<string>() { ${schema["$id"].map(e => `"${e}"`).join(",")} };
        schemaObj.Schemaversion = "${schema["$schemaversion"]}";
        schemaObj.Comment = "${schema["$comment"]}";
        schemaObj.Description = "${schema["description"]}";

        ${genSchemaShapeCode(schema.shape)}

        return schemaObj;
    }
    `
}

function genPropertyExportCode(name, property)
{
    if (property.type === "array")
    {
        return `
            // property ${name}
            componentObj.Data.Add(Helper.MakeArrayStart(this.${name}.Count));
            this.${name}.ForEach((item) => componentObj.Data.Add(Helper.MakeNumber(item)));
            componentObj.Data.Add(Helper.MakeArrayEnd());
        `;
    }
    else if (property.type === "number")
    {
        return `
            // property ${name}
            componentObj.Data.Add(Helper.MakeNumber(this.${name}));
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
    public override ComponentT exportToDataArray() {
        ComponentT componentObj = new();

        componentObj.Type = new List<string>() {${schema["$id"].map(e => `"${e}"`).join(",")}};
        componentObj.Data = new List<ComponentDataT>();

        ${Object.keys(schema.shape).map(prop => genPropertyExportCode(prop, schema.shape[prop])).join("\n")}
        
        return componentObj;
    }
    `
}

function genPropertyImportCode(name, property)
{
    if (property.type === "array")
    {
        return `
            // property ${name}
            {
                var count = Helper.GetArrayStart(componentObj);
                for (var i = 0; i < count; i++)
                {
                    obj.${name}.Add(Helper.GetNumber(componentObj));
                }
                Helper.Expect(componentObj, ComponentDataType.ArrayEnd);
            }
        `;
    }
    else if (property.type === "number")
    {
        return `
            // property ${name}
            {
                obj.${name} = Helper.GetNumber(componentObj);
            }
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
    
    public static ${name} importFromDataArray(ComponentT componentObj) {
        // TODO: check if component type matches the class

        var obj = new ${name}();
        
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
        public class ${name} : ECSComponent {

            public ${name}() : base("${id.join("_")}") {

            }
            
            // properties
            ${Object.keys(schema.shape).map(prop => genProp(prop, schema.shape[prop])).join("\n")}
            // end properties

            // methods
            bool validate() {
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
        "ComponentDataType", 
        "ComponentT", 
        "ItemsT", 
        "PropertyType", 
        "SchemaT", 
        "propertyT", 
        "shapeT"
    ];
    
    let helperImports = [
        "Expect", 
        "GetArrayStart", 
        "GetNumber", 
        "MakeArrayEnd", 
        "MakeArrayStart", 
        "MakeNumber"
    ]

    let fbimports = [
        `using bimrepo;`,
    ].join("\n");
    let header = `\n/*\n${JSON.stringify(schema, null, 4)}\n*/\n\n${fbimports}\n`;
    let output = `${header}\n${genClass(schema)}`;

    let cliOutput = highlight(output, {ignoreIllegals: true});

    console.log(cliOutput);

    let outputPath = path.join(outputdir, "cs", `${schema.$id.join("_")}.cs`);

    fs.writeFileSync(outputPath, output);
}

let inputFile = process.argv[2];
let outputDir = process.argv[3];
let libPrefix = process.argv[4];

console.log(`Inputfile ${inputFile} outputdir ${outputDir}`);

convert(inputFile, outputDir, libPrefix);
