import Ledger, { IServerLedger } from "../../lib/client/ts/clientledger";

async function test()
{
    let server = new IServerLedger("localhost:3000");
    let ledger = new Ledger(server);
    
    ledger.SetNotifyHeadChanged(async (head: number) => {

        let commit = await ledger.GetCommit(head);

        console.log(JSON.stringify(commit, null, 4));
        console.log(`fetched commit ${head}`);
    })
}

test();