import Ledger from "./clientledger";
import { ifc2x3 } from "./output/ifc2x3_cartesianpoint";

async function test()
{ 
    let ledger = new Ledger("http://localhost:3000");

    let point = new ifc2x3.cartesianpoint();
    point.points = [1,2,33];
    point.cardinality = 3;

    ledger.update(point);

    let num = await ledger.commit("bob@bob.com", "I done did a commit");

    let commit = await ledger.GetCommit(num);

    console.log(JSON.stringify(commit, null, 4));
}

test();