
/*
{
    "$id": [
        "ifc2x3",
        "transform"
    ],
    "$schemaversion": "1",
    "$comment": "",
    "description": "Transformation of the IFC element",
    "shape": {
        "basis_x": {
            "type": "array",
            "items": {
                "type": "float32"
            }
        },
        "basis_y": {
            "type": "array",
            "items": {
                "type": "float32"
            }
        },
        "basis_z": {
            "type": "array",
            "items": {
                "type": "float32"
            }
        },
        "origin": {
            "type": "array",
            "items": {
                "type": "float32"
            }
        }
    }
}
*/

import * as flatbuffers from 'flatbuffers';
import { ECSComponent, Reference, UUID4 } from '../../../../lib/client/ts/ecs';
import { Component, ComponentT, ItemsT, PropertyType, ComponentDataType, ComponentIdentifierT, SchemaT, propertyT, shapeT } from '../../../../lib/schema/bimrepo';
import * as helper from '../../../../lib/client/ts/helper';

export namespace ifc2x3 {
    export class transform extends ECSComponent {
        
        constructor(id: UUID4) {
            super("ifc2x3_transform", "7867ba20c25ddfb9da771a03ba8a8de00b95f6d2dce266c00224af5b0339ecbc", id);
        }
        
        // properties
        basis_x: number[] = [];
        basis_y: number[] = [];
        basis_z: number[] = [];
        origin: number[] = [];
        // end properties
        
        // methods
        validate(): boolean {
            return false;
        }
        
        
        exportToDataArray(id: ComponentIdentifierT): ComponentT {
            let componentObj = new ComponentT();
            componentObj.id = id;
            
            // property basis_x
            componentObj.data.push(helper.MakeArrayStart(this.basis_x.length));
            this.basis_x.forEach((item) => {
                componentObj.data.push(helper.MakeFloat32(item));
            });
            componentObj.data.push(helper.MakeArrayEnd());
            // property basis_y
            componentObj.data.push(helper.MakeArrayStart(this.basis_y.length));
            this.basis_y.forEach((item) => {
                componentObj.data.push(helper.MakeFloat32(item));
            });
            componentObj.data.push(helper.MakeArrayEnd());
            // property basis_z
            componentObj.data.push(helper.MakeArrayStart(this.basis_z.length));
            this.basis_z.forEach((item) => {
                componentObj.data.push(helper.MakeFloat32(item));
            });
            componentObj.data.push(helper.MakeArrayEnd());
            // property origin
            componentObj.data.push(helper.MakeArrayStart(this.origin.length));
            this.origin.forEach((item) => {
                componentObj.data.push(helper.MakeFloat32(item));
            });
            componentObj.data.push(helper.MakeArrayEnd());
            
            return componentObj;
        }
        
        
        exportDefinitionToArray(): SchemaT {
            let schemaObj = new SchemaT();
            schemaObj.id = ["ifc2x3","transform"];
            schemaObj.hash = this.getTypeHash();
            schemaObj.schemaversion = "1";
            schemaObj.comment = "";
            schemaObj.description = "Transformation of the IFC element";
            
            
            schemaObj.schemaShape = new shapeT();
            
            
            // property basis_x
            {
                let prop_basis_x = new propertyT();
                
                prop_basis_x.name = "basis_x";
                prop_basis_x.type = PropertyType.Array;
                
                prop_basis_x.items = new ItemsT();
                prop_basis_x.items.type = PropertyType.Float32;
                
                
                schemaObj.schemaShape.properties.push(prop_basis_x);
            }
            
            
            // property basis_y
            {
                let prop_basis_y = new propertyT();
                
                prop_basis_y.name = "basis_y";
                prop_basis_y.type = PropertyType.Array;
                
                prop_basis_y.items = new ItemsT();
                prop_basis_y.items.type = PropertyType.Float32;
                
                
                schemaObj.schemaShape.properties.push(prop_basis_y);
            }
            
            
            // property basis_z
            {
                let prop_basis_z = new propertyT();
                
                prop_basis_z.name = "basis_z";
                prop_basis_z.type = PropertyType.Array;
                
                prop_basis_z.items = new ItemsT();
                prop_basis_z.items.type = PropertyType.Float32;
                
                
                schemaObj.schemaShape.properties.push(prop_basis_z);
            }
            
            
            // property origin
            {
                let prop_origin = new propertyT();
                
                prop_origin.name = "origin";
                prop_origin.type = PropertyType.Array;
                
                prop_origin.items = new ItemsT();
                prop_origin.items.type = PropertyType.Float32;
                
                
                schemaObj.schemaShape.properties.push(prop_origin);
            }
            
            
            
            return schemaObj;
        }
        
        // end methods
        
        // statics
        
        
        static importFromDataArray(componentObj: ComponentT): transform {
            // TODO: check if component type matches the class
            
            let obj = new transform(UUID4.FromFB(componentObj.id?.entity!));
                
                
                // property basis_x
                {
                    
                    let count = helper.GetArrayStart(componentObj);
                    for (let i = 0; i < count; i++)
                    {
                        obj.basis_x.push(helper.GetFloat32(componentObj));
                    }
                    helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                    
                }
                
                
                // property basis_y
                {
                    
                    let count = helper.GetArrayStart(componentObj);
                    for (let i = 0; i < count; i++)
                    {
                        obj.basis_y.push(helper.GetFloat32(componentObj));
                    }
                    helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                    
                }
                
                
                // property basis_z
                {
                    
                    let count = helper.GetArrayStart(componentObj);
                    for (let i = 0; i < count; i++)
                    {
                        obj.basis_z.push(helper.GetFloat32(componentObj));
                    }
                    helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                    
                }
                
                
                // property origin
                {
                    
                    let count = helper.GetArrayStart(componentObj);
                    for (let i = 0; i < count; i++)
                    {
                        obj.origin.push(helper.GetFloat32(componentObj));
                    }
                    helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                    
                }
                
                
                return obj;
                }
                
                // end statics
                }
                }