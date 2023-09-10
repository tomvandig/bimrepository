using bimrepo;

using System;

public class Helper
{
    public static ComponentDataT Expect(ComponentT component, ComponentDataType type, bool optional = false)
    {
        if (component.Data.Count == 0)
        {
            throw new Exception($"Expected ${ type } but reached end of data");
        }

        var data = component.Data[0];
        component.Data.RemoveAt(0);
        if (data.Type != type)
        {
            if (!(optional && data.Type == ComponentDataType.Empty))
            {
                throw new Exception($"Expected number but received {data.Type}");
            }
        }

        return data;
    }

    public static double GetNumber(ComponentT component)
    {
        var data = Expect(component, ComponentDataType.Number);
        return data.Num;
    }
    public static bool GetBool(ComponentT component)
    {
        var data = Expect(component, ComponentDataType.Boolean);
        return data.Boolean;
    }
    public static string GetString(ComponentT component)
    {
        var data = Expect(component, ComponentDataType.String);
        return data.Str;
    }

    public static Reference<T> GetRef<T>(ComponentT component)
    {
        var data = Expect(component, ComponentDataType.Ref, true);

        if (data.Type == ComponentDataType.Empty)
        {
            return null;
        }

        return new Reference<T>(
            UUID4.FromFB(component.Id.Entity),
            data.Ref.TypeHash,
            data.Ref.ComponentIndex
        );
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

    public static ComponentDataT MakeNumber(double num)
    {
        var p = new ComponentDataT();
        p.Type = ComponentDataType.Number;
        p.Num = num;
        return p;
    }

    public static ComponentDataT MakeBool(bool b)
    {
        var p = new ComponentDataT();
        p.Type = ComponentDataType.Boolean;
        p.Boolean = b;
        return p;
    }

    public static ComponentDataT MakeString(string str)
    {
        var p = new ComponentDataT();
        p.Type = ComponentDataType.String;
        p.Str = str;
        return p;
    }

    public static ComponentDataT MakeRef<T>(Reference<T> reference)
    {
        var p = new ComponentDataT();

        if (reference == null)
        {
            p.Type = ComponentDataType.Empty;
            return p;
        }

        p.Type = ComponentDataType.Ref;
        p.Ref = new ComponentIdentifierT();
        p.Ref.ComponentIndex = reference.componentID;
        p.Ref.TypeHash = reference.typeHash;
        p.Ref.Entity = new uuidv4T();
        p.Ref.Entity.Values = reference.entity.bytes;
        return p;
    }
}