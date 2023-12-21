using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Autodesk.Revit.UI.Selection;
using Autodesk.Revit.DB.Architecture;
using Autodesk.Revit.DB.Events;
using Autodesk.Revit.UI.Events;
using System.Diagnostics;

namespace IFC5
{
    [Transaction(TransactionMode.Manual)]
    [Regeneration(RegenerationOption.Manual)]
    public class LedgerPlugin : IExternalCommand
    {
        ClientLedger ledger;
        bool initialized = false;

        IList<Element> GetAllModelElements(Document doc)
        {
            List<Element> elements = new List<Element>();

            FilteredElementCollector collector
              = new FilteredElementCollector(doc)
                .WhereElementIsNotElementType();

            foreach (Element e in collector)
            {
                if (null != e.Category
                  && e.Category.HasMaterialQuantities)
                {
                    elements.Add(e);
                }
            }
            return elements;
        }

        public void setup(UIApplication application)
        {
            application.Application.DocumentChanged += new EventHandler
                       <Autodesk.Revit.DB.Events.DocumentChangedEventArgs>(application_DocumentChanged);

            this.ledger = new ClientLedger("localhost:3000", "ledger");

            var wait = ledger.Listen(async (int head) =>
            {
                var commit = await ledger.GetCommit(head);

                Debug.WriteLine($"Fetched commit {head}");
            });
        }

        void AddSolidToGeometryComponent(Transform transform, Document doc, Solid s, ifc2x3.geometry geometryComponent)
        {
            for (var i = 0; i < s.Faces.Size; i++)
            {
                var face = s.Faces.get_Item(i);

                var triangulation = face.Triangulate();

                if (transform != null)
                {
                    triangulation = triangulation.get_Transformed(transform);
                }

                int offsetForFace = geometryComponent.vertices.Count / 3;

                Color c = new Color(255, 255, 255);
                float transparency = 1;

                {
                    var material = face.MaterialElementId;
                    Material M = doc.GetElement(material) as Material;
                    if (M != null)
                    {
                        c = M.Color;
                        transparency = M.Transparency;
                    }
                }

                foreach (var vert in triangulation.Vertices)
                {
                    geometryComponent.vertices.Add((float)vert.X);
                    geometryComponent.vertices.Add((float)vert.Y);
                    geometryComponent.vertices.Add((float)vert.Z);

                    geometryComponent.colors.Add((float)c.Red / 255.0f);
                    geometryComponent.colors.Add((float)c.Green / 255.0f);
                    geometryComponent.colors.Add((float)c.Blue / 255.0f);
                    geometryComponent.colors.Add((float)transparency);
                }

                for (int j = 0; j < triangulation.NumTriangles; j++)
                {
                    var tri = triangulation.get_Triangle(j);
                    geometryComponent.indices.Add(offsetForFace + (int)tri.get_Index(0));
                    geometryComponent.indices.Add(offsetForFace + (int)tri.get_Index(1));
                    geometryComponent.indices.Add(offsetForFace + (int)tri.get_Index(2));
                }
            }
        }

        ifc2x3.geometry GetGeometryComponentForElement(Document doc, Element el)
        {
            var entity = GetElementUUID4(el);

            var geometryComponent = new ifc2x3.geometry(entity);

            Options options = new Options();
            var geom = el.get_Geometry(options);
            
            if (geom == null)
            {
                return geometryComponent;
            }

            geom = geom.GetTransformed(Transform.Identity);

            foreach (var geompart in geom)
            {
                Solid s = geompart as Solid;
                if (s != null)
                {
                    AddSolidToGeometryComponent(null, doc, s, geometryComponent);
                }

                GeometryInstance instance = geompart as GeometryInstance;
                if (instance != null)
                {
                    GeometryElement instanceGeometry = instance.GetInstanceGeometry();
                    Transform t = instance.Transform;
                    var transformedInstanceGeometry = instanceGeometry.GetTransformed(t);

                    foreach (var nestedGeomPart in transformedInstanceGeometry)
                    {
                        Solid solid = nestedGeomPart as Solid;
                        if (solid != null)
                        {
                            AddSolidToGeometryComponent(null, doc, solid, geometryComponent);
                        }
                    }
                }
            }

            return geometryComponent;
        }

        void GetTransformComponentForElement(Document doc, Element el)
        {
            var instance = el as Instance;

            if (instance != null)
            {
                var transform = instance.GetTransform();
            }
        }
        UUID4 GetElementUUID4(Element el)
        {
            var ifcGuid = el.get_Parameter(BuiltInParameter.IFC_GUID).AsString();

            return UUID4.FromIfcGuid(ifcGuid);
        }

        void ProcessAddedElement(Document doc, Element el)
        {
            var entity = GetElementUUID4(el);

            // creating a classification creates the entity
            var classification = new ifc2x3.classification(entity);

            classification.classification_name = el.Category.BuiltInCategory.ToString();


            var geometry = GetGeometryComponentForElement(doc, el);

            if (geometry.vertices.Count > 0)
            {
                ledger.update(classification);

                ledger.update(geometry);
            }
        }

        void ProcessDeletedElement(Document doc, Element el)
        {
            return;

            // we can't actually do this since the element is already deleted
            // should find some "before delete" event

            var entity = GetElementUUID4(el);

            // setting classification to "deleted" deletes entity
            var classification = new ifc2x3.classification(entity);

            classification.classification_name = "deleted";

            ledger.update(classification);
        }

        void ProcessModifiedElement(Document doc, Element el)
        {
            var geometry = GetGeometryComponentForElement(doc, el);

            ledger.update(geometry);
        }

        public async void application_DocumentChanged(object sender, DocumentChangedEventArgs args)
        {
            Debug.WriteLine($"Doc changed");


            try
            {
                Document doc = args.GetDocument();
                
                if (!initialized)
                {
                    var elements = this.GetAllModelElements(doc);

                    foreach (var element in elements ) { 
                        this.ProcessAddedElement(doc, element);
                    }

                    initialized = true;
                }

                foreach (var id in args.GetAddedElementIds())
                {
                    var el = doc.GetElement(id);
                    this.ProcessAddedElement(doc, el);
                }

                foreach (var id in args.GetDeletedElementIds())
                {
                    var el = doc.GetElement(id);
                    this.ProcessDeletedElement(doc, el);
                }

                foreach (var id in args.GetModifiedElementIds())
                {
                    var el = doc.GetElement(id);
                    this.ProcessModifiedElement(doc, el);
                }

                if (this.ledger.canCommit())
                {
                    var num = await this.ledger.commit("bob@bob.com", "I done did a commit2");
                }
            }
            catch(Exception ex)
            { 
                Debug.Write(ex);
            }
        }

        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            initialized = false;
            this.setup(commandData.Application);

            return Result.Succeeded;
        }
    }
}