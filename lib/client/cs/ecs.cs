
using bimrepo;

public class ECSComponent {

    private string simplifiedName;

    public ECSComponent(string name)
    {
        this.simplifiedName = name;
    }

    public string getSimplifiedName()
    {
        return this.simplifiedName;
    }

    public virtual ComponentT exportToDataArray()
    {
        return new ComponentT();
    }

    public virtual SchemaT exportDefinitionToArray() {
        return new SchemaT();
    }
}

