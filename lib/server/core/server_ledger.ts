import { CommitProposalT, ComponentT, SchemaT } from "../../schema/bimrepo";


type LedgerListener = (number) => void;

type Entity = number;

export class Commit
{
    id: number;
    proposal: CommitProposalT;
}

export class ServerLedger
{
    private name: string;
    private commits: Commit[];
    private listeners: Map<string, LedgerListener>;
    private components: Map<Entity, Map<string, ComponentT>>;
    private types: Map<string, SchemaT>;

    constructor(name: string)
    {
        this.name = name;
        this.types = new Map();
        this.components = new Map();
        this.commits = [];
        this.listeners = new Map();
    }

    public GetName()
    {
        return this.name;
    }

    private UpdateComponent(component: ComponentT)
    {
        let entity = 0;
        if (!this.components.has(entity))
        {
            this.components.set(entity, new Map());
        }

        let map = this.components.get(entity)!;

        map.set(component.id?.typeHash as string, component);
    }

    private UpdateType(schema: SchemaT)
    {
        if (this.types.has(schema.hash as string))
        {
            console.log(`Type ${schema.id.join("::")} already exists, ignoring`);
            return;
        }

        this.types.set(schema.hash as string, schema);
    }
    
    private ValidateComponentForSchema(schema: SchemaT, component: ComponentT)
    {
        // TODO
        return true;
    }

    private ValidateComponent(component: ComponentT)
    {
        let type = component.id?.typeHash as string;
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

    private AddCommit(proposal: CommitProposalT)
    {
        let commit = new Commit();
        commit.proposal = proposal;
        commit.id = this.commits.length;
        this.commits.push(commit);

        return commit.id;
    }

    public Commit(proposal: CommitProposalT)
    {
        // process data
        proposal.diff?.updatedSchemas.forEach((schema: SchemaT) => this.UpdateType(schema));
        proposal.diff?.updatedComponents.forEach(this.ValidateComponent.bind(this));
        proposal.diff?.updatedComponents.forEach(this.UpdateComponent.bind(this));

        // return commit status
        let id = this.AddCommit(proposal);

        this.Notify(id);

        return id;
    }

    public GetHead()
    {
        return this.commits.length;
    }

    public GetCommit(id: number)
    {
        return this.commits[id];
    }
    
    public GetCommits(count: number)
    {
        let result: Commit[] = [];

        for (let i = Math.max(this.commits.length - count, 0); i < this.commits.length; i++)
        {
            result.push(this.commits[i]);
        }

        return result;
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
