import { ByteBuffer, Builder } from "flatbuffers";
import { CommitProposal, CommitProposalT } from "./bimrepo";
import { ServerLedger } from "./server_ledger";
import * as http from "http";
import { WebSocketServer } from 'ws';
import { CommitResponse, CommitResponseT } from "./bimrepo/commit-response";
const express = require('express')

const wss = new WebSocketServer({ noServer: true });
const app = express()
const port = 3000

let ledger = new ServerLedger();

app.use(express.raw());


wss.on('connection', function connection(connection) {
  connection.on('error', console.error);
  
  connection.on('message', function message(data) {
    console.log('received: %s', data);
  });

  connection.send('something');
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