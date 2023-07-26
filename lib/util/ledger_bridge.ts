import { IServerLedger } from "../client/ts/clientledger";
import { API, WSListener } from "../server/api";


export class LedgerBridge extends IServerLedger
{
    api: API;
    wsListener: WSListener;

    constructor(api: API)
    {
        super("");
        this.api = api;
        this.wsListener = new WSListener(this.InternalNotifyHeadChanged.bind(this));
        this.api.AddConnection(this.wsListener);
    }

    private InternalNotifyHeadChanged(head: number)
    {
        this.notifyHeadChanged(head);
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