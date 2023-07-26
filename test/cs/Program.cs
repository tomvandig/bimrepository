// See https://aka.ms/new-console-template for more information
using System.Drawing;
using System.Text;

var entity = new UUID4();

var point = new ifc2x3.cartesianpoint(entity);
point.cardinality = 3;
point.points.Add(1);
point.points.Add(2);
point.points.Add(33);
point.owner = "bob";
point.external = true;
point.parent = Reference<ifc2x3.cartesianpoint>.From(point);

var ledger = new ClientLedger("localhost:3000");

var wait = ledger.Listen();

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
    Console.WriteLine(cartpoint.owner);
    Console.WriteLine(cartpoint.external);
    Console.WriteLine(BitConverter.ToString(cartpoint.parent.entity.bytes));
    Console.WriteLine(cartpoint.parent.componentID);
    Console.WriteLine(cartpoint.parent.typeHash);
});

await wait;
