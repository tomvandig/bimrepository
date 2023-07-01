import { ifc2x3 } from "./output/ifc2x3_cartesianpoint";
import * as flatbuffers from "flatbuffers";

let fbb = new flatbuffers.Builder(1);

let point = new ifc2x3.cartesianpoint();
point.points = [1,2,33];
point.cardinality = 3;

point.exportToDataArray(fbb);

// ifc2x3.cartesianpoint.exportDefinitionToArray(fbb);

let arr = fbb.asUint8Array();
console.log(arr);

let obj = ifc2x3.cartesianpoint.importFromDataArray(new flatbuffers.ByteBuffer(arr));

console.log(obj);