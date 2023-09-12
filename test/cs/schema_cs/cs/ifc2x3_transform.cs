
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

using bimrepo;
using System.Collections.Generic;

namespace ifc2x3 {
    public class transform : ECSComponent {
        
        public transform(UUID4 id) : base("ifc2x3_transform", "7867ba20c25ddfb9da771a03ba8a8de00b95f6d2dce266c00224af5b0339ecbc", id) {
            
        }
        
        // properties
        public List<float> basis_x = new List<float>();
            public List<float> basis_y = new List<float>();
                public List<float> basis_z = new List<float>();
                    public List<float> origin = new List<float>();
                        // end properties
                        
                        // methods
                        bool validate() {
                            return false;
                        }
                        
                        
                        public override ComponentT exportToDataArray(ComponentIdentifierT id) {
                            ComponentT componentObj = new ComponentT();
                            
                            componentObj.Id = id;
                            componentObj.Data = new List<ComponentDataT>();
                                
                                // property basis_x
                                componentObj.Data.Add(Helper.MakeArrayStart(this.basis_x.Count));
                                this.basis_x.ForEach((item) => {
                                    componentObj.Data.Add(Helper.MakeFloat32(item));
                                });
                                componentObj.Data.Add(Helper.MakeArrayEnd());
                                // property basis_y
                                componentObj.Data.Add(Helper.MakeArrayStart(this.basis_y.Count));
                                this.basis_y.ForEach((item) => {
                                    componentObj.Data.Add(Helper.MakeFloat32(item));
                                });
                                componentObj.Data.Add(Helper.MakeArrayEnd());
                                // property basis_z
                                componentObj.Data.Add(Helper.MakeArrayStart(this.basis_z.Count));
                                this.basis_z.ForEach((item) => {
                                    componentObj.Data.Add(Helper.MakeFloat32(item));
                                });
                                componentObj.Data.Add(Helper.MakeArrayEnd());
                                // property origin
                                componentObj.Data.Add(Helper.MakeArrayStart(this.origin.Count));
                                this.origin.ForEach((item) => {
                                    componentObj.Data.Add(Helper.MakeFloat32(item));
                                });
                                componentObj.Data.Add(Helper.MakeArrayEnd());
                                
                                return componentObj;
                                }
                                
                                
                                public override SchemaT exportDefinitionToArray() {
                                    var schemaObj = new SchemaT();
                                    schemaObj.Id = new List<string>() { "ifc2x3","transform" };
                                        schemaObj.Hash = this.getTypeHash();
                                        schemaObj.Schemaversion = "1";
                                        schemaObj.Comment = "";
                                        schemaObj.Description = "Transformation of the IFC element";
                                        
                                        
                                        schemaObj.SchemaShape = new shapeT();
                                        
                                        schemaObj.SchemaShape.Properties = new List<propertyT>();
                                            
                                            
                                            // property basis_x
                                            {
                                                var prop_basis_x = new propertyT();
                                                
                                                prop_basis_x.Name = "basis_x";
                                                prop_basis_x.Type = PropertyType.Array;
                                                
                                                prop_basis_x.Items = new ItemsT();
                                                prop_basis_x.Items.Type = PropertyType.Float32;
                                                
                                                
                                                schemaObj.SchemaShape.Properties.Add(prop_basis_x);
                                            }
                                            
                                            
                                            // property basis_y
                                            {
                                                var prop_basis_y = new propertyT();
                                                
                                                prop_basis_y.Name = "basis_y";
                                                prop_basis_y.Type = PropertyType.Array;
                                                
                                                prop_basis_y.Items = new ItemsT();
                                                prop_basis_y.Items.Type = PropertyType.Float32;
                                                
                                                
                                                schemaObj.SchemaShape.Properties.Add(prop_basis_y);
                                            }
                                            
                                            
                                            // property basis_z
                                            {
                                                var prop_basis_z = new propertyT();
                                                
                                                prop_basis_z.Name = "basis_z";
                                                prop_basis_z.Type = PropertyType.Array;
                                                
                                                prop_basis_z.Items = new ItemsT();
                                                prop_basis_z.Items.Type = PropertyType.Float32;
                                                
                                                
                                                schemaObj.SchemaShape.Properties.Add(prop_basis_z);
                                            }
                                            
                                            
                                            // property origin
                                            {
                                                var prop_origin = new propertyT();
                                                
                                                prop_origin.Name = "origin";
                                                prop_origin.Type = PropertyType.Array;
                                                
                                                prop_origin.Items = new ItemsT();
                                                prop_origin.Items.Type = PropertyType.Float32;
                                                
                                                
                                                schemaObj.SchemaShape.Properties.Add(prop_origin);
                                            }
                                            
                                            
                                            
                                            return schemaObj;
                                            }
                                            
                                            // end methods
                                            
                                            // statics
                                            
                                            
                                            public static transform importFromDataArray(ComponentT componentObj) {
                                                // TODO: check if component type matches the class
                                                
                                                var obj = new transform(UUID4.FromFB(componentObj.Id.Entity));
                                                
                                                
                                                // property basis_x
                                                {
                                                    
                                                    var count = Helper.GetArrayStart(componentObj);
                                                    for (var i = 0; i < count; i++)
                                                    {
                                                        obj.basis_x.Add(Helper.GetFloat32(componentObj));
                                                    }
                                                    Helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                                                    
                                                }
                                                
                                                
                                                // property basis_y
                                                {
                                                    
                                                    var count = Helper.GetArrayStart(componentObj);
                                                    for (var i = 0; i < count; i++)
                                                    {
                                                        obj.basis_y.Add(Helper.GetFloat32(componentObj));
                                                    }
                                                    Helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                                                    
                                                }
                                                
                                                
                                                // property basis_z
                                                {
                                                    
                                                    var count = Helper.GetArrayStart(componentObj);
                                                    for (var i = 0; i < count; i++)
                                                    {
                                                        obj.basis_z.Add(Helper.GetFloat32(componentObj));
                                                    }
                                                    Helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                                                    
                                                }
                                                
                                                
                                                // property origin
                                                {
                                                    
                                                    var count = Helper.GetArrayStart(componentObj);
                                                    for (var i = 0; i < count; i++)
                                                    {
                                                        obj.origin.Add(Helper.GetFloat32(componentObj));
                                                    }
                                                    Helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                                                    
                                                }
                                                
                                                
                                                return obj;
                                            }
                                            
                                            // end statics
                                            }
                                            }