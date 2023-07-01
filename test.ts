import Ledger from "./ledger";
import { ifc2x3 } from "./output/ifc2x3_cartesianpoint";

let ledger = new Ledger("");

let point = new ifc2x3.cartesianpoint();
point.points = [1,2,33];
point.cardinality = 3;

ledger.update(point);

ledger.commit();