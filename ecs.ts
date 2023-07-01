import { ComponentT, SchemaT } from './bimrepo';

export class ECSComponent {

    private simplifiedName: string;

    constructor(name: string)
    {
        this.simplifiedName = name;
    }

    getSimplifiedName()
    {
        return this.simplifiedName;
    }

    exportToDataArray() : ComponentT
    {
        return new ComponentT();
    }
    
    exportDefinitionToArray(): SchemaT {
        return new SchemaT();
    }
}

