
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

using bimrepo;

namespace ifc2x3 {
    // TODO: fix
    public class cartesianpoint : ECSComponent {
        
        public cartesianpoint(UUID4 id) : base("ifc2x3_cartesianpoint", id) {
            
        }
        
        // properties
        List<int> points = new();
            int cardinality = 0;
            string owner = "";
            bool external = false;
            Reference<ifc2x3.cartesianpoint> parent = null;
                // end properties
                
                // methods
                bool validate() {
                    return false;
                }
                
                
                public override ComponentT exportToDataArray(ComponentIdentifierT id) {
                    ComponentT componentObj = new();
                    
                    componentObj.Id = id;
                    componentObj.Data = new List<ComponentDataT>();
                        
                        // property points
                        componentObj.Data.Add(Helper.MakeArrayStart(this.points.Count));
                        this.points.ForEach((item) => {
                            componentObj.Data.Add(Helper.MakeNumber(item));
                        });
                        componentObj.Data.Add(Helper.MakeArrayEnd());
                        // property cardinality
                        componentObj.Data.Add(Helper.MakeNumber(this.cardinality));
                        // property owner
                        componentObj.Data.Add(Helper.MakeString(this.owner));
                        // property external
                        componentObj.Data.Add(Helper.MakeBool(this.external));
                        // property parent
                        componentObj.Data.Add(Helper.MakeRef(this.parent!));
                        
                        return componentObj;
                        }
                        
                        
                        public override SchemaT exportDefinitionToArray(UInt16 referenceId) {
                            var schemaObj = new SchemaT();
                            schemaObj.Id = new List<string>() { "ifc2x3","cartesianpoint" };
                                schemaObj.ReferenceId = referenceId;
                                schemaObj.Schemaversion = "1";
                                schemaObj.Comment = "TODO: fix";
                                schemaObj.Description = "Cartesianpoint of ifc version 2x3";
                                
                                
                                schemaObj.SchemaShape = new shapeT();
                                
                                schemaObj.SchemaShape.Properties = new List<propertyT>();
                                    
                                    
                                    // property points
                                    {
                                        var prop_points = new propertyT();
                                        
                                        prop_points.Name = "points";
                                        prop_points.Type = PropertyType.Array;
                                        
                                        prop_points.Items = new ItemsT();
                                        prop_points.Items.Type = PropertyType.Number;
                                        
                                        
                                        schemaObj.SchemaShape.Properties.Add(prop_points);
                                    }
                                    
                                    
                                    // property cardinality
                                    {
                                        var prop_cardinality = new propertyT();
                                        
                                        prop_cardinality.Name = "cardinality";
                                        prop_cardinality.Type = PropertyType.Number;
                                        
                                        
                                        schemaObj.SchemaShape.Properties.Add(prop_cardinality);
                                    }
                                    
                                    
                                    // property owner
                                    {
                                        var prop_owner = new propertyT();
                                        
                                        prop_owner.Name = "owner";
                                        prop_owner.Type = PropertyType.String;
                                        
                                        
                                        schemaObj.SchemaShape.Properties.Add(prop_owner);
                                    }
                                    
                                    
                                    // property external
                                    {
                                        var prop_external = new propertyT();
                                        
                                        prop_external.Name = "external";
                                        prop_external.Type = PropertyType.Boolean;
                                        
                                        
                                        schemaObj.SchemaShape.Properties.Add(prop_external);
                                    }
                                    
                                    
                                    // property parent
                                    {
                                        var prop_parent = new propertyT();
                                        
                                        prop_parent.Name = "parent";
                                        prop_parent.Type = PropertyType.Ref;
                                        
                                        
                                        schemaObj.SchemaShape.Properties.Add(prop_parent);
                                    }
                                    
                                    
                                    
                                    return schemaObj;
                                    }
                                    
                                    // end methods
                                    
                                    // statics
                                    
                                    
                                    public static cartesianpoint importFromDataArray(ComponentT componentObj) {
                                        // TODO: check if component type matches the class
                                        
                                        var obj = new cartesianpoint(UUID4.FromFB(componentObj.Id?.Entity!));
                                            
                                            
                                            // property points
                                            {
                                                
                                                var count = Helper.GetArrayStart(componentObj);
                                                for (var i = 0; i < count; i++)
                                                {
                                                    obj.points.Add(Helper.GetNumber(componentObj));
                                                }
                                                Helper.Expect(componentObj, ComponentDataType.ArrayEnd);
                                                
                                            }
                                            
                                            
                                            // property cardinality
                                            {
                                                
                                                obj.cardinality = Helper.GetNumber(componentObj);
                                                
                                            }
                                            
                                            
                                            // property owner
                                            {
                                                
                                                obj.owner = Helper.GetString(componentObj);
                                                
                                            }
                                            
                                            
                                            // property external
                                            {
                                                
                                                obj.external = Helper.GetBool(componentObj);
                                                
                                            }
                                            
                                            
                                            // property parent
                                            {
                                                
                                                obj.parent = Helper.GetRef<cartesianpoint>(componentObj);
                                                    
                                                    }
                                                    
                                                    
                                                    return obj;
                                                    }
                                                    
                                                    // end statics
                                                    }
                                                    }