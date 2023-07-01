import * as flatbuffers from "flatbuffers";
import { ECSComponent } from "./ecs";


export default class Ledger {

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

    commit()
    {
        if (!this.canCommit()) throw new Error(`No components to commit`);

        let fbb = new flatbuffers.Builder(1);

        this.modifiedComponents.forEach((component) => {
            component.exportToDataArray(fbb);
        });

        let arr = fbb.asUint8Array();

        console.log(arr);

        // TODO: send to server
    }



}