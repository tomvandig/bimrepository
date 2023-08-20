import Ledger, { IServerLedger } from "../../lib/client/ts/clientledger";
import { Reference, UUID4 } from "../../lib/client/ts/ecs";
import { ifc2x3 } from "./schema_ts/ts/ifc2x3_cartesianpoint";

function MakeBasicCartesianPoint()
{
    let point = new ifc2x3.cartesianpoint(new UUID4());
    point.points = [1,2,33];
    point.cardinality = 3;
    point.external = true;
    point.owner = "bob";
    point.parent = Reference.From(point);
    return point;
}

async function test()
{
    let server = new IServerLedger("localhost:3000", "structural");
    let ledger = new Ledger(server);
    
    ledger.update(MakeBasicCartesianPoint());

    let num = await ledger.commit("bob@bob.com", "Commit from playground");

    /*
    ledger.SetNotifyHeadChanged(async (head: number) => {

        let commit = await ledger.GetCommit(head);

        console.log(JSON.stringify(commit, null, 4));
        console.log(`fetched commit ${head}`);
    })
    */
}

test();