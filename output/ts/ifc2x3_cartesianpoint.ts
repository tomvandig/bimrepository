
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
        }
    }
}
*/

import * as flatbuffers from 'flatbuffers';
import { ECSComponent } from '../../ecs';
import { Component, ComponentDataType, ComponentT, ItemsT, PropertyType, SchemaT, propertyT, shapeT } from '../../bimrepo';
import { Expect, GetArrayStart, GetNumber, MakeArrayEnd, MakeArrayStart, MakeNumber } from '../../helper';

export namespace ifc2x3 {
    // TODO: fix
    export class cartesianpoint extends ECSComponent {
        
        constructor() {
            super("ifc2x3_cartesianpoint");
        }
        
        // properties
        points: number[] = [];
        cardinality: number = 0
        // end properties
        
        // methods
        validate(): boolean {
            return false;
        }
        
        
        exportToDataArray(): ComponentT {
            let componentObj = new ComponentT();
            
            componentObj.type = ["ifc2x3","cartesianpoint"];
            
            
            // property points
            componentObj.data.push(MakeArrayStart(this.points.length));
            this.points.forEach((item) => componentObj.data.push(MakeNumber(item)));
            componentObj.data.push(MakeArrayEnd());
            
            
            // property cardinality
            componentObj.data.push(MakeNumber(this.cardinality));
            
            
            return componentObj;
        }
        
        
        exportDefinitionToArray(): SchemaT {
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
            
            
            
            return schemaObj;
        }
        
        // end methods
        
        // statics
        
        
        static importFromDataArray(componentObj: ComponentT): cartesianpoint {
            // TODO: check if component type matches the class
            
            let obj = new cartesianpoint();
            
            
            // property points
            {
                let count = GetArrayStart(componentObj);
                for (let i = 0; i < count; i++)
                {
                    obj.points.push(GetNumber(componentObj));
                }
                Expect(componentObj, ComponentDataType.ArrayEnd);
            }
            
            
            // property cardinality
            {
                obj.cardinality = GetNumber(componentObj);
            }
            
            
            return obj;
        }
        
        // end statics
    }
}