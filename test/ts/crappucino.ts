
// mocha is being difficult and it doesn't do much
let path: string[] = [];

export async function describe(name: string, fn: any)
{
    path.push(name);
    console.log(` [  ] ${path.join("::")}`);
    await fn();
    path.pop();
}

export async function it(name: string, fn: any)
{
    try
    {
        await fn();
    } catch(e)
    {
        console.log(` --- [FAIL] --- ${path.join("::")}::${name}`);
        console.log(e);
        return;
    }

    console.log(` [OK] ${path.join("::")}::${name}`);
}