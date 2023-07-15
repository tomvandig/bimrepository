import Ledger, { IServerLedger } from "../../lib/client/ts/clientledger";
import { API } from "../../lib/server/api";
import { LedgerBridge } from "../../lib/util/ledger_bridge";
import { ifc2x3 } from "./schema_ts/ts/ifc2x3_cartesianpoint";
import { describe, it } from "./crappucino"
import { CommitProposalT, ComponentT } from "../../lib/schema/bimrepo";

function GetLocalServerLedger()
{
    let server = new API();
    let bridge = new LedgerBridge(server);
    return new Ledger(bridge);
}

function GetSharedServerLedger()
{
    let server = new API();
    let bridge = new LedgerBridge(server);
    let ledgerA = new Ledger(bridge);
    let ledgerB = new Ledger(bridge);
    return {
        ledgerA,
        ledgerB
    }
}

function MakeBasicCartesianPoint()
{
    let point = new ifc2x3.cartesianpoint();
    point.points = [1,2,33];
    point.cardinality = 3;
    return point;
}

function AssertBasicCartesianPoint(cartpoint: ifc2x3.cartesianpoint)
{
    expect_eq(cartpoint.cardinality, 3);
    expect_eq(cartpoint.points.length, 3);
    expect_eq(cartpoint.points[0], 1);
    expect_eq(cartpoint.points[1], 2);
    expect_eq(cartpoint.points[2], 33);
}

function expect_eq(result: any, expectation: any)
{
    if (result !== expectation)
    {
        throw new Error(`Expected ${expectation} but received ${result}`);
    }
}

class TypedComponentAssert<T>
{
    obj: T;

    constructor(obj: T)
    {
        this.obj = obj;
    }

    Satisfies(fn: (obj: T)=>void)
    {
        fn(this.obj);
    }
}

class ComponentAssert
{
    component: ComponentT;

    constructor(component: ComponentT)
    {
        this.component = component;
    }

    AsType<T>(obj: any)
    {
        return new TypedComponentAssert<T>(obj.importFromDataArray(this.component) as T);
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
        return new ComponentAssert(this.commit.diff?.updatedComponents[num]!);
    }
}

function AssertCommit(commit: CommitProposalT)
{
    return new CommitAssert(commit);
}

describe('Integration Tests', function () {
    describe('Commit', function () {
        it('Committing component should allow retrieval of component', async function () {
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
    });
});


describe('Integration Tests', function () {
    describe('Commit', function () {
        it('Commit from one client is visible in another', async function () {
            // arrange
            let { ledgerA, ledgerB } = GetSharedServerLedger();

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