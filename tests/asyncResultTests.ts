import { AsyncResult } from "../sources/asyncResult";
import { NotFoundError } from "../sources/notFoundError";
import { PreConditionError } from "../sources/preConditionError";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("asyncResult.ts", () =>
    {
        runner.testType("AsyncResult<T>", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest<T>(testName: string, promise: Promise<T>, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => AsyncResult.create(promise), expected);
                    });
                }

                createErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: promise",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest("with null", null!, new PreConditionError(
                    "Expression: promise",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with Promise", async (test: Test) =>
                {
                    const result: AsyncResult<number> = AsyncResult.create(Promise.resolve(5));
                    test.assertNotUndefinedAndNotNull(result);

                    const value: number = await result;
                    test.assertEqual(5, value);
                });
            });

            runner.testFunction("value()", () =>
            {
                function valueTest<T>(value: T): void
                {
                    runner.test(`with ${runner.toString(value)}`, async (test: Test) =>
                    {
                        const result: AsyncResult<T> = AsyncResult.value(value);
                        test.assertNotUndefinedAndNotNull(result);

                        const awaitResult: T = await result;
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
                    runner.test(`with ${runner.toString(error)}`, async (test: Test) =>
                    {
                        const result: AsyncResult<T> = AsyncResult.error(error);
                        test.assertNotUndefinedAndNotNull(result);

                        await test.assertThrowsAsync(result, error);
                    });
                }

                errorTest(new Error("oops"));
                errorTest(new NotFoundError("not here"));
            });

            runner.testFunction("then()", () =>
            {
                runner.test("with error parent", async (test: Test) =>
                {
                    const parentResult: AsyncResult<number> = AsyncResult.error(new Error("abc"));
                    const thenResult: AsyncResult<string> = parentResult.then(() => "hello");
                    await test.assertThrowsAsync(thenResult, new Error("abc"));
                });

                runner.test("with error parent and thenFunction with side-effects", async (test: Test) =>
                {
                    const parentResult: AsyncResult<number> = AsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const thenResult: AsyncResult<string> = parentResult.then(() => { counter++; return "hello"; });
                    test.assertEqual(0, counter);
                    await test.assertThrowsAsync(thenResult, new Error("abc"));
                    test.assertEqual(0, counter, "counter should still be 0 because the thenFunction shouldn't be invoked.");
                });

                runner.test("with successful parent and successful thenFunction that ignores parentResult value", async (test: Test) =>
                {
                    const parentResult: AsyncResult<number> = AsyncResult.value(1);
                    const thenResult: AsyncResult<string> = parentResult.then(() => "hello");
                    test.assertEqual("hello", await thenResult);
                });

                runner.test("with successful parent and successful thenFunction that uses parentResult value", async (test: Test) =>
                {
                    const parentResult: AsyncResult<number> = AsyncResult.value(1);
                    const thenResult: AsyncResult<string> = parentResult.then((argument: number) => (argument + 1).toString());
                    test.assertEqual("2", await thenResult);
                });

                runner.test("with successful parent and successful thenFunction that uses parentResult value with side-effects", async (test: Test) =>
                {
                    const parentResult: AsyncResult<number> = AsyncResult.value(1);
                    let counter: number = 0;
                    const thenResult: AsyncResult<string> = parentResult.then((argument: number) => { counter++; return (argument + 1).toString(); });
                    test.assertEqual(0, counter);

                    await AsyncResult.yield();
                    test.assertEqual(1, counter);

                    test.assertEqual("2", await thenResult);
                    test.assertEqual(1, counter);
                });

                runner.test("with successful parent and thenFunction that throws", async (test: Test) =>
                {
                    const parentResult: AsyncResult<number> = AsyncResult.value(10);
                    let counter: number = 0;
                    const thenResult: AsyncResult<string> = parentResult.then((argument: number) =>
                    {
                        counter++;
                        throw new Error(`arg: ${argument}, ${counter}`);
                    });
                    test.assertEqual(counter, 0);

                    await AsyncResult.yield();
                    test.assertEqual(counter, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(thenResult, new Error("arg: 10, 1"));
                        test.assertEqual(counter, 1);
                    }
                });
            });
        });
    });
}