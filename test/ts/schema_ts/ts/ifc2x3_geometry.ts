
/*
{
    "$id": [
        "ifc2x3",
        "geometry"
    ],
    "$schemaversion": "1",
    "$comment": "",
    "description": "Geometry of the IFC element",
    "shape": {
        "vertices": {
            "type": "array",
            "items": {
                "type": "float32"
            }
        },
        "colors": {
            "type": "array",
            "items": {
                "type": "float32"
            }
        },
        "indices": {
            "type": "array",
            "items": {
                "type": "int32"
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
    export class geometry extends ECSComponent {
        
        constructor(id: UUID4) {
            super("ifc2x3_geometry", "aeaff9732fcac0be8d1220409fc19245d0afe3e7ebdcefc407d16fac48055925", id);
        }
        
        // properties
        vertices: number[] = [];
        colors: number[] = [];
        indices: number[] = [];
        // end properties
        
        // methods
        validate(): boolean {
            return false;
        }
        
        
        exportToDataArray(id: ComponentIdentifierT): ComponentT {
            let componentObj = new ComponentT();
            componentObj.id = id;
            
            // property vertices
            componentObj.data.push(helper.MakeArrayStart(this.vertices.length));
            this.vertices.forEach((item) => {
                componentObj.data.push(helper.MakeFloat32(item));
            });
            componentObj.data.push(helper.MakeArrayEnd());
            // property colors
            componentObj.data.push(helper.MakeArrayStart(this.colors.length));
            this.colors.forEach((item) => {
                componentObj.data.push(helper.MakeFloat32(item));
            });
            componentObj.data.push(helper.MakeArrayEnd());
            // property indices
            componentObj.data.push(helper.MakeArrayStart(this.indices.length));
            this.indices.forEach((item) => {
                componentObj.data.push(helper.MakeInt32(item));
            });
            componentObj.data.push(helper.MakeArrayEnd());
            
            return componentObj;
        }
        
        
        exportDefinitionToArray(): SchemaT {
            let schemaObj = new SchemaT();
            schemaObj.id = ["ifc2x3","geometry"];
            schemaObj.hash = this.getTypeHash();
            schemaObj.schemaversion = "1";
            schemaObj.comment = "";
            schemaObj.description = "Geometry of the IFC element";
            
            
            schemaObj.schemaShape = new shapeT();
            
            
            // property vertices
            {
                let prop_vertices = new propertyT();
                
                prop_vertices.name = "vertices";
                prop_vertices.type = PropertyType.Array;
                
                prop_vertices.items = new ItemsT();
                prop_vertices.items.type = PropertyType.Float32;
                
                
                schemaObj.schemaShape.properties.push(prop_vertices);
            }
            
            
            // property colors
            {
                let prop_colors = new propertyT();
                
                prop_colors.name = "colors";
                prop_colors.type = PropertyType.Array;
                
                prop_colors.items = new ItemsT();
                prop_colors.items.type = PropertyType.Float32;
                
                
                schemaObj.schemaShape.properties.push(prop_colors);
            }
            
            
            // property indices
            {
                let prop_indices = new propertyT();
                
                prop_indices.name = "indices";
                prop_indices.type = PropertyType.Array;
                
                prop_indices.items = new ItemsT();
                prop_indices.items.type = PropertyType.Int32;
                
                
                schemaObj.schemaShape.properties.push(prop_indices);
            }
            
            
            
            return schemaObj;
        }
        
        // end methods
        
        // statics
        
        
        static importFromDataArray(componentObj: ComponentT): geometry {
            // TODO: check if component type matches the class
            
            let obj = new geometry(UUID4.FromFB(componentObj.id?.entity!));
                
                
                // property vertices
                {
                    
                    let count = helper.GetArrayStart(componentObj);
                    for (let i = 0; i < count; i++)
                    {
                        obj.vertices.push(helper.GetFloat32(componentObj));
                    }
                    helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                    
                }
                
                
                // property colors
                {
                    
                    let count = helper.GetArrayStart(componentObj);
                    for (let i = 0; i < count; i++)
                    {
                        obj.colors.push(helper.GetFloat32(componentObj));
                    }
                    helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                    
                }
                
                
                // property indices
                {
                    
                    let count = helper.GetArrayStart(componentObj);
                    for (let i = 0; i < count; i++)
                    {
                        obj.indices.push(helper.GetInt32(componentObj));
                    }
                    helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                    
                }
                
                
                return obj;
                }
                
                // end statics
                }
                }