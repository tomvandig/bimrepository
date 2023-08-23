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
  
  app.post('/data/:ledgername/commit', (req, res) => {
      const ledgerName = req.params.ledgername;

      let buf = toArrayBuffer(req.body);
  
      res.send(toBuffer(api.Commit(ledgerName, buf)));
  })
  
  app.get('/data/:ledgername/commit/:id', (req, res) => {
    const ledgerName = req.params.ledgername;
    
    res.send(toBuffer(api.GetCommit(ledgerName, parseInt(req.params.id))))
  })
}