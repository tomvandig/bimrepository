
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
        "indices": {
            "type": "array",
            "items": {
                "type": "int32"
            }
        }
    }
}
*/

using bimrepo;
using System.Collections.Generic;

namespace ifc2x3 {
    public class geometry : ECSComponent {
        
        public geometry(UUID4 id) : base("ifc2x3_geometry", "fec4de4b95647dfd11de476d88d556324318f83a0b0c865c3399080f7595934d", id) {
            
        }
        
        // properties
        public List<float> vertices = new List<float>();
            public List<int> indices = new List<int>();
                // end properties
                
                // methods
                bool validate() {
                    return false;
                }
                
                
                public override ComponentT exportToDataArray(ComponentIdentifierT id) {
                    ComponentT componentObj = new ComponentT();
                    
                    componentObj.Id = id;
                    componentObj.Data = new List<ComponentDataT>();
                        
                        // property vertices
                        componentObj.Data.Add(Helper.MakeArrayStart(this.vertices.Count));
                        this.vertices.ForEach((item) => {
                            componentObj.Data.Add(Helper.MakeFloat32(item));
                        });
                        componentObj.Data.Add(Helper.MakeArrayEnd());
                        // property indices
                        componentObj.Data.Add(Helper.MakeArrayStart(this.indices.Count));
                        this.indices.ForEach((item) => {
                            componentObj.Data.Add(Helper.MakeInt32(item));
                        });
                        componentObj.Data.Add(Helper.MakeArrayEnd());
                        
                        return componentObj;
                        }
                        
                        
                        public override SchemaT exportDefinitionToArray() {
                            var schemaObj = new SchemaT();
                            schemaObj.Id = new List<string>() { "ifc2x3","geometry" };
                                schemaObj.Hash = this.getTypeHash();
                                schemaObj.Schemaversion = "1";
                                schemaObj.Comment = "";
                                schemaObj.Description = "Geometry of the IFC element";
                                
                                
                                schemaObj.SchemaShape = new shapeT();
                                
                                schemaObj.SchemaShape.Properties = new List<propertyT>();
                                    
                                    
                                    // property vertices
                                    {
                                        var prop_vertices = new propertyT();
                                        
                                        prop_vertices.Name = "vertices";
                                        prop_vertices.Type = PropertyType.Array;
                                        
                                        prop_vertices.Items = new ItemsT();
                                        prop_vertices.Items.Type = PropertyType.Float32;
                                        
                                        
                                        schemaObj.SchemaShape.Properties.Add(prop_vertices);
                                    }
                                    
                                    
                                    // property indices
                                    {
                                        var prop_indices = new propertyT();
                                        
                                        prop_indices.Name = "indices";
                                        prop_indices.Type = PropertyType.Array;
                                        
                                        prop_indices.Items = new ItemsT();
                                        prop_indices.Items.Type = PropertyType.Int32;
                                        
                                        
                                        schemaObj.SchemaShape.Properties.Add(prop_indices);
                                    }
                                    
                                    
                                    
                                    return schemaObj;
                                    }
                                    
                                    // end methods
                                    
                                    // statics
                                    
                                    
                                    public static geometry importFromDataArray(ComponentT componentObj) {
                                        // TODO: check if component type matches the class
                                        
                                        var obj = new geometry(UUID4.FromFB(componentObj.Id.Entity));
                                        
                                        
                                        // property vertices
                                        {
                                            
                                            var count = Helper.GetArrayStart(componentObj);
                                            for (var i = 0; i < count; i++)
                                            {
                                                obj.vertices.Add(Helper.GetFloat32(componentObj));
                                            }
                                            Helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                                            
                                        }
                                        
                                        
                                        // property indices
                                        {
                                            
                                            var count = Helper.GetArrayStart(componentObj);
                                            for (var i = 0; i < count; i++)
                                            {
                                                obj.indices.Add(Helper.GetInt32(componentObj));
                                            }
                                            Helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                                            
                                        }
                                        
                                        
                                        return obj;
                                    }
                                    
                                    // end statics
                                    }
                                    }