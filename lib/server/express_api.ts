import { ByteBuffer, Builder } from "flatbuffers";
import { CommitProposal, CommitProposalT } from "../schema/bimrepo";
import { ServerLedger } from "./server_ledger";
import * as http from "http";
import { WebSocketServer, WebSocket } from 'ws';
import { CommitResponse, CommitResponseT } from "../schema/bimrepo/commit-response";
import { API, WSListener } from "./api";
const express = require('express')

const wss = new WebSocketServer({ noServer: true });
const app = express()
const port = 3000

app.use(express.raw());


let api = new API();

wss.on('connection', function connection(connection) {
  let client = new WSListener((id: number)=>{
    connection.send(id);
  });

  api.AddConnection(client);

  connection.on('error', console.error);
  
  connection.on('message', function message(data) {
    client.receive(data);
  });

  connection.on("close", () => {
    api.RemoveConnection(client.id);
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

    res.send(toBuffer(api.Commit(buf)));
})

app.get('/commit/:id', (req, res) => {
  
  res.send(toBuffer(api.GetCommit(req.params.id)))
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