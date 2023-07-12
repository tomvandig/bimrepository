import { ComponentDataT, ComponentDataType, ComponentT } from "./bimrepo";


export function Expect(component: ComponentT, type: ComponentDataType)
{
    let data = component.data.shift();
    if (data.type !== type)
    {
        throw new Error(`Expected number but received ${data.type}`);
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