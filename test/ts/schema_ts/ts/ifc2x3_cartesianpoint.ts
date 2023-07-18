
/*
{
    "$id": [
        "ifc2x3",
        "cartesianpoint"
    ],
    "$schemaversion": "1",
    "$comment": "TODO: fix",
    "description": "Cartesianpoint of ifc version 2x3",
    "shape": {
        "points": {
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "cardinality": {
            "type": "number"
        },
        "owner": {
            "type": "string"
        },
        "external": {
            "type": "bool"
        },
        "parent": {
            "type": "ref",
            "nullable": true,
            "reftype": [
                "ifc2x3",
                "cartesianpoint"
            ]
        }
    }
}
*/

import * as flatbuffers from 'flatbuffers';
import { ECSComponent, Reference, UUID4 } from '../../../../lib/client/ts/ecs';
import { Component, ComponentT, ItemsT, PropertyType, ComponentDataType, ComponentIdentifierT, SchemaT, propertyT, shapeT } from '../../../../lib/schema/bimrepo';
import { Expect, GetArrayStart, GetNumber, GetString, GetBool, MakeArrayEnd, MakeArrayStart, MakeNumber, MakeString, MakeBool } from '../../../../lib/client/ts/helper';

export namespace ifc2x3 {
    // TODO: fix
    export class cartesianpoint extends ECSComponent {
        
        constructor(id: UUID4) {
            super("ifc2x3_cartesianpoint", id);
        }
        
        // properties
        points: number[] = [];
        cardinality: number = 0;
        owner: string = "";
        external: boolean = false;
        parent: Reference<ifc2x3.cartesianpoint> | null = null;
            // end properties
            
            // methods
            validate(): boolean {
                return false;
            }
            
            
            exportToDataArray(id: ComponentIdentifierT): ComponentT {
                let componentObj = new ComponentT();
                componentObj.id = id;
                
                // property points
                componentObj.data.push(MakeArrayStart(this.points.length));
                this.points.forEach((item) => {
                    componentObj.data.push(MakeNumber(item));
                });
                componentObj.data.push(MakeArrayEnd());
                // property cardinality
                componentObj.data.push(MakeNumber(this.cardinality));
                // property owner
                componentObj.data.push(MakeString(this.owner));
                // property external
                componentObj.data.push(MakeBool(this.external));
                // property parent
                componentObj.data.push(MakeRef(this.parent));
                
                return componentObj;
            }
            
            
            exportDefinitionToArray(referenceId: number): SchemaT {
                let schemaObj = new SchemaT();
                schemaObj.id = ["ifc2x3","cartesianpoint"];
                schemaObj.schemaversion = "1";
                schemaObj.comment = "TODO: fix";
                schemaObj.description = "Cartesianpoint of ifc version 2x3";
                
                
                schemaObj.schemaShape = new shapeT();
                
                
                // property points
                {
                    let prop_points = new propertyT();
                    
                    prop_points.name = "points";
                    prop_points.type = PropertyType.Array;
                    
                    prop_points.items = new ItemsT();
                    prop_points.items.type = PropertyType.Number;
                    
                    
                    schemaObj.schemaShape.properties.push(prop_points);
                }
                
                
                // property cardinality
                {
                    let prop_cardinality = new propertyT();
                    
                    prop_cardinality.name = "cardinality";
                    prop_cardinality.type = PropertyType.Number;
                    
                    
                    schemaObj.schemaShape.properties.push(prop_cardinality);
                }
                
                
                // property owner
                {
                    let prop_owner = new propertyT();
                    
                    prop_owner.name = "owner";
                    prop_owner.type = PropertyType.String;
                    
                    
                    schemaObj.schemaShape.properties.push(prop_owner);
                }
                
                
                // property external
                {
                    let prop_external = new propertyT();
                    
                    prop_external.name = "external";
                    prop_external.type = PropertyType.Boolean;
                    
                    
                    schemaObj.schemaShape.properties.push(prop_external);
                }
                
                
                // property parent
                {
                    let prop_parent = new propertyT();
                    
                    prop_parent.name = "parent";
                    prop_parent.type = PropertyType.Ref;
                    
                    
                    schemaObj.schemaShape.properties.push(prop_parent);
                }
                
                
                
                return schemaObj;
            }
            
            // end methods
            
            // statics
            
            
            static importFromDataArray(componentObj: ComponentT): cartesianpoint {
                // TODO: check if component type matches the class
                
                let obj = new cartesianpoint();
                
                
                let count = GetArrayStart(componentObj);
                for (let i = 0; i < count; i++)
                {
                    obj.points.push(GetNumber(componentObj));
                }
                Expect(componentObj, ComponentDataType.ArrayEnd);
                
                
                obj.cardinality = GetNumber(componentObj);
                
                
                obj.owner = GetString(componentObj);
                
                
                obj.external = GetBool(componentObj);
                
                
                obj.parent = GetRef(componentObj);
                
                
                return obj;
            }
            
            // end statics
            }
            }