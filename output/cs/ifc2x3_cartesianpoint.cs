
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

using bimrepo;

namespace ifc2x3 {
    // TODO: fix
    public class cartesianpoint : ECSComponent {
        
        public cartesianpoint() : base("ifc2x3_cartesianpoint") {
            
        }
        
        // properties
        public List<int> points = new();
            public int cardinality = 0;
            // end properties
            
            // methods
            bool validate() {
                return false;
            }
            
            
            public override ComponentT exportToDataArray() {
                ComponentT componentObj = new();
                
                componentObj.Type = new List<string>() {"ifc2x3","cartesianpoint"};
                    componentObj.Data = new List<ComponentDataT>();
                        
                        
                        // property points
                        componentObj.Data.Add(Helper.MakeArrayStart(this.points.Count));
                        this.points.ForEach((item) => componentObj.Data.Add(Helper.MakeNumber(item)));
                        componentObj.Data.Add(Helper.MakeArrayEnd());
                        
                        
                        // property cardinality
                        componentObj.Data.Add(Helper.MakeNumber(this.cardinality));
                        
                        
                        return componentObj;
                        }
                        
                        
                        public override SchemaT exportDefinitionToArray() {
                            var schemaObj = new SchemaT();
                            schemaObj.Id = new List<string>() { "ifc2x3","cartesianpoint" };
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
                                    
                                    
                                    
                                    return schemaObj;
                                    }
                                    
                                    // end methods
                                    
                                    // statics
                                    
                                    
                                    public static cartesianpoint importFromDataArray(ComponentT componentObj) {
                                        // TODO: check if component type matches the class
                                        
                                        var obj = new cartesianpoint();
                                        
                                        
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
                                        
                                        
                                        return obj;
                                    }
                                    
                                    // end statics
                                    }
                                    }