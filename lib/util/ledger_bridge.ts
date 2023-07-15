import { IServerLedger } from "../client/ts/clientledger";
import { API } from "../server/api";


export class LedgerBridge extends IServerLedger
{
    api: API;

    constructor(api: API)
    {
        super("");
        this.api = api;
    }

    public async Commit(commitBuffer: Uint8Array)
    {
        return this.api.Commit(commitBuffer);   
    }

    public async GetCommit(id: number)
    {
        return this.api.GetCommit(id);
    }

}