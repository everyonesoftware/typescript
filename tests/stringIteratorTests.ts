import { PreConditionError } from "../sources/preConditionError";
import { StringIterator } from "../sources/stringIterator";
import { iteratorTests } from "./iteratorTests";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("stringIterator.ts", () =>
    {
        runner.testType("StringIterator", () =>
        {
            iteratorTests(runner, () => StringIterator.create(""));

            runner.testFunction("create(string)", () =>
            {
                function createErrorTest(value: string | undefined | null, expectedError: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => StringIterator.create(value!),
                            expectedError);
                    });
                }

                createErrorTest(
                    undefined,
                    new PreConditionError(
                        "Expression: value",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                createErrorTest(
                    null,
                    new PreConditionError(
                        "Expression: value",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));

                function createTest(value: string): void
                {
                    runner.test(`with "${runner.toString(value)}"`, (test: Test) =>
                    {
                        const iterator: StringIterator = StringIterator.create(value);
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                        test.assertThrows(() => iterator.getCurrentIndex(),
                            new PreConditionError(
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ));
                        test.assertThrows(() => iterator.getCurrent(),
                            new PreConditionError(
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ));
                    });
                }

                createTest("");
                createTest("abc");
            });

            runner.testFunction("next()", () =>
            {
                function nextTest(value: string): void
                {
                    runner.test(`with "${runner.toString(value)}"`, (test: Test) =>
                    {
                        const iterator: StringIterator = StringIterator.create(value);

                        for (let i = 0; i < value.length; i++)
                        {
                            test.assertTrue(iterator.next());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertSame(iterator.getCurrentIndex(), i);
                            test.assertSame(iterator.getCurrent(), value[i]);
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(iterator.next());
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                            test.assertThrows(() => iterator.getCurrentIndex(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false",
                                ));
                            test.assertThrows(() => iterator.getCurrent(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false",
                                ));
                        }
                    });
                }

                nextTest("");
                nextTest("a");
                nextTest("abc");
            });

            runner.testGroup("for...of", () =>
            {
                function forOfTest(value: string): void
                {
                    runner.test(`with "${runner.toString(value)}"`, (test: Test) =>
                    {
                        const iterator: StringIterator = StringIterator.create(value);

                        let expectedIndex: number = 0;
                        for (const c of iterator)
                        {
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertSame(iterator.getCurrentIndex(), expectedIndex);
                            test.assertSame(iterator.getCurrent(), value[expectedIndex]);
                            test.assertSame(c, value[expectedIndex]);
                            expectedIndex++;
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(iterator.next());
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                            test.assertThrows(() => iterator.getCurrentIndex(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false",
                                ));
                            test.assertThrows(() => iterator.getCurrent(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false",
                                ));
                        }
                    });
                }

                forOfTest("");
                forOfTest("a");
                forOfTest("abc");
            });
        });
    });
}