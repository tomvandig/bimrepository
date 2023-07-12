// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");

var obj = new ifc2x3.cartesianpoint();
obj.cardinality = 3;
obj.points.Add(1);
obj.points.Add(2);
obj.points.Add(33);

var dataArray = obj.exportToDataArray();

var result = ifc2x3.cartesianpoint.importFromDataArray(dataArray);

Console.WriteLine(result.cardinality);
Console.WriteLine(result.points.ToString());
