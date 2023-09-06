import crypto from "crypto"
import { ByteBuffer, Builder } from "flatbuffers";
import { CommitProposal, CommitProposalT } from "../../schema/bimrepo";
import { ServerLedger } from "./server_ledger";
import { CommitResponse, CommitResponseT } from "../../schema/bimrepo/commit-response";

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
  ledgers = new Map<string, ServerLedger>();

  constructor()
  {
  }

  public AddLedger(name: string)
  {
    let ledger = new ServerLedger(name);
    this.ledgers.set(name, ledger);
    
    ledger.AddListener("api", (commit: number) => {
      this.connections.forEach((conn) => {
        // TODO: filter
        conn.notifyHeadChanged(commit);
      })
    });

    return ledger;
  }

  public GetLedger(name: string)
  {
    return this.ledgers.get(name);
  }

  public GetLedgers()
  {
    return [...this.ledgers.values()];
  }

  public AddConnection(listener: WSListener)
  {
      this.connections.set(listener.id, listener);
  }

  public RemoveConnection(id: string)
  {
    this.connections.delete(id);
  }

  public GetHead(name: string)
  {
    return this.ledgers.get(name)?.GetHead();
  }

  public Commit(name: string, buf: Uint8Array)
  {
    let ledger = this.ledgers.get(name);

    if (!ledger)
    {
      console.log(`Ledger ${name} not found`);
      return null;
    }

    let commitProposal = new CommitProposalT();
    CommitProposal.getRootAsCommitProposal(new ByteBuffer(buf)).unpackTo(commitProposal);

    let response = new CommitResponseT(ledger.Commit(commitProposal));

    let fbb = new Builder(1);
    CommitResponse.finishCommitResponseBuffer(fbb, response.pack(fbb));
    let responseBuffer = fbb.asUint8Array().slice(0);
    
    return responseBuffer;
  }

  public GetCommit(name: string, id: number)
  {
    let ledger = this.ledgers.get(name);

    if (!ledger)
    {
      console.log(`Ledger ${name} not found`);
      return null;
    }

    let commit = ledger.GetCommit(id);

    let fbb = new Builder(1);
    CommitProposal.finishCommitProposalBuffer(fbb, commit.proposal.pack(fbb));
    let responseBuffer = fbb.asUint8Array().slice(0);

    return responseBuffer;
  }
}