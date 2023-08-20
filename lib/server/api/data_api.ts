import { API, WSListener } from "../core/api";
import { Express } from "express";

export default function Init(app: Express, api: API)
{
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
    res.send(toBuffer(api.GetCommit(parseInt(req.params.id))))
  })
}