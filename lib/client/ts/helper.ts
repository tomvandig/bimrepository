import { ComponentDataT, ComponentDataType, ComponentT } from "../../schema/bimrepo";


export function Expect(component: ComponentT, type: ComponentDataType)
{
    if (component.data.length === 0)
    {
        throw new Error(`Expected ${type} but reached end of data`);
    }
    let data = component.data.shift()!;
    if (data.type !== type)
    {
        throw new Error(`Expected ${type} but received ${data.type}`);
    }
    return data;
}

export function GetNumber(component: ComponentT)
{
    let data = Expect(component, ComponentDataType.Number);
    return data.num;
}

export function GetArrayStart(component: ComponentT)
{
    let data = Expect(component, ComponentDataType.ArrayStart);
    return data.arrayLength;
}

export function GetString(component: ComponentT)
{
    let data = Expect(component, ComponentDataType.String);
    return data.str as string;
}

export function GetBool(component: ComponentT)
{
    let data = Expect(component, ComponentDataType.Boolean);
    return data.boolean;
}

export function MakeArrayStart(length: number)
{
    let p = new ComponentDataT();
    p.type = ComponentDataType.ArrayStart;
    p.arrayLength = length;
    return p;
}

export function MakeArrayEnd()
{
    let p = new ComponentDataT();
    p.type = ComponentDataType.ArrayEnd;
    return p;
}

export function MakeNumber(num: number)
{
    let p = new ComponentDataT();
    p.type = ComponentDataType.Number;
    p.num = num;
    return p;
}

export function MakeString(str: string)
{
    let p = new ComponentDataT();
    p.type = ComponentDataType.String;
    p.str = str;
    return p;
}

export function MakeBool(bool: boolean)
{
    let p = new ComponentDataT();
    p.type = ComponentDataType.Boolean;
    p.boolean = bool;
    return p;
}