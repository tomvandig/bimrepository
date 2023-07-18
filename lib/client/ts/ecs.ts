import { ComponentIdentifierT, ComponentT, SchemaT, uuidv4T } from '../../schema/bimrepo';
import * as crypto from "crypto";

export class Reference<T>
{
    entity: UUID4;
    componentID: number;
    componentType: number;
}

export class UUID4
{
    bytes: Uint8Array = new Uint8Array(16);

    constructor()
    {
        crypto.getRandomValues(this.bytes);
    }

    static FromFB(fb: uuidv4T)
    {
        let id = new UUID4();
        id.bytes = new Uint8Array(fb.values);
        return id;
    }
}

export class ECSComponent {

    private simplifiedName: string;
    private entityID: UUID4;

    constructor(name: string, entityID: UUID4)
    {
        this.simplifiedName = name;
        this.entityID = entityID;
    }

    getSimplifiedName()
    {
        return this.simplifiedName;
    }

    exportToDataArray(id: ComponentIdentifierT) : ComponentT
    {
        return new ComponentT();
    }
    
    exportDefinitionToArray(referenceId: number): SchemaT {
        return new SchemaT();
    }

    getEntityID()
    {
        return this.entityID;
    }
}

