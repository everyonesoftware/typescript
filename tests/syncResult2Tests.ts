import { NotFoundError } from "../sources/notFoundError";
import { PreConditionError } from "../sources/preConditionError";
import { SyncResult2 } from "../sources/syncResult2";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("syncResult2.ts", () =>
    {
        runner.testType("SyncResult2<T>", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest<T>(testName: string, action: () => T, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => SyncResult2.create(action), expected);
                    });
                }

                createErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: action",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest("with null", null!, new PreConditionError(
                    "Expression: action",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with action", (test: Test) =>
                {
                    const result: SyncResult2<number> = SyncResult2.create(() => 5);
                    test.assertNotUndefinedAndNotNull(result);

                    const value: number = result.await();
                    test.assertEqual(5, value);
                });

                runner.test("with action with side-effects", (test: Test) =>
                {
                    let counter = 0;
                    const result: SyncResult2<number> = SyncResult2.create(() => { return ++counter; });
                    test.assertEqual(counter, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        test.assertEqual(1, result.await());
                        test.assertEqual(1, counter);
                    }
                });
            });

            runner.testFunction("value()", () =>
            {
                function valueTest<T>(value: T): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const result: SyncResult2<T> = SyncResult2.value(value);
                        test.assertNotUndefinedAndNotNull(result);

                        const awaitResult: T = result.await();
                        test.assertSame(awaitResult, value);
                    });
                }

                valueTest(undefined);
                valueTest(null);
                valueTest(50);
                valueTest({});
            });

            runner.testFunction("error()", () =>
            {
                function errorTest<T>(error: Error): void
                {
                    runner.test(`with ${runner.toString(error)}`, (test: Test) =>
                    {
                        const result: SyncResult2<T> = SyncResult2.error(error);
                        test.assertNotUndefinedAndNotNull(result);

                        test.assertThrows(result, error);
                    });
                }

                errorTest(new Error("oops"));
                errorTest(new NotFoundError("not here"));
            });

            runner.testGroup("async/await", () =>
            {
                runner.test("with value", async (test: Test) =>
                {
                    const result: SyncResult2<number> = SyncResult2.value(5);
                    test.assertEqual(await result, 5);
                });

                runner.test("with error", async (test: Test) =>
                {
                    const result: SyncResult2<number> = SyncResult2.error(new NotFoundError("abc"));
                    await test.assertThrowsAsync(result, new NotFoundError("abc"));
                });
            });

            runner.testFunction("then()", () =>
            {
                runner.testGroup("with non-PromiseLike return type", () =>
                {
                    runner.test("with error parent", (test: Test) =>
                    {
                        const parentResult: SyncResult2<number> = SyncResult2.error(new Error("abc"));
                        const thenResult: SyncResult2<string> = parentResult.then(() => "hello");
                        test.assertThrows(() => thenResult.await(), new Error("abc"));
                    });

                    runner.test("with error parent and thenFunction with side-effects", (test: Test) =>
                    {
                        const parentResult: SyncResult2<number> = SyncResult2.error(new Error("abc"));
                        let counter: number = 0;
                        const thenResult: SyncResult2<string> = parentResult.then(() => { counter++; return "hello"; });
                        test.assertSame(0, counter);
                        test.assertThrows(() => thenResult.await(), new Error("abc"));
                        test.assertSame(0, counter);
                    });

                    runner.test("with successful parent and successful thenFunction that ignores parentResult value", (test: Test) =>
                    {
                        const parentResult: SyncResult2<number> = SyncResult2.value(1);
                        const thenResult: SyncResult2<string> = parentResult.then(() => "hello");
                        test.assertSame("hello", thenResult.await());
                    });

                    runner.test("with successful parent and successful thenFunction that uses parentResult value", (test: Test) =>
                    {
                        const parentResult: SyncResult2<number> = SyncResult2.value(1);
                        const thenResult: SyncResult2<string> = parentResult.then((argument: number) => (argument + 1).toString());
                        test.assertSame("2", thenResult.await());
                    });

                    runner.test("with successful parent and successful thenFunction that uses parentResult value with side-effects", (test: Test) =>
                    {
                        const parentResult: SyncResult2<number> = SyncResult2.value(1);
                        let counter: number = 0;
                        const thenResult: SyncResult2<string> = parentResult.then((argument: number) => { counter++; return (argument + 1).toString(); });
                        test.assertSame(1, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame("2", thenResult.await());
                            test.assertSame(1, counter);
                        }
                    });

                    runner.test("with successful parent and thenFunction that throws", async (test: Test) =>
                    {
                        const parentResult: SyncResult2<number> = SyncResult2.value(10);
                        let counter: number = 0;
                        const thenResult: SyncResult2<string> = parentResult.then((argument: number) =>
                        {
                            counter++;
                            throw new Error(`arg: ${argument}`);
                        });
                        test.assertSame(counter, 1);

                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(thenResult, new Error("arg: 10"));
                            test.assertSame(counter, 1);

                            await test.assertThrowsAsync(thenResult, new Error("arg: 10"));
                            test.assertSame(counter, 1);
                        }
                    });
                });
            });
        });
    });
}