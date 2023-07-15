using bimrepo;

public class Helper
{
    public static ComponentDataT Expect(ComponentT component, ComponentDataType type)
    {
        var data = component.Data.ElementAt(0);
        component.Data.RemoveAt(0);
        if (data.Type != type)
        {
            throw new Exception($"Expected number but received { data.Type }");
        }
        return data;
    }

    public static int GetNumber(ComponentT component)
    {
        var data = Expect(component, ComponentDataType.Number);
        return data.Num;
    }

    public static int GetArrayStart(ComponentT component)
    {
        var data = Expect(component, ComponentDataType.ArrayStart);
        return data.ArrayLength;
    }

    public static ComponentDataT MakeArrayStart(int length)
    {
        var p = new ComponentDataT();
        p.Type = ComponentDataType.ArrayStart;
        p.ArrayLength = length;
        return p;
    }

    public static ComponentDataT MakeArrayEnd()
    {
        var p = new ComponentDataT();
        p.Type = ComponentDataType.ArrayEnd;
        return p;
    }

    public static ComponentDataT MakeNumber(int num)
    {
        var p = new ComponentDataT();
        p.Type = ComponentDataType.Number;
        p.Num = num;
        return p;
    }
}