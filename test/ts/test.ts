import Ledger, { IServerLedger } from "../../lib/client/ts/clientledger";
import { API } from "../../lib/server/api";
import { LedgerBridge } from "../../lib/util/ledger_bridge";
import { ifc2x3 } from "./schema_ts/ts/ifc2x3_cartesianpoint";
import { describe, it } from "./crappucino"

function GetRemoteServerLedger()
{
    return new IServerLedger("http://localhost:3000");
}

function GetLocalServerLedger()
{
    let server = new API();
    return new LedgerBridge(server);
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

describe('Integration Tests', function () {
    describe('Commit', function () {
        it('Committing component should allow retrieval of component', async function () {
            // arrange
            let serverLedger = GetLocalServerLedger();

            let ledger = new Ledger(serverLedger);

            ledger.update(MakeBasicCartesianPoint());

            // act
            let num = await ledger.commit("bob@bob.com", "I done did a commit2");
            let commit = await ledger.GetCommit(num);

            // assert
            let components = commit.diff?.updatedComponents;

            expect_eq(components?.length, 2);

            components?.forEach((component) => {
                let cartpoint = ifc2x3.cartesianpoint.importFromDataArray(component);
                AssertBasicCartesianPoint(cartpoint);
            });
        });
    });
});
