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

            runner.testGroup("concatenate()", () =>
            {
                runner.testGroup("empty and", () =>
                {
                    runner.test("empty", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([]);
                        test.assertEqual(concatenateIterable.toArray().await(), []);
                    });

                    runner.test("non-empty", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([5]);
                        test.assertEqual(concatenateIterable.toArray().await(), [5]);
                    });

                    runner.test("two non-emptys", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([5], [6, 7]);
                        test.assertEqual(concatenateIterable.toArray().await(), [5, 6, 7]);
                    });
                });

                runner.testGroup("non-empty and", () =>
                {
                    runner.test("empty", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([1, 2]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([]);
                        test.assertEqual(concatenateIterable.toArray().await(), [1, 2]);
                    });

                    runner.test("non-empty", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([3]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([4, 5, 6]);
                        test.assertEqual(concatenateIterable.toArray().await(), [3, 4, 5, 6]);
                    });

                    runner.test("two non-emptys", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([7, 8, 9]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([10, 11, 12], [13]);
                        test.assertEqual(concatenateIterable.toArray().await(), [7, 8, 9, 10, 11, 12, 13]);
                    });
                });
            });
        });
    });
}