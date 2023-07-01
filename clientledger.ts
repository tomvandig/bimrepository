import * as flatbuffers from "flatbuffers";
import axios from "axios";
import { ECSComponent } from "./ecs";
import { CommitDiffT, CommitProposal, CommitProposalT } from "./bimrepo";


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

    async commit(author: string, message: string)
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

        let requestBuffer = fbb.asUint8Array();

        console.log(requestBuffer);

        let response = await axios.post(`${this.address}/commit`, {
            data: requestBuffer
        });

        console.log(response);
    }



}