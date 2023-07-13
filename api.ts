import { ByteBuffer, Builder } from "flatbuffers";
import { CommitProposal, CommitProposalT } from "./bimrepo";
import { ServerLedger } from "./server_ledger";
import * as http from "http";
import { WebSocketServer, WebSocket } from 'ws';
import { CommitResponse, CommitResponseT } from "./bimrepo/commit-response";
const express = require('express')

const wss = new WebSocketServer({ noServer: true });
const app = express()
const port = 3000

let ledger = new ServerLedger();

app.use(express.raw());

function uuidv4() {
  return (<any>[1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

class WSListener
{
    ws: WebSocket;
    id: string;
    constructor(ws: WebSocket)
    {
      this.ws = ws;
      this.id = uuidv4();
    }

    notifyHeadChanged(newHead: number)
    {
      this.ws.send(newHead);
    }

    receive(obj: any)
    {
      // TODO: update rights
    }
}

let connections = new Map<string, WSListener>();

function AddConnection(listener: WSListener)
{
    connections.set(listener.id, listener);
}

ledger.AddListener("api", (commit: number) => {
  connections.forEach((conn) => {
    // TODO: filter
    conn.notifyHeadChanged(commit);
  })
});

wss.on('connection', function connection(connection) {
  let client = new WSListener(connection);

  AddConnection(client);

  connection.on('error', console.error);
  
  connection.on('message', function message(data) {
    client.receive(data);
  });

  connection.on("close", () => {
    connections.delete(client.id);
  });
});

function toArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return view;
  }

  function toBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  }

app.post('/commit', (req, res) => {
    let buf = toArrayBuffer(req.body);
    console.log(`Received ${buf.byteLength} bytes`);
    
    let commitProposal = new CommitProposalT();
    CommitProposal.getRootAsCommitProposal(new ByteBuffer(buf)).unpackTo(commitProposal);

    console.log(commitProposal);
    console.log(JSON.stringify(commitProposal, null, 4));

    let response = new CommitResponseT(ledger.Commit(commitProposal));

    let fbb = new Builder(1);
    CommitResponse.finishCommitResponseBuffer(fbb, response.pack(fbb));
    let responseBuffer = fbb.asUint8Array().slice(0);
    
    res.send(toBuffer(responseBuffer));
})

app.get('/commit/:id', (req, res) => {
  
  let commit = ledger.GetCommit(req.params.id);

  let fbb = new Builder(1);
  CommitProposal.finishCommitProposalBuffer(fbb, commit.pack(fbb));
  let responseBuffer = fbb.asUint8Array().slice(0);

  res.send(toBuffer(responseBuffer))
})

let server = http.createServer(app);


server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname } = new URL(request.url!);
  
  if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
  } else {
    socket.destroy();
  }
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});