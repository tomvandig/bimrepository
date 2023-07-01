import { ifc2x3 } from "./output/out";
import * as flatbuffers from "flatbuffers";

let fbb = new flatbuffers.Builder(1);

let point = new ifc2x3.cartesianpoint();
point.points = [1,2,3];
point.cardinality = 3;

point.exportToDataArray(fbb);

// ifc2x3.cartesianpoint.exportDefinitionToArray(fbb);

let arr = fbb.asUint8Array();
console.log(arr);

let obj = ifc2x3.cartesianpoint.buildFromDataArray(new flatbuffers.ByteBuffer(arr));

console.log(obj);