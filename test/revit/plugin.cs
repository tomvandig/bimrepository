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

namespace Lab1PlaceGroup
{
    [Transaction(TransactionMode.Manual)]
    [Regeneration(RegenerationOption.Manual)]
    public class plugin : IExternalCommand
    {
        async void publish()
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

            var ledger = new ClientLedger("localhost:3000", "ledger");

            var wait = ledger.Listen(async (int head) =>
            {
                var commit = await ledger.GetCommit(head);

                Console.WriteLine($"Fetched commit {commit.Message}");
            });

            ledger.update(point);

            var num = await ledger.commit("bob@bob.com", "I done did a commit2");
        }

        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            publish();

            return Result.Succeeded;
        }
    }
}