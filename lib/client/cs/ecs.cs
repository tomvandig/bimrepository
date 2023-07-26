
using bimrepo;
using System.Security.Cryptography;
using System;

public class Reference<T>
{
    public UUID4 entity;
    public string typeHash;
    public UInt16 componentID;

    public Reference(UUID4 entity, string typeHash, UInt16 componentID)
    {
        this.entity = entity;
        this.componentID = componentID;
        this.typeHash = typeHash;
    }

    public static Reference<T> From<T>(T component) where T : ECSComponent
    {
        return new Reference<T>(component.getEntityID(), component.getTypeHash(), 0);
    }
}

public class UUID4
{
    public byte[] bytes;

    public UUID4()
    {
        bytes = new byte[16];

        // TODO: slow
        RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
        rng.GetBytes(bytes);
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
    private string typeHash;
    private UUID4 entityID;

    public ECSComponent(string name, string typeHash, UUID4 entityID)
    {
        this.simplifiedName = name;
        this.entityID = entityID;
        this.typeHash = typeHash;
    }

    public string getSimplifiedName()
    {
        return this.simplifiedName;
    }

    public string getTypeHash()
    {
        return this.typeHash;
    }

    public virtual ComponentT exportToDataArray(ComponentIdentifierT id)
    {
        return new ComponentT();
    }

    public virtual SchemaT exportDefinitionToArray() {
        return new SchemaT();
    }
    public UUID4 getEntityID()
    {
        return this.entityID;
    }
}

