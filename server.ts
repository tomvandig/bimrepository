import { ByteBuffer } from "flatbuffers";
import { CommitProposal, CommitProposalT } from "./bimrepo";

const express = require('express')
const app = express()
const port = 3000

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
    console.log(req.body);
    console.log(buf);

    
    let commitProposal = new CommitProposalT();
    CommitProposal.getRootAsCommitProposal(new ByteBuffer(buf)).unpackTo(commitProposal);

    console.log(commitProposal);

    res.send('POST request to the homepage')
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})