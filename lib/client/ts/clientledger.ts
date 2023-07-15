import * as flatbuffers from "flatbuffers";
import axios from "axios";
import { ECSComponent } from "./ecs";
import { CommitDiffT, CommitProposal, CommitProposalT } from "../../schema/bimrepo";
import { CommitResponse, CommitResponseT } from "../../schema/bimrepo/commit-response";

export class IServerLedger
{
    private address: string;

    constructor(address: string)
    {
        this.address = address;
    }

    public async Commit(commitBuffer: Uint8Array)
    {
        let response = await axios.post(`${this.address}/commit`, 
            commitBuffer.buffer
        , {
            headers: {'Content-Type': 'application/octet-stream'},
        });

        return toArrayBuffer(response.data);
    }

    public async GetCommit(id: number)
    {
        let response = await axios.get(`${this.address}/commit/${id}`, {
            responseType: "arraybuffer"
        });
        return toArrayBuffer(response.data);
    }
}

function toArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return view;
  }

export default class ClientLedger {

    private modifiedComponents: ECSComponent[] = [];
    private serverLedger: IServerLedger;

    constructor(serverLedger: IServerLedger)
    {
        this.serverLedger = serverLedger;
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

        let responseBuffer = await this.serverLedger.Commit(requestBuffer);

        let commitResponse = new CommitResponseT();
        CommitResponse.getRootAsCommitResponse(new flatbuffers.ByteBuffer(responseBuffer)).unpackTo(commitResponse);

        return commitResponse.id;
    }

    async GetCommit(id: number)
    {
        let responseBuffer = await this.serverLedger.GetCommit(id);

        let commit = new CommitProposalT();
        CommitProposal.getRootAsCommitProposal(new flatbuffers.ByteBuffer(responseBuffer)).unpackTo(commit);

        return commit;
    }
}