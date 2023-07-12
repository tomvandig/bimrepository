// See https://aka.ms/new-console-template for more information
using System.Drawing;

var point = new ifc2x3.cartesianpoint();
point.cardinality = 3;
point.points.Add(1);
point.points.Add(2);
point.points.Add(33);


var ledger = new ClientLedger("http://localhost:3000");


ledger.update(point);

var num = await ledger.commit("bob@bob.com", "I done did a commit2");


var commit = await ledger.GetCommit(num);


var components = commit.Diff?.UpdatedComponents;

components?.ForEach((component) => {
    var cartpoint = ifc2x3.cartesianpoint.importFromDataArray(component);
    Console.WriteLine(cartpoint.cardinality);
    Console.WriteLine(cartpoint.points[0]);
    Console.WriteLine(cartpoint.points[1]);
    Console.WriteLine(cartpoint.points[2]);
});
