import { List } from "../sources/list";
import { PreCondition } from "../sources/preCondition";
import { isFunction } from "../sources/types";
import { AssertTest } from "./assertTest";
import { Test } from "./test";
import { TestAction } from "./testAction";
import { TestFailure } from "./testFailure";
import { TestRunner } from "./testRunner";
import { TestSkip } from "./testSkip";

export class ConsoleTestRunner2 extends TestRunner
{
    private readonly pendingActions: List<TestAction>;
    private pendingActionsInsertIndex: number;
    private currentTestAction: TestAction | undefined;
    private currentTest: Test | undefined;

    private passingTestCount: number;
    private skippedTestCount: number;
    private readonly testFailures: List<TestFailure>;

    public constructor()
    {
        super();

        this.pendingActions = List.create();
        this.pendingActionsInsertIndex = 0;

        this.passingTestCount = 0;
        this.skippedTestCount = 0;
        this.testFailures = List.create();
    }

    public static create(): ConsoleTestRunner2
    {
        return new ConsoleTestRunner2();
    }

    /**
     * Get the number of {@link TestAction}s that have yet to be executed.
     */
    public getPendingTestActionsCount(): number
    {
        return this.pendingActions.getCount();
    }

    /**
     * Get the index in the pending-{@link TestAction} stack that new {@link TestAction}s will be
     * inserted at.
     */
    public getPendingTestActionsInsertIndex(): number
    {
        return this.pendingActionsInsertIndex;
    }

    /**
     * Get the {@link TestAction} that is currently executing or undefined if no {@link TestAction}
     * is executing.
     */
    public getCurrentTestAction(): TestAction | undefined
    {
        return this.currentTestAction;
    }

    public getCurrentTest(): Test | undefined
    {
        return this.currentTest;
    }

    private assertNoCurrentTest(): void
    {
        if (this.currentTest !== undefined)
        {
            this.currentTest.fail("Can't start a new test group or a new test while running a test.");
        }
    }

    public testGroup(testGroupName: string, testAction: () => (void | Promise<void>)): void;
    public testGroup(testGroupName: string, skip: TestSkip | undefined, testAction: () => (void | Promise<void>)): void;
    testGroup(testGroupName: string, skipOrTestAction: TestSkip | undefined | (() => (void | Promise<void>)), testAction?: () => (void | Promise<void>)): void
    {
        PreCondition.assertNotUndefinedAndNotNull(testGroupName, "testGroupName");
        PreCondition.assertNotEmpty(testGroupName, "testGroupName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            PreCondition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.assertNoCurrentTest();

        this.pendingActions.insert(
            this.pendingActionsInsertIndex, 
            TestAction.create(
                this.getCurrentTestAction(),
                testGroupName,
                async () =>
                {
                    const previousTestActionInsertIndex: number = this.pendingActionsInsertIndex;
                    this.pendingActionsInsertIndex = this.pendingActions.getCount();
                    const fullTestGroupName: string = this.getCurrentTestAction()!.getFullName();
                    let caughtError: unknown = undefined;
                    try
                    {
                        if (TestRunner.shouldSkip(skip))
                        {
                            console.log(`TEST GROUP SKIP: ${fullTestGroupName}`);
                            this.skippedTestCount++;
                        }
                        else
                        {
                            await testAction();
                        }
                    }
                    catch (error)
                    {
                        caughtError = error;
                    }
                    finally
                    {
                        this.pendingActionsInsertIndex = previousTestActionInsertIndex;
                    }

                    if (caughtError !== undefined)
                    {
                        console.log(`TEST ERROR: ${caughtError}`);
                        const testFailure = TestFailure.create(this.getCurrentTestAction()!.getFullName(), caughtError);
                        this.testFailures.add(testFailure);
                    }
                },
            ),
        );
    }

    public test(testName: string, testAction: (test: Test) => (void | Promise<void>)): void;
    public test(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => (void | Promise<void>)): void;
    test(testName: string, skipOrTestAction: TestSkip | undefined | ((test: Test) => (void | Promise<void>)), testAction?: (test: Test) => (void | Promise<void>)): void
    {
        PreCondition.assertNotUndefinedAndNotNull(testName, "testName");
        PreCondition.assertNotEmpty(testName, "testName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            PreCondition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.assertNoCurrentTest();

        this.pendingActions.insert(
            this.pendingActionsInsertIndex,
            TestAction.create(
                this.getCurrentTestAction(),
                testName,
                async () =>
                {
                    const fullTestName: string = this.getCurrentTestAction()!.getFullName();
                    try
                    {
                        if (TestRunner.shouldSkip(skip))
                        {
                            console.log(`TEST SKIPPED: ${fullTestName}`)
                            this.skippedTestCount++;
                        }
                        else
                        {
                            this.currentTest = AssertTest.create();
                            try
                            {
                                console.log(fullTestName);
                                await testAction(this.currentTest);
                                this.passingTestCount++;
                            }
                            finally
                            {
                                this.currentTest = undefined;
                            }
                        }
                    }
                    catch(error)
                    {
                        console.log(`TEST ERROR: ${error}`)
                        this.testFailures.add(TestFailure.create(fullTestName, error));
                    }
                },
            ),
        );
    }

    public run(): void
    {
        while (this.pendingActions.any())
        {
            this.currentTestAction = this.pendingActions.removeLast();
            try
            {
                this.currentTestAction.run();
            }
            finally
            {
                this.currentTestAction = undefined;
            }
        }
    }
}