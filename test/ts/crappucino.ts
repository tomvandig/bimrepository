
// mocha is being difficult and it doesn't do much
let globalPath: string[] = [];


class Test
{
    path: string;
    fn: any;

    constructor(path: string, fn: any)
    {
        this.path = path;
        this.fn = fn;
    }

    async exec()
    {
        console.log(` [  ] ${this.path}`);
     
        try
        {
            await this.fn();
        } catch(e)
        {
            console.log(` --- [FAIL] --- ${this.path}`);
            console.log(e);
            return;
        }   

        console.log(` [OK] ${this.path}`);
    }
}

let testlist: Test[] = [];

export async function describe(name: string, fn: any)
{
    globalPath.push(name);
    await fn();
    globalPath.pop();
}

export async function it(name: string, fn: any)
{
    globalPath.push(name);
    testlist.push(new Test(globalPath.join("::"), fn));
    globalPath.pop();
}

export async function test()
{
    for (let i = 0; i < testlist.length; i++)
    {
        await testlist[i].exec();
    }
}