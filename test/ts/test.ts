import Ledger, { IServerLedger } from "../../lib/client/ts/clientledger";
import { API } from "../../lib/server/api";
import { LedgerBridge } from "../../lib/util/ledger_bridge";
import { ifc2x3 } from "./schema_ts/ts/ifc2x3_cartesianpoint";
import { describe, it, test } from "./crappucino"
import { CommitProposalT, ComponentT } from "../../lib/schema/bimrepo";
import { Reference, UUID4 } from "../../lib/client/ts/ecs";

function GetLocalServerLedger()
{
    let server = new API();
    let bridge = new LedgerBridge(server);
    return new Ledger(bridge);
}

function GetSharedServerLedger()
{
    let server = new API();
    let bridgeA = new LedgerBridge(server);
    let bridgeB = new LedgerBridge(server);
    let ledgerA = new Ledger(bridgeA);
    let ledgerB = new Ledger(bridgeB);
    return {
        ledgerA,
        ledgerB
    }
}

let uuid = new UUID4();

function MakeBasicCartesianPoint()
{
    let point = new ifc2x3.cartesianpoint(uuid);
    point.points = [1,2,33];
    point.cardinality = 3;
    point.external = true;
    point.owner = "bob";
    point.parent = Reference.From(point);
    return point;
}

function AssertBasicCartesianPoint(cartpoint: ifc2x3.cartesianpoint)
{
    expect(cartpoint.getEntityID().equals(uuid));

    expect_eq(cartpoint.cardinality, 3);

    expect_eq(cartpoint.points.length, 3);
    expect_eq(cartpoint.points[0], 1);
    expect_eq(cartpoint.points[1], 2);
    expect_eq(cartpoint.points[2], 33);

    expect_eq(cartpoint.external, true);
    expect_eq(cartpoint.owner, "bob");

    expect(cartpoint.parent?.entity.equals(uuid));
    expect_eq(cartpoint.parent?.componentID, 0);
    expect_eq(cartpoint.parent?.typeHash, cartpoint.getTypeHash());
}

function expect_eq(result: any, expectation: any)
{
    if (result !== expectation)
    {
        throw new Error(`Expected ${expectation} but received ${result}`);
    }
}

function expect(result: any)
{
    if (!result)
    {
        throw new Error(`Expectation failed`);
    }
}

class TypedComponentAssert<T>
{
    obj: T;
    commitAssert: CommitAssert;

    constructor(obj: T, commit: CommitAssert)
    {
        this.obj = obj;
        this.commitAssert = commit;
    }

    Satisfies(fn: (obj: T)=>void)
    {
        fn(this.obj);
        return this.commitAssert;
    }
}

class ComponentAssert
{
    component: ComponentT;
    commitAssert: CommitAssert;

    constructor(component: ComponentT, commit: CommitAssert)
    {
        this.component = component;
        this.commitAssert = commit;
    }

    AsType<T>(obj: any)
    {
        return new TypedComponentAssert<T>(obj.importFromDataArray(this.component) as T, this.commitAssert);
    }
}

class CommitAssert
{
    commit: CommitProposalT;

    constructor(commit: CommitProposalT)
    {
        this.commit = commit;
    }

    ExpectComponents(num: number)
    {
        expect_eq(this.commit.diff?.updatedComponents.length, num);
        return this;
    }

    Component(num: number)
    {
        return new ComponentAssert(this.commit.diff?.updatedComponents[num]!, this);
    }
}

function AssertCommit(commit: CommitProposalT)
{
    return new CommitAssert(commit);
}

describe('In the ledger operations', function () {
    describe('Committing to a ledger', function () {
        it('should allow retrieval of component', async function () {
            // arrange
            let ledger = GetLocalServerLedger();

            ledger.update(MakeBasicCartesianPoint());

            // act
            let num = await ledger.commit("bob@bob.com", "I done did a commit2");
            let commit = await ledger.GetCommit(num);

            // assert
            AssertCommit(commit)
                .ExpectComponents(1)
                .Component(0)
                    .AsType<ifc2x3.cartesianpoint>(ifc2x3.cartesianpoint)
                        .Satisfies(AssertBasicCartesianPoint);
        });
        it('should be visible from one client to another', async function () {
            // arrange
            let { ledgerA, ledgerB } = GetSharedServerLedger();
            
            ledgerA.SetNotifyHeadChanged((head: number) => {
                console.log(`Received ${head} on A`);
            })
            ledgerB.SetNotifyHeadChanged((head: number) => {
                console.log(`Received ${head} on B`);
            })

            ledgerA.update(MakeBasicCartesianPoint());

            // act
            let num = await ledgerA.commit("bob@bob.com", "I done did a commit2");
            let commit = await ledgerB.GetCommit(num);

            // assert
            AssertCommit(commit)
                .ExpectComponents(1)
                .Component(0)
                    .AsType<ifc2x3.cartesianpoint>(ifc2x3.cartesianpoint)
                        .Satisfies(AssertBasicCartesianPoint);
        });
    });
});

test();