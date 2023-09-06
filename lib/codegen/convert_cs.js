
const process = require("process");
const fs = require("fs");
const path = require("path");
const dedent = require("dedent");
var shajs = require('sha.js');
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

function GetTypeName(type)
{
    return type[type.length - 1];
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

function defaultValue(propType, type)
{
    if (propType === "array")
    {
        return `new ${type}()`;
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
    let type = PropTypeToType(prop);
    return `public ${type} ${name} = ${defaultValue(prop.type, type)};`;
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
        schemaObj.Hash = this.getTypeHash();
        schemaObj.Schemaversion = "${schema["$schemaversion"]}";
        schemaObj.Comment = "${schema["$comment"]}";
        schemaObj.Description = "${schema["description"]}";

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
            componentObj.Data.Add(Helper.MakeArrayStart(${varname}.Count));
            ${varname}.ForEach((item) => {
                ${genPropertyExportCode("item", property.items)}
            });
            componentObj.Data.Add(Helper.MakeArrayEnd());
        `;
    }
    else if (property.type === "number")
    {
        return dedent`
            componentObj.Data.Add(Helper.MakeNumber(${varname}));
        `;
    }
    else if (property.type === "string")
    {
        return dedent`
            componentObj.Data.Add(Helper.MakeString(${varname}));
        `;
    }
    else if (property.type === "bool")
    {
        return dedent`
            componentObj.Data.Add(Helper.MakeBool(${varname}));
        `;
    }
    else if (property.type === "ref")
    {
        return dedent`
            componentObj.Data.Add(Helper.MakeRef(${varname}!));
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
    public override ComponentT exportToDataArray(ComponentIdentifierT id) {
        ComponentT componentObj = new ComponentT();

        componentObj.Id = id;
        componentObj.Data = new List<ComponentDataT>();

        ${Object.keys(schema.shape).map(prop => genNamedPropertyExportCode(prop, schema.shape[prop])).join("\n")}
        
        return componentObj;
    }
    `
}

function genSimpleImportType(property)
{
    if (property.type === "number")
    {
        return `Helper.GetNumber(componentObj)`;
    }
    else if (property.type === "string")
    {
        return `Helper.GetString(componentObj)`;
    }
    else if (property.type === "bool")
    {
        return `Helper.GetBool(componentObj)`;
    }
    else if (property.type === "ref")
    {
        return `Helper.GetRef<${GetTypeName(property.reftype)}>(componentObj)`;
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
            var count = Helper.GetArrayStart(componentObj);
            for (var i = 0; i < count; i++)
            {
                ${name}.Add(${genSimpleImportType(property.items)});
            }
            Helper.Expect(componentObj, ComponentDataType.ArrayEnd);
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
    
    public static ${name} importFromDataArray(ComponentT componentObj) {
        // TODO: check if component type matches the class

        var obj = new ${name}(UUID4.FromFB(componentObj.Id?.Entity!));
        
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
        public class ${name} : ECSComponent {

            public ${name}(UUID4 id) : base("${id.join("_")}", "${hash}", id) {

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
    let bytes = fs.readFileSync(inputFile);
    let hash = shajs('sha256').update(bytes).digest('hex');
    let schema = JSON.parse(bytes);

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
    let output = `${header}\n${genClass(schema, hash)}`;

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
