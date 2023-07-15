import Ledger, { IServerLedger } from "../../lib/client/ts/clientledger";
import { API } from "../../lib/server/api";
import { LedgerBridge } from "../../lib/util/ledger_bridge";
import { ifc2x3 } from "./schema_ts/ts/ifc2x3_cartesianpoint";

function GetRemoteServerLedger()
{
    return new IServerLedger("http://localhost:3000");
}

function GetLocalServerLedger()
{
    let server = new API();
    return new LedgerBridge(server);
}

async function test()
{ 
    let serverLedger = GetLocalServerLedger();

    let ledger = new Ledger(serverLedger);

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