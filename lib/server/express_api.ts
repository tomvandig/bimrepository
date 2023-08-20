import * as http from "http";
import * as ws from 'ws';
import { API, WSListener } from "./core/api";
import express from "express";
import presentation_api from "./api/presentation_api";
import data_api from "./api/data_api";

const wss = new ws.WebSocketServer({ noServer: true });
const app = express()
const port = 3000

app.use(express.raw());

let api = new API();

presentation_api(app, api);
data_api(app, api);

wss.on('connection', function connection(connection) {
  let client = new WSListener((id: number)=>{
    connection.send(`${id}`);
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

let server = http.createServer(app);

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = request.url;

  
  if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);  
      });
  } else {
    socket.destroy();
  }
});

server.listen(port, () => {
    console.log(`Repo at port: ${port}`)
});