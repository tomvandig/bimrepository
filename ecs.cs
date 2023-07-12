
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

    public ComponentT exportToDataArray()
    {
        return new ComponentT();
    }

    public SchemaT exportDefinitionToArray() {
        return new SchemaT();
    }
}

