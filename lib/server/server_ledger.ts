import { CommitProposalT, ComponentT, SchemaT } from "../schema/bimrepo";


type LedgerListener = (number) => void;

export class ServerLedger
{
    private commits: CommitProposalT[];
    private listeners: Map<string, LedgerListener>;
    private components: Map<number, Map<number, ComponentT>>;
    private types: Map<number, SchemaT>;
    private componentNameToID: Map<string, number>;

    constructor()
    {
        this.types = new Map();
        this.components = new Map();
        this.commits = [];
        this.listeners = new Map();
        this.componentNameToID = new Map();
    }

    private ComponentTypeAsString(type: string[])
    {
        return type.join("_");
    }

    private GetComponentTypeID(type: string[])
    {
        let str = this.ComponentTypeAsString(type);

        if (this.componentNameToID.has(str))
        {
            return this.componentNameToID[str];
        }
        let id = this.componentNameToID.size;
        this.componentNameToID.set(str, id);
        return id;
    }

    private UpdateComponent(component: ComponentT)
    {
        let entity = 0;
        if (!this.components.has(entity))
        {
            this.components.set(entity, new Map());
        }

        let map = this.components.get(entity)!;

        map.set(component.id?.componentType!, component);
    }

    private UpdateType(schema: SchemaT, componentTypeIDMap: Map<number, number>)
    {
        let updateID = schema.referenceId;
        let sourceID = this.GetComponentTypeID(schema.id);

        componentTypeIDMap.set(updateID, sourceID);
        schema.referenceId = sourceID;

        if (this.types.has(sourceID))
        {
            console.log(`Type ${schema.id.join("::")} already exists, ignoring`);
            return;
        }

        this.types.set(sourceID, schema);
    }
    
    private ValidateComponentForSchema(schema: SchemaT, component: ComponentT)
    {
        // TODO
        return true;
    }

    private ValidateComponent(component: ComponentT)
    {
        let type = component.id?.componentType!;
        if (!this.types.has(type))
        {
            throw new Error(`Unknown component type ${type}`)
        }

        let schema = this.types.get(type)!;

        if (!this.ValidateComponentForSchema(schema, component))
        {
            throw new Error(`Invalid component in proposal`);
        }
    }

    private RewriteComponentTypeIds(updatedComponent: ComponentT, updateToServerTypeID: Map<number, number>)
    {
        let updateID = updatedComponent.id?.componentType!;

        if (!updateToServerTypeID.has(updateID))
        {
            throw new Error(`Unknown component type id ${updateID}`);
        }
        
        // rewrite the type ID to correspond to the server
        updatedComponent.id!.componentType = updateToServerTypeID.get(updateID)!;
    }

    public Commit(proposal: CommitProposalT)
    {
        let id = this.commits.length;

        let componentTypeIDMap = new Map<number, number>();

        // process data
        proposal.diff?.updatedSchemas.forEach((schema: SchemaT) => this.UpdateType(schema, componentTypeIDMap));
        proposal.diff?.updatedComponents.forEach((component: ComponentT) => this.RewriteComponentTypeIds(component, componentTypeIDMap));
        proposal.diff?.updatedComponents.forEach(this.ValidateComponent.bind(this));
        proposal.diff?.updatedComponents.forEach(this.UpdateComponent.bind(this));

        // return commit status
        this.commits.push(proposal);

        this.Notify(id);

        return id;
    }

    public GetCommit(id: number)
    {
        return this.commits[id];
    }

    private Notify(id: number)
    {
        this.listeners.forEach((l) => l(id));
    }
    

    public AddListener(name: string, listener: LedgerListener)
    {
        this.listeners.set(name, listener);
    }

    public RemoveListener(name: string)
    {
        this.listeners.delete(name);
    }
}
