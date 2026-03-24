import { Iterable } from "../sources/iterable";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("iterable.ts", () =>
    {
        runner.testType("Iterable<T>", () =>
        {
            runner.testFunction("create(JavascriptIterable<T>|undefined)", () =>
            {
                runner.test("with no arguments", async (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create();
                    test.assertNotUndefinedAndNotNull(iterable);
                    test.assertEqual(await iterable.toArray(), []);
                    test.assertEqual(await iterable.getCount(), 0);
                });

                runner.test("with empty array", async (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create<number>([]);
                    test.assertNotUndefinedAndNotNull(iterable);
                    test.assertEqual(await iterable.toArray(), []);
                    test.assertEqual(await iterable.getCount(), 0);
                });

                runner.test("with non-empty array", async (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create([1, 2, 3]);
                    test.assertNotUndefinedAndNotNull(iterable);
                    test.assertEqual(await iterable.toArray(), [1, 2, 3]);
                    test.assertEqual(await iterable.getCount(), 3);
                });
            });
        });
    });
}