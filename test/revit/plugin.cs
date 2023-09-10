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

        void GetGeometryComponentForElement(Document doc, Element el)
        {
            Options options = new Options();
            var geom = el.get_Geometry(options);

            foreach (var geompart in geom)
            {
                Solid s = geompart as Solid;
                if (s != null)
                {
                    var face = s.Faces.get_Item(0);
                    var triangulation = face.Triangulate();

                    var material = face.MaterialElementId;
                    Material M = doc.GetElement(material) as Material;

                    var col = M.Color;

                    var tris = triangulation.NumTriangles;

                    for (int i = 0; i < tris; i++)
                    {
                        var tri = triangulation.get_Triangle(i);
                        var a = tri.get_Vertex(0);
                    }
                }
            }
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

            ledger.update(classification);
        }

        void ProcessDeletedElement(Document doc, Element el)
        {

        }

        void ProcessModifiedElement(Document doc, Element el)
        {

        }

        public async void application_DocumentChanged(object sender, DocumentChangedEventArgs args)
        {
            Debug.WriteLine($"Doc changed");
            try
            {
                Document doc = args.GetDocument();

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
            this.setup(commandData.Application);

            return Result.Succeeded;
        }
    }
}