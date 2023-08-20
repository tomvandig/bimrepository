import { IServerLedger } from "../client/ts/clientledger";
import { API, WSListener } from "../server/core/api";


export class LedgerBridge extends IServerLedger
{
    api: API;
    wsListener: WSListener;

    constructor(api: API)
    {
        super("", "");
        this.api = api;
        this.api.AddLedger(this.ledgername);
        this.wsListener = new WSListener(this.InternalNotifyHeadChanged.bind(this));
        this.api.AddConnection(this.wsListener);
    }

    private InternalNotifyHeadChanged(head: number)
    {
        this.notifyHeadChanged(head);
    }

    public async Commit(commitBuffer: Uint8Array)
    {
        return this.api.Commit(this.ledgername, commitBuffer)!;   
    }

    public async GetCommit(id: number)
    {
        return this.api.GetCommit(this.ledgername, id)!;
    }

}