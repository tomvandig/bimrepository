import { ComponentIdentifierT, ComponentT, SchemaT, uuidv4T } from '../../schema/bimrepo';
import * as crypto from "crypto";

export class Reference<T>
{
    constructor(entity: UUID4, typeHash: string, componentID: number)
    {
        this.entity = entity;
        this.typeHash = typeHash;
        this.componentID = componentID;
    }

    static From<T extends ECSComponent>(component: T)
    {
        return new Reference<T>(component.getEntityID(), component.getTypeHash(), 0);
    }

    entity: UUID4;
    typeHash: string;
    componentID: number;
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

    public equals(other: UUID4)
    {
        return this.bytes.every((val, index) => val === other.bytes[index]);
    }
}

export class ECSComponent {

    private simplifiedName: string;
    private typeHash: string;
    private entityID: UUID4;

    constructor(name: string, hash: string, entityID: UUID4)
    {
        this.simplifiedName = name;
        this.entityID = entityID;
        this.typeHash = hash;
    }

    getTypeHash()
    {
        return this.typeHash;
    }

    getSimplifiedName()
    {
        return this.simplifiedName;
    }

    exportToDataArray(id: ComponentIdentifierT) : ComponentT
    {
        return new ComponentT();
    }
    
    exportDefinitionToArray(): SchemaT {
        return new SchemaT();
    }

    getEntityID()
    {
        return this.entityID;
    }
}

