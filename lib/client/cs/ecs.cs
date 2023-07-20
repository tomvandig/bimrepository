
using bimrepo;

public class Reference<T>
{
    public UUID4 entity;
    public UInt16 componentID;
    public UInt16 componentType;

    public Reference(UUID4 entity, UInt16 componentID, UInt16 componentType)
    {
        this.entity = entity;
        this.componentID = componentID;
        this.componentType = componentType;
    }   
}

public class UUID4
{
    public byte[] bytes;

    public UUID4()
    {
        bytes = new byte[16];
    }

    public static UUID4 FromFB(uuidv4T uuid)
    {
        var id = new UUID4();
        id.bytes = uuid.Values;
        return id;
    }

    public bool Equals(UUID4 other)
    {
        return this.bytes.Equals(other.bytes);
    }
}
public class ECSComponent {

    private string simplifiedName;
    private UUID4 entityID;

    public ECSComponent(string name, UUID4 entityID)
    {
        this.simplifiedName = name;
        this.entityID = entityID;   
    }

    public string getSimplifiedName()
    {
        return this.simplifiedName;
    }

    public virtual ComponentT exportToDataArray(ComponentIdentifierT id)
    {
        return new ComponentT();
    }

    public virtual SchemaT exportDefinitionToArray(int referenceId) {
        return new SchemaT();
    }
    public UUID4 getEntityID()
    {
        return this.entityID;
    }
}

