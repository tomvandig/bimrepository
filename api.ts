import { ByteBuffer } from "flatbuffers";
import { CommitProposal, CommitProposalT } from "./bimrepo";
import { ServerLedger } from "./server_ledger";

const express = require('express')
const app = express()
const port = 3000

let ledger = new ServerLedger();

app.use(express.raw());

function toArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return view;
  }

app.post('/commit', (req, res) => {
    let buf = toArrayBuffer(req.body);
    
    let commitProposal = new CommitProposalT();
    CommitProposal.getRootAsCommitProposal(new ByteBuffer(buf)).unpackTo(commitProposal);

    console.log(commitProposal);
    console.log(JSON.stringify(commitProposal, null, 4));

    ledger.Commit(commitProposal);

    res.send('POST request to the homepage')
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})