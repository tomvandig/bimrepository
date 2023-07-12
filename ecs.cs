
using bimrepo;

public class ECSComponent {

    private string simplifiedName;

    public ECSComponent(string name)
    {
        this.simplifiedName = name;
    }

    string getSimplifiedName()
    {
        return this.simplifiedName;
    }

    ComponentT exportToDataArray()
    {
        return new ComponentT();
    }

    SchemaT exportDefinitionToArray() {
        return new SchemaT();
    }
}

