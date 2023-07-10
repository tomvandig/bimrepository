import { CommitProposalT, ComponentT, SchemaT } from "./bimrepo";


type LedgerListener = (CommitProposalT) => {};

export class ServerLedger
{
    private commits: CommitProposalT[];
    private listeners: Map<string, LedgerListener>;
    private components: Map<number, Map<string, ComponentT>>;
    private types: Map<string, SchemaT>;

    constructor()
    {
        this.types = new Map();
        this.components = new Map();
        this.commits = [];
        this.listeners = new Map();
    }

    private ComponentTypeAsString(type: string[])
    {
        return type.join("_");
    }

    private UpdateComponent(component: ComponentT)
    {
        let entity = 0;
        if (!this.components.has(entity))
        {
            this.components.set(entity, new Map());
        }

        let map = this.components.get(entity)!;

        let type = this.ComponentTypeAsString(component.type);
        map.set(type, component);
    }

    private UpdateType(schema: SchemaT)
    {
        let type = this.ComponentTypeAsString(schema.id);

        if (this.types.has(type))
        {
            console.log(`Type ${type} already exists, ignoring`);
            return;
        }

        this.types.set(type, schema);
    }
    
    private ValidateComponentForSchema(schema: SchemaT, component: ComponentT)
    {
        // TODO
        return true;
    }

    private ValidateComponent(component: ComponentT)
    {
        let type = this.ComponentTypeAsString(component.type);

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

    public Commit(proposal: CommitProposalT)
    {
        let id = this.commits.length;

        // process data
        proposal.diff?.updatedSchemas.forEach(this.UpdateType.bind(this));
        proposal.diff?.updatedComponents.forEach(this.ValidateComponent.bind(this));
        proposal.diff?.updatedComponents.forEach(this.UpdateComponent.bind(this));

        // return commit status
        this.commits.push(proposal);

        this.Notify(proposal);

        return id;
    }

    public GetCommit(id: number)
    {
        return this.commits[id];
    }

    private Notify(commit: CommitProposalT)
    {
        this.listeners.forEach((l) => l(commit));
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
