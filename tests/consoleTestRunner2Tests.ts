import { WhereIterable } from "../sources/whereIterable";
import { ConsoleTestRunner2 } from "./consoleTestRunner2";
import { Test } from "./test";
import { TestAction } from "./testAction";
import { TestRunner } from "./testRunner";
import * as testRunnerTests from "./testRunnerTests";

export function test(runner: TestRunner): void
{
    runner.testFile("consoleTestRunner2.ts", () =>
    {
        runner.testType("ConsoleTestRunner2", () =>
        {
            testRunnerTests.test2(runner, ConsoleTestRunner2.create);

            runner.testFunction("create()", (test: Test) =>
            {
                const runner2: ConsoleTestRunner2 = ConsoleTestRunner2.create();
                test.assertNotUndefinedAndNotNull(runner2);
                test.assertEqual(0, runner2.getPendingTestActionsCount());
                test.assertEqual(0, runner2.getPendingTestActionsInsertIndex());
                test.assertUndefined(runner2.getCurrentTestAction());
            });

            runner.testFunction("testFile()", () =>
            {
                runner.test("with no Test argument in testAction", (test: Test) =>
                {
                    let counter: number = 0;
                    const runner2: ConsoleTestRunner2 = ConsoleTestRunner2.create();
                    runner2.testFile("fakeFile.ts", () =>
                    {
                        counter++;
                        const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(currentTestAction);
                        test.assertUndefined(currentTestAction.getParent());
                        test.assertEqual("fakeFile.ts", currentTestAction.getName());
                    });
                    test.assertEqual(0, counter);
                    test.assertEqual(1, runner2.getPendingTestActionsCount());
                    test.assertEqual(0, runner2.getPendingTestActionsInsertIndex());
                    test.assertUndefined(runner2.getCurrentTestAction());

                    for (let i = 0; i < 3; i++)
                    {
                        runner2.run();

                        test.assertEqual(1, counter);
                        test.assertEqual(0, runner2.getPendingTestActionsCount());
                        test.assertEqual(0, runner2.getPendingTestActionsInsertIndex());
                        test.assertUndefined(runner2.getCurrentTestAction());
                    }
                });

                runner.test("with skip and no Test argument in testAction", (test: Test) =>
                {
                    let counter: number = 0;
                    const runner2: ConsoleTestRunner2 = ConsoleTestRunner2.create();
                    runner2.testFile("fakeFile.ts", runner2.skip(), () =>
                    {
                        counter++;
                        test.fail("This test action shouldn't be run since it is skipped.")
                    });
                    test.assertEqual(0, counter);
                    test.assertEqual(1, runner2.getPendingTestActionsCount());
                    test.assertEqual(0, runner2.getPendingTestActionsInsertIndex());
                    test.assertUndefined(runner2.getCurrentTestAction());

                    for (let i = 0; i < 3; i++)
                    {
                        runner2.run();

                        test.assertEqual(0, counter);
                        test.assertEqual(0, runner2.getPendingTestActionsCount());
                        test.assertEqual(0, runner2.getPendingTestActionsInsertIndex());
                        test.assertUndefined(runner2.getCurrentTestAction());
                    }
                });

                runner.test("with Test argument in testAction", (test: Test) =>
                {
                    let counter: number = 0;
                    const runner2: ConsoleTestRunner2 = ConsoleTestRunner2.create();
                    runner2.testFile("fakeFile.ts", (test2: Test) =>
                    {
                        counter++;

                        const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(currentTestAction);
                        test.assertUndefined(currentTestAction.getParent());
                        test.assertEqual("fakeFile.ts", currentTestAction.getName());

                        test.assertNotUndefinedAndNotNull(test2);
                        test.assertNotSame(test, test2);
                        test.assertSame(test2, runner2.getCurrentTest());
                    });
                    test.assertEqual(0, counter);
                    test.assertEqual(1, runner2.getPendingTestActionsCount());
                    test.assertEqual(0, runner2.getPendingTestActionsInsertIndex());
                    test.assertUndefined(runner2.getCurrentTestAction());

                    for (let i = 0; i < 3; i++)
                    {
                        runner2.run();

                        test.assertEqual(1, counter);
                        test.assertEqual(0, runner2.getPendingTestActionsCount());
                        test.assertEqual(0, runner2.getPendingTestActionsInsertIndex());
                        test.assertUndefined(runner2.getCurrentTestAction());
                    }
                });
            });

            runner.testFunction("testType()", () =>
            {
                runner.test("with Type instead of type name", (test: Test) =>
                {
                    const runner2: ConsoleTestRunner2 = ConsoleTestRunner2.create();
                    runner2.testType(WhereIterable, () =>
                    {
                        const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(currentTestAction);
                        test.assertEqual("_WhereIterable", currentTestAction.getName());
                    });
                    test.assertEqual(1, runner2.getPendingTestActionsCount());

                    runner2.run();
                    test.assertEqual(0, runner2.getPendingTestActionsCount());
                });
            });

            runner.testFunction("testFunction()", (test: Test) =>
            {
                const runner2: ConsoleTestRunner2 = ConsoleTestRunner2.create();
                runner2.testFunction("fakeFunction()", () =>
                {
                    const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                    test.assertNotUndefinedAndNotNull(currentTestAction);
                    test.assertEqual("fakeFunction()", currentTestAction.getName());
                });
                test.assertEqual(1, runner2.getPendingTestActionsCount());

                runner2.run();
                test.assertEqual(0, runner2.getPendingTestActionsCount());
            });

            runner.testFunction("testGroup()", (test: Test) =>
            {
                const runner2: ConsoleTestRunner2 = ConsoleTestRunner2.create();
                runner2.testGroup("fake group", () =>
                {
                    const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                    test.assertNotUndefinedAndNotNull(currentTestAction);
                    test.assertEqual("fake group", currentTestAction.getName());
                });
                test.assertEqual(1, runner2.getPendingTestActionsCount());

                runner2.run();
                test.assertEqual(0, runner2.getPendingTestActionsCount());
            });

            runner.testFunction("test()", () =>
            {
                runner.test("with no parent", (test: Test) =>
                {
                    const runner2: ConsoleTestRunner2 = ConsoleTestRunner2.create();
                    runner2.test("fake test", (test2: Test) =>
                    {
                        const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(currentTestAction);
                        test.assertEqual("fake test", currentTestAction.getName());

                        test.assertSame(test2, runner2.getCurrentTest());
                    });
                    test.assertEqual(1, runner2.getPendingTestActionsCount());

                    runner2.run();
                    test.assertEqual(0, runner2.getPendingTestActionsCount());
                });

                runner.test("with parent", (test: Test) =>
                {
                    let counter: number = 0;
                    const runner2: ConsoleTestRunner2 = ConsoleTestRunner2.create();
                    runner2.testGroup("fake-test-group", () =>
                    {
                        counter++;
                        test.assertEqual(1, counter);

                        const testGroupAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(testGroupAction);
                        test.assertEqual("fake-test-group", testGroupAction.getName());

                        runner2.test("fake-test", (test2: Test) =>
                        {
                            counter++;
                            test.assertEqual(2, counter);

                            const testAction: TestAction | undefined = runner2.getCurrentTestAction();
                            test.assertNotUndefinedAndNotNull(testAction);
                            test.assertEqual("fake-test-group fake-test", testAction.getFullName());
                            test.assertEqual("fake-test", testAction.getName());
                            test.assertSame(testGroupAction, testAction.getParent());

                            test.assertSame(test2, runner2.getCurrentTest());
                        });

                        test.assertEqual(1, counter);
                    });
                    test.assertEqual(0, counter);
                    test.assertEqual(1, runner2.getPendingTestActionsCount());

                    runner2.run();
                    test.assertEqual(2, counter);
                    test.assertEqual(0, runner2.getPendingTestActionsCount());
                });
            });
        });
    });
}