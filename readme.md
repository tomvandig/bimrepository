*Warning, this is an experiment and may not work, or may work now but not tomorrow, or may never work but instead take expensive trips abroad during working hours*

# BIM repository

This is a research repo for strange matter, the foundation of ifc5.

The project is divided in two folder:
* `/lib` which contains the library itself, as well as a **server implementation**
* `/test` which contains example test projects to connect to the ledger in `typescript` and `c#`

## Working with the repo

To start, define a (set of) components that make up your ECS. For example: 

```
// propertyset.json
{
    "$id": ["ifc5", "propertyset"],
    "$schemaversion": "1",
    "$comment": "TODO: fix",
    "description": "A property set in ifc5",
    "shape": {
        "name": {
            "type": string
        },
        "properties": {
            "type": "array",
            "items": {
                "type": "ref",
                "nullable": false,
                "reftype": ["ifc5", "property"]
            }
        }
    }
}
```

Next, use the code generation tools in `lib/codegen` to generate code for `typescript` or `c#`.

```
node convert_ts.js ./propertyset.json ./schema ./lib"
    
node convert_cs.js ./propertyset.json ./schema ./lib"
```

This will generate the files `./schema/propertyset.cs` and `./schema/propertyset.ts` which you can include in your projects.

Next, start the ledger server found in `/lib/server` using:

```
npm install
npm run serve
```

Now, you can start using the generated component files to talk to the ledger server. See the `test` folder for a complete project in `typescript` and `c#`.