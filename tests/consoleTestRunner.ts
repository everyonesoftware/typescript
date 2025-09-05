

import { Iterable } from "../sources/iterable";
import { PreCondition } from "../sources/preCondition";
import { join } from "../sources/strings";
import { ToStringFunctions } from "../sources/toStringFunctions";
import { isFunction, Type } from "../sources/types";
import { AssertTest } from "./assertTest";
import { Test } from "./test";
import { TestRunner } from "./testRunner";
import { TestSkip } from "./testSkip";

/**
 * A {@link TestRunner} implementation that runs tests directly.
 */
export class ConsoleTestRunner implements TestRunner
{
    private testGroups: string[];
    private currentTest: Test | undefined;
    private toStringFunctions: ToStringFunctions;

    protected constructor(toStringFunctions?: ToStringFunctions)
    {
        this.testGroups = [];

        if (!toStringFunctions)
        {
            toStringFunctions = ToStringFunctions.create();
        }
        this.toStringFunctions = toStringFunctions;
    }

    public static create(toStringFunctions?: ToStringFunctions): ConsoleTestRunner
    {
        return new ConsoleTestRunner(toStringFunctions);
    }

    private getCurrentTest(): Test | undefined
    {
        return this.currentTest;
    }

    private setCurrentTest(currentTest: Test | undefined): void
    {
        this.currentTest = currentTest;
    }

    private assertNoCurrentTest(): void
    {
        const currentTest: Test | undefined = this.getCurrentTest();
        if (currentTest !== undefined)
        {
            currentTest.fail("Can't start a new test group or a new test while running a test.");
        }
    }

    private getFullTestName(testName: string): string
    {
        return join(" ", [...this.testGroups, testName]);
    }

    public skip(shouldSkip?: boolean, message?: string): TestSkip
    {
        return TestRunner.skip(this, shouldSkip, message);
    }

    public testFile(fileName: string, testAction: (() => void) | ((test: Test) => void)): void;
    public testFile(fileName: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    public testFile(fileName: string, skipOrTestAction: TestSkip | (() => void) | ((test: Test) => void) | undefined, testAction?: ((() => void) | ((test: Test) => void)) | undefined): void
    {
        TestRunner.testFile(this, fileName, skipOrTestAction, testAction);
    }

    public testType(typeNameOrType: string | Type<unknown>, testAction: (() => void) | ((test: Test) => void)): void;
    public testType(typeNameOrType: string | Type<unknown>, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    public testType(typeNameOrType: string | Type<unknown>, skipOrTestAction: TestSkip | (() => void) | ((test: Test) => void) | undefined, testAction?: ((() => void) | ((test: Test) => void)) | undefined): void
    {
        TestRunner.testType(this, typeNameOrType, skipOrTestAction, testAction);
    }

    public testFunction(functionSignature: string, testAction: (() => void) | ((test: Test) => void)): void;
    public testFunction(functionSignature: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    public testFunction(functionSignature: string, skipOrTestAction: TestSkip | (() => void) | ((test: Test) => void) | undefined, testAction?: ((() => void) | ((test: Test) => void)) | undefined): void
    {
        TestRunner.testFunction(this, functionSignature, skipOrTestAction, testAction);
    }

    public testGroup(testGroupName: string, testAction: () => void): void;
    public testGroup(testGroupName: string, skip: TestSkip | undefined, testAction: () => void): void;
    testGroup(testGroupName: string, skipOrTestAction: TestSkip | undefined | (() => void), testAction?: () => void): void
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

        this.testGroups.push(testGroupName);
        try
        {
            if (TestRunner.shouldSkip(skip))
            {
                console.log(`TEST GROUP SKIP: ${testGroupName}`);
            }
            else
            {
                testAction();
            }
        }
        catch (error)
        {
            console.log(`TEST ERROR: ${error}`);
        }
        finally
        {
            this.testGroups.pop();
        }
    }

    public test(testName: string, testAction: (test: Test) => void): void;
    public test(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => void): void;
    test(testName: string, skipOrTestAction: TestSkip | undefined | ((test: Test) => void), testAction?: (test: Test) => void): void
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

        try
        {
            if (TestRunner.shouldSkip(skip))
            {
                console.log(`TEST SKIPPED: ${testName}`)
            }
            else
            {
                const currentTest: Test = AssertTest.create();
                this.setCurrentTest(currentTest);
                try
                {
                    console.log(this.getFullTestName(testName));
                    testAction(currentTest);
                }
                finally
                {
                    this.setCurrentTest(undefined);
                }
            }
        }
        catch(error)
        {
            console.log(`TEST ERROR: ${error}`)
        }
    }

    public async testAsync(testName: string, testAction: (test: Test) => Promise<unknown>): Promise<void>;
    public async testAsync(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => Promise<unknown>): Promise<void>;
    async testAsync(testName: string, skipOrTestAction: TestSkip | undefined | ((test: Test) => Promise<unknown>), testAction?: (test: Test) => Promise<unknown>): Promise<void>
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

        try
        {
            if (TestRunner.shouldSkip(skip))
            {
                console.log(`TEST SKIPPED (ASYNC): ${testName}`);
            }
            else
            {
                console.log(this.getFullTestName(testName));
                await testAction(AssertTest.create());
            }
        }
        catch (error)
        {
            console.log(`TEST ERROR (ASYNC): ${error}`)
        }
    }

    public andList(values: unknown[] | Iterable<unknown>): string
    {
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        return TestRunner.andList(this, values);
    }

    public toString(value: unknown): string
    {
        return this.toStringFunctions.toString(value);
    }
}