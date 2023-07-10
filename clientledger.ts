import * as flatbuffers from "flatbuffers";
import axios from "axios";
import { ECSComponent } from "./ecs";
import { CommitDiffT, CommitProposal, CommitProposalT } from "./bimrepo";
import { CommitResponse, CommitResponseT } from "./bimrepo/commit-response";


function toArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return view;
  }

export default class ClientLedger {

    private address: string;
    private modifiedComponents: ECSComponent[] = [];

    constructor(address)
    {
        this.address = address;
    }

    update(component: ECSComponent)
    {
        // TODO: check for duplicates
        this.modifiedComponents.push(component);
    }

    canCommit()
    {
        return this.modifiedComponents.length !== 0;
    }

    async commit(author: string, message: string): Promise<number>
    {
        if (!this.canCommit()) throw new Error(`No components to commit`);

        let commit = new CommitProposalT(); 

        commit.author = author;
        commit.message = message;

        commit.diff = new CommitDiffT();

        let exportedTypes = {};

        this.modifiedComponents.forEach((component) => {
            commit.diff?.updatedComponents.push(component.exportToDataArray());
            let name = component.getSimplifiedName();
            if (!exportedTypes[name])
            {
                exportedTypes[name] = true;
                commit.diff?.updatedSchemas.push(component.exportDefinitionToArray());
            }
        });

        let fbb = new flatbuffers.Builder(1);

        CommitProposal.finishCommitProposalBuffer(fbb, commit.pack(fbb));

        let requestBuffer = fbb.asUint8Array().slice(0);

        let response = await axios.post(`${this.address}/commit`, 
            requestBuffer.buffer
        , {
            headers: {'Content-Type': 'application/octet-stream'},
        });

        let buf = toArrayBuffer(response.data);
        
        let commitResponse = new CommitResponseT();
        CommitResponse.getRootAsCommitResponse(new flatbuffers.ByteBuffer(buf)).unpackTo(commitResponse);

        return commitResponse.id;
    }

    async GetCommit(id: number)
    {
        let response = await axios.get(`${this.address}/commit/${id}`, {
            responseType: "arraybuffer"
        });
        let buf = toArrayBuffer(response.data);

        let commit = new CommitProposalT();
        CommitProposal.getRootAsCommitProposal(new flatbuffers.ByteBuffer(buf)).unpackTo(commit);

        return commit;
    }
}