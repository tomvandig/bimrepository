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

        public async void application_DocumentChanged(object sender, DocumentChangedEventArgs args)
        {
            Debug.WriteLine($"Doc changed");
            try
            {
                Document doc = args.GetDocument();


                var added = args.GetAddedElementIds();

                var modified = args.GetModifiedElementIds();

                var deleted = args.GetDeletedElementIds();

                if (added.Count > 0)
                {
                    var entity = new UUID4();

                    var point = new ifc2x3.cartesianpoint(entity);
                    point.cardinality = 3;
                    point.points.Add(1);
                    point.points.Add(2);
                    point.points.Add(33);
                    point.owner = "bob";
                    point.external = true;
                    point.parent = Reference<ifc2x3.cartesianpoint>.From(point);

                    ledger.update(point);

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