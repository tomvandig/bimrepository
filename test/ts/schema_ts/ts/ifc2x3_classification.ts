
/*
{
    "$id": [
        "ifc2x3",
        "classification"
    ],
    "$schemaversion": "1",
    "$comment": "",
    "description": "Classification of the IFC element",
    "shape": {
        "classification_name": {
            "type": "string"
        }
    }
}
*/

import * as flatbuffers from 'flatbuffers';
import { ECSComponent, Reference, UUID4 } from '../../../../lib/client/ts/ecs';
import { Component, ComponentT, ItemsT, PropertyType, ComponentDataType, ComponentIdentifierT, SchemaT, propertyT, shapeT } from '../../../../lib/schema/bimrepo';
import * as helper from '../../../../lib/client/ts/helper';

export namespace ifc2x3 {
    export class classification extends ECSComponent {
        
        constructor(id: UUID4) {
            super("ifc2x3_classification", "9f3516c293e818dba97659b2c8af614e6ad70ea3a2f8b41c6d2b94cf7fbec717", id);
        }
        
        // properties
        classification_name: string = "";
        // end properties
        
        // methods
        validate(): boolean {
            return false;
        }
        
        
        exportToDataArray(id: ComponentIdentifierT): ComponentT {
            let componentObj = new ComponentT();
            componentObj.id = id;
            
            // property classification_name
            componentObj.data.push(helper.MakeString(this.classification_name));
            
            return componentObj;
        }
        
        
        exportDefinitionToArray(): SchemaT {
            let schemaObj = new SchemaT();
            schemaObj.id = ["ifc2x3","classification"];
            schemaObj.hash = this.getTypeHash();
            schemaObj.schemaversion = "1";
            schemaObj.comment = "";
            schemaObj.description = "Classification of the IFC element";
            
            
            schemaObj.schemaShape = new shapeT();
            
            
            // property classification_name
            {
                let prop_classification_name = new propertyT();
                
                prop_classification_name.name = "classification_name";
                prop_classification_name.type = PropertyType.String;
                
                
                schemaObj.schemaShape.properties.push(prop_classification_name);
            }
            
            
            
            return schemaObj;
        }
        
        // end methods
        
        // statics
        
        
        static importFromDataArray(componentObj: ComponentT): classification {
            // TODO: check if component type matches the class
            
            let obj = new classification(UUID4.FromFB(componentObj.id?.entity!));
                
                
                // property classification_name
                {
                    
                    obj.classification_name = helper.GetString(componentObj);
                    
                }
                
                
                return obj;
                }
                
                // end statics
                }
                }