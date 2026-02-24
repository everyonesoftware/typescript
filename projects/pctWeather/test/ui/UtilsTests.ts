import { expect, suite, test } from "vitest";

import * as Utils from "../../src/ui/Utils";

import type { Direction } from "../../src/data/ForecastProvider";

suite("Utils.ts", () =>
{
    suite("URLSearchParams", () =>
    {
        test("with no arguments", () =>
        {
            const params = new URLSearchParams();
            expect(params).toBeDefined();
            expect(params.get("abc")).toStrictEqual(null);
            expect(params.get("d")).toStrictEqual(null);
        });

        test("with 'abc'", () =>
        {
            const params = new URLSearchParams("abc");
            expect(params).toBeDefined();
            expect(params.get("abc")).toStrictEqual("");
            expect(params.get("d")).toStrictEqual(null);
        });

        test("with '?abc'", () =>
        {
            const params = new URLSearchParams("?abc");
            expect(params).toBeDefined();
            expect(params.get("abc")).toStrictEqual("");
            expect(params.get("d")).toStrictEqual(null);
        });

        test("with '?abc='", () =>
        {
            const params = new URLSearchParams("?abc=");
            expect(params).toBeDefined();
            expect(params.get("abc")).toStrictEqual("");
            expect(params.get("d")).toStrictEqual(null);
        });

        test("with '?abc=12'", () =>
        {
            const params = new URLSearchParams("?abc=12");
            expect(params).toBeDefined();
            expect(params.get("abc")).toStrictEqual("12");
            expect(params.get("d")).toStrictEqual(null);
        });

        test("with '?abc=12&d=e'", () =>
        {
            const params = new URLSearchParams("?abc=12&d=e");
            expect(params).toBeDefined();
            expect(params.get("abc")).toStrictEqual("12");
            expect(params.get("d")).toStrictEqual("e");
        });
    });

    suite("parseDirection()", () =>
    {
        function parseDirectionTest(text: string, expected: Direction | undefined)
        {
            test(`with ${JSON.stringify(text)}`, () =>
            {
                expect(Utils.parseDirection(text)).toStrictEqual(expected);
            });
        }

        parseDirectionTest(undefined!, undefined);
        parseDirectionTest(null!, undefined);
        parseDirectionTest("", undefined);
        parseDirectionTest("abc", undefined);
        parseDirectionTest("hello there", undefined);

        parseDirectionTest("n", "Northbound");
        parseDirectionTest("N", "Northbound");
        parseDirectionTest("north", "Northbound");
        parseDirectionTest("nobo", "Northbound");
        parseDirectionTest("northbound", "Northbound");
        parseDirectionTest("NORTHBOUND", "Northbound");

        parseDirectionTest("s", "Southbound");
        parseDirectionTest("S", "Southbound");
        parseDirectionTest("south", "Southbound");
        parseDirectionTest("sobo", "Southbound");
        parseDirectionTest("southbound", "Southbound");
        parseDirectionTest("SOUTHBOUND", "Southbound");
    });
});