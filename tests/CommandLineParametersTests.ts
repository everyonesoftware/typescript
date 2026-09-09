import { CommandLineParameters, Iterable, JavascriptIterable, NotFoundError, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("commandLineParameters.ts", () =>
    {
        runner.testType("CommandLineParameters", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(argv: JavascriptIterable<string>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(argv)}`, (test: Test) =>
                    {
                        test.assertThrows(() => CommandLineParameters.create(argv), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError({
                    expression: "argv",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                createErrorTest(null!, new PreConditionError({
                    expression: "argv",
                    expected: "not undefined and not null",
                    actual: "null",
                }));

                function createTest(argv: JavascriptIterable<string>): void
                {
                    runner.test(`with ${runner.toString(argv)}`, (test: Test) =>
                    {
                        const parameters: CommandLineParameters = CommandLineParameters.create(argv);
                        test.assertNotUndefinedAndNotNull(parameters);
                        test.assertEqual(parameters.getArguments(), Iterable.create(argv));
                    });
                }

                createTest([]);
                createTest(["a"]);
            });

            runner.testFunction("getArgumentName()", () =>
            {
                function getArgumentNameTest(arg: string, expected: string | undefined): void
                {
                    runner.test(`with ${runner.toString(arg)}`, (test: Test) =>
                    {
                        test.assertEqual(CommandLineParameters.getArgumentName(arg), expected);
                    });
                }

                getArgumentNameTest("", undefined);
                getArgumentNameTest("  ", undefined);
                getArgumentNameTest("abc", undefined);
                getArgumentNameTest("-", "");
                getArgumentNameTest("--", "");
                getArgumentNameTest("-a", "a");
                getArgumentNameTest("--b", "b");
                getArgumentNameTest("-apples", "apples");
                getArgumentNameTest("--bananas", "bananas");
                getArgumentNameTest("---cat", "-cat");
            });

            runner.testFunction("getNamedArgumentStringValue()", () =>
            {
                function getNamedArgumentStringValueErrorTest(args: string[], nameOrNames: string | JavascriptIterable<string>, expected: Error): void
                {
                    runner.test(`with ${runner.andList([args, nameOrNames])}`, (test: Test) =>
                    {
                        const parameters: CommandLineParameters = CommandLineParameters.create(args);
                        test.assertThrows(() => parameters.getNamedArgumentStringValue(nameOrNames).await(), expected);
                    });
                }

                getNamedArgumentStringValueErrorTest([], undefined!, new PreConditionError({
                    expression: "nameOrNames",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                getNamedArgumentStringValueErrorTest([], null!, new PreConditionError({
                    expression: "nameOrNames",
                    expected: "not undefined and not null",
                    actual: "null",
                }));
                getNamedArgumentStringValueErrorTest([], "", new PreConditionError({
                    expression: "nameOrNames",
                    expected: "not empty",
                    actual: `""`,
                }));
                getNamedArgumentStringValueErrorTest([], [], new PreConditionError({
                    expression: "nameOrNames",
                    expected: "not empty",
                    actual: "[]",
                }));
                getNamedArgumentStringValueErrorTest([], "a", new NotFoundError(
                    "No argument found that matches \"a\".",
                ));
                getNamedArgumentStringValueErrorTest([], ["a", "b"], new NotFoundError(
                    "No argument found that matches \"a\" or \"b\".",
                ));
                getNamedArgumentStringValueErrorTest([], ["a", "b", "c"], new NotFoundError(
                    "No argument found that matches \"a\", \"b\", or \"c\".",
                ));
            });
        });
    });
}