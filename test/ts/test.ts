import Ledger from "../../lib/client/ts/clientledger";
import { ifc2x3 } from "./schema_ts/ts/ifc2x3_cartesianpoint";

async function test()
{ 
    let ledger = new Ledger("http://localhost:3000");

    let point = new ifc2x3.cartesianpoint();
    point.points = [1,2,33];
    point.cardinality = 3;

    ledger.update(point);

    let num = await ledger.commit("bob@bob.com", "I done did a commit2");

    let commit = await ledger.GetCommit(num);

    let components = commit.diff?.updatedComponents;

    console.log(JSON.stringify(commit, null, 4));

    components?.forEach((component) => {
        let cartpoint = ifc2x3.cartesianpoint.importFromDataArray(component);
        console.log(cartpoint);
    });

}

test();