import { HttpClient } from "../sources/httpClient";
import { PreConditionError } from "../sources/preConditionError";
import { RecreationDotGovClient, RecreationDotGovError, RecreationDotGovPermitItineraryJson } from "../sources/recreationDotGovClient";
import { WonderlandTrailDirection, WonderlandTrailLocation, WonderlandTrailLocations } from "../sources/wonderlandTrailClient";
import { Test } from "./test";
import { TestRunner } from "./testRunner";
import { Iterable } from "../sources/iterable";

export function test(runner: TestRunner): void
{
    runner.testFile("wonderlandTrailClient.ts", () =>
    {
        runner.testType("WonderlandTrailDirection", () =>
        {
            runner.testFunction("toString()", (test: Test) =>
            {
                test.assertEqual("Clockwise", WonderlandTrailDirection.clockwise.toString());
                test.assertEqual("CounterClockwise", WonderlandTrailDirection.counterClockwise.toString());
            });

            runner.testFunction("reverse()", (test: Test) =>
            {
                test.assertSame(WonderlandTrailDirection.counterClockwise, WonderlandTrailDirection.clockwise.reverse());
                test.assertSame(WonderlandTrailDirection.clockwise, WonderlandTrailDirection.counterClockwise.reverse());
            });
        });

        runner.testType("WonderlandTrailLocations", () =>
        {
            runner.testFunction("getLocations()", (test: Test) =>
            {
                const locations: Iterable<WonderlandTrailLocation> = WonderlandTrailLocations.getLocations();
                test.assertNotUndefinedAndNotNull(locations);
                test.assertEqual(locations.getCount().await(), 27);
            });

            runner.testFunction("getTrailheads()", (test: Test) =>
            {
                const trailheads: Iterable<WonderlandTrailLocation> = WonderlandTrailLocations.getTrailheads();
                test.assertEqual(6, trailheads.getCount().await());
                test.assertEqual(
                    [
                        WonderlandTrailLocations.sunriseVisitorCenter.name,
                        WonderlandTrailLocations.whiteRiver.name,
                        WonderlandTrailLocations.fryingPanCreek.name,
                        WonderlandTrailLocations.boxCanyon.name,
                        WonderlandTrailLocations.reflectionLakes.name,
                        WonderlandTrailLocations.longmire.name,
                    ],
                    trailheads.map(t => t.name).toArray().await(),
                );
            });
        });
    });
}