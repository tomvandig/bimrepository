
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

    return `<unknown type ${prop.type}>`;
}

function genClass(schema)
{
    console.log(schema);

    let id = schema["$id"];

    let name = id[id.length - 1];
    let code =  dedent`
        export class ${name} {
            
            // properties
            ${Object.keys(schema.shape).map(prop => genProp(prop, schema.shape[prop])).join("\n")}
            // end properties

            // methods
            validate(): boolean {
                return false;
            }

            exportToDataArray(builder: flatbuffers.Builder){

            }
            // end methods

            // statics
            static buildFromDataArray(buf: flatbuffers.ByteBuffer): ${name} {
                return new ${name}();
            }
            
            static exportDefinitionToArray(builder: flatbuffers.Builder) {

            }
            // end statics
        }
    `;

    for (let i = id.length - 2; i >= 0; i--)
    {
        code = namespace(id[i], code);
    }

    
    var indented = indent.js(code, {tabString: '  '});

    return indented;
}

function convert(path)
{
    let schema = JSON.parse(fs.readFileSync(path));

    let fbimport = `import * as flatbuffers from 'flatbuffers';`;
    let header = `\n/*\n${JSON.stringify(schema, null, 4)}\n*/\n\n${fbimport}\n`;
    let output = `${header}\n${genClass(schema)}`;

    let cliOutput = highlight(output, {ignoreIllegals: true});

    console.log(cliOutput);

    fs.writeFileSync("./output/out.ts", output);
}

convert("./schema/cartesianpoint.json");
