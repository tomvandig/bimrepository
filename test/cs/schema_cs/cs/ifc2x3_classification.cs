
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

using bimrepo;
using System.Collections.Generic;

namespace ifc2x3 {
    public class classification : ECSComponent {
        
        public classification(UUID4 id) : base("ifc2x3_classification", "9f3516c293e818dba97659b2c8af614e6ad70ea3a2f8b41c6d2b94cf7fbec717", id) {
            
        }
        
        // properties
        public string classification_name = "";
        // end properties
        
        // methods
        bool validate() {
            return false;
        }
        
        
        public override ComponentT exportToDataArray(ComponentIdentifierT id) {
            ComponentT componentObj = new ComponentT();
            
            componentObj.Id = id;
            componentObj.Data = new List<ComponentDataT>();
                
                // property classification_name
                componentObj.Data.Add(Helper.MakeString(this.classification_name));
                
                return componentObj;
                }
                
                
                public override SchemaT exportDefinitionToArray() {
                    var schemaObj = new SchemaT();
                    schemaObj.Id = new List<string>() { "ifc2x3","classification" };
                        schemaObj.Hash = this.getTypeHash();
                        schemaObj.Schemaversion = "1";
                        schemaObj.Comment = "";
                        schemaObj.Description = "Classification of the IFC element";
                        
                        
                        schemaObj.SchemaShape = new shapeT();
                        
                        schemaObj.SchemaShape.Properties = new List<propertyT>();
                            
                            
                            // property classification_name
                            {
                                var prop_classification_name = new propertyT();
                                
                                prop_classification_name.Name = "classification_name";
                                prop_classification_name.Type = PropertyType.String;
                                
                                
                                schemaObj.SchemaShape.Properties.Add(prop_classification_name);
                            }
                            
                            
                            
                            return schemaObj;
                            }
                            
                            // end methods
                            
                            // statics
                            
                            
                            public static classification importFromDataArray(ComponentT componentObj) {
                                // TODO: check if component type matches the class
                                
                                var obj = new classification(UUID4.FromFB(componentObj.Id.Entity));
                                
                                
                                // property classification_name
                                {
                                    
                                    obj.classification_name = Helper.GetString(componentObj);
                                    
                                }
                                
                                
                                return obj;
                            }
                            
                            // end statics
                            }
                            }