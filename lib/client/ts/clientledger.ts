import * as flatbuffers from "flatbuffers";
import axios from "axios";
import { ECSComponent } from "./ecs";
import { CommitDiffT, CommitProposal, CommitProposalT, ComponentIdentifierT, ComponentT, uuidv4T } from "../../schema/bimrepo";
import { CommitResponse, CommitResponseT } from "../../schema/bimrepo/commit-response";

export class IServerLedger
{
    private address: string;
    protected notifyHeadChanged: (head: number) => void | undefined;
    private ws: WebSocket;
    
    constructor(address: string)
    {
        this.address = address;

        if (this.address != "")
        {
            this.ws = new WebSocket(
                `${this.address}/ws`
            );
            this.ws.onmessage = (event) => {
                let head = event.data;
                if (this.notifyHeadChanged)
                {
                    this.notifyHeadChanged(head);
                }
            };
        }
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

    public async NotifyHeadChanged(headChanged: (head: number)=>void)
    {
        this.notifyHeadChanged = headChanged;
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
    private notifyHeadChanged: (head: number) => void | undefined;
    private observedCommits: number[] = [];

    constructor(serverLedger: IServerLedger, )
    {
        this.serverLedger = serverLedger;
        serverLedger.NotifyHeadChanged(this.NotifyHeadChanged.bind(this));
    }

    public SetNotifyHeadChanged(headChanged: (head: number) => void)
    {
        this.notifyHeadChanged = headChanged;
    }

    private NotifyHeadChanged(head: number)
    {
        this.observedCommits.push(head);
        if (this.notifyHeadChanged)
        {
            this.notifyHeadChanged(head);
        }
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

    private ComponentToIdentifier(component: ECSComponent)
    {
        let id = new ComponentIdentifierT();

        // entity id
        let uuidv4 = new uuidv4T();
        uuidv4.values = [...component.getEntityID().bytes.values()];
        id.entity = uuidv4;

        id.typeHash = component.getTypeHash();
        id.componentIndex = 0; // temporarily hardcoded 1 component per entity

        return id;
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
            let id = this.ComponentToIdentifier(component);
            let exported = component.exportToDataArray(id);
            commit.diff?.updatedComponents.push(exported);
            let name = component.getSimplifiedName();
            if (!exportedTypes[name])
            {
                exportedTypes[name] = true;
                let data = component.exportDefinitionToArray();
                commit.diff?.updatedSchemas.push(data);
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