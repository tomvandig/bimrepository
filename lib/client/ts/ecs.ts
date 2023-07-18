import { ComponentIdentifierT, ComponentT, SchemaT } from '../../schema/bimrepo';

export class Reference<T>
{

}

export class UUID4
{
    bytes: Uint8Array = new Uint8Array(16);

    constructor()
    {
        crypto.getRandomValues(this.bytes);
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

