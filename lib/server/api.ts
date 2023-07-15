import { ByteBuffer, Builder } from "flatbuffers";
import { CommitProposal, CommitProposalT } from "../schema/bimrepo";
import { ServerLedger } from "./server_ledger";
import { CommitResponse, CommitResponseT } from "../schema/bimrepo/commit-response";


function uuidv4() {
  return (<any>[1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export class WSListener
{
    channel: (number)=>void;
    id: string;
    constructor(ws: (number)=>void)
    {
      this.channel = ws;
      this.id = uuidv4();
    }

    notifyHeadChanged(newHead: number)
    {
      this.channel(newHead);
    }

    receive(obj: any)
    {
      // TODO: update rights
    }
}

export class API
{
  connections = new Map<string, WSListener>();
  ledger = new ServerLedger();

  constructor()
  {
    this.ledger.AddListener("api", (commit: number) => {
      this.connections.forEach((conn) => {
        // TODO: filter
        conn.notifyHeadChanged(commit);
      })
    });
  }

  public AddConnection(listener: WSListener)
  {
      this.connections.set(listener.id, listener);
  }

  public RemoveConnection(id: string)
  {
    this.connections.delete(id);
  }

  public Commit(buf: Uint8Array)
  {
    let commitProposal = new CommitProposalT();
    CommitProposal.getRootAsCommitProposal(new ByteBuffer(buf)).unpackTo(commitProposal);

    let response = new CommitResponseT(this.ledger.Commit(commitProposal));

    let fbb = new Builder(1);
    CommitResponse.finishCommitResponseBuffer(fbb, response.pack(fbb));
    let responseBuffer = fbb.asUint8Array().slice(0);
    
    return responseBuffer;
  }

  public GetCommit(id: number)
  {
    let commit = this.ledger.GetCommit(id);

    let fbb = new Builder(1);
    CommitProposal.finishCommitProposalBuffer(fbb, commit.pack(fbb));
    let responseBuffer = fbb.asUint8Array().slice(0);

    return responseBuffer;
  }
}