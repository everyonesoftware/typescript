import { CommandLineParameter, InMemoryCharacterWriteStream, Iterable, JavascriptIterable, join, PreConditionError } from "../sources/index.js";
import { CommandLineCommand } from "../sources/CommandLineCommand.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("CommandLineCommand.ts", () =>
    {
        runner.testType("CommandLineCommand", () =>
        {
            runner.testFunction("create()", () =>
            {
                function withNameErrorTest(name: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(name)}`, (test: Test) =>
                    {
                        test.assertThrows(() => CommandLineCommand.create(name), expected);
                    });
                }

                withNameErrorTest(undefined!, new PreConditionError({
                    expression: "name",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                withNameErrorTest(null!, new PreConditionError({
                    expression: "name",
                    expected: "not undefined and not null",
                    actual: "null",
                }));
                withNameErrorTest("", new PreConditionError({
                    expression: "name",
                    expected: "not empty",
                    actual: `""`,
                }));

                function withNameTest(name: string): void
                {
                    runner.test(`with ${runner.toString(name)}`, (test: Test) =>
                    {
                        const command: CommandLineCommand = CommandLineCommand.create(name);
                        test.assertNotUndefinedAndNotNull(command);
                        test.assertEqual(name, command.getName());
                        test.assertEqual([], command.getAliases());
                        test.assertEqual(Iterable.create([name]), command.getNameAndAliases());
                        test.assertEqual("", command.getDescription());
                        test.assertEqual(1, command.getParameters().getCount().await());
                    });
                }

                withNameTest("a");
                withNameTest("apples");
                withNameTest("hello there");
                withNameTest("ABC!@#");
            });

            runner.testFunction("addParameter()", () =>
            {
                function addParameterNameErrorTest(name: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(name)}`, (test: Test) =>
                    {
                        const command: CommandLineCommand = CommandLineCommand.create("fake-command-name");
                        test.assertThrows(() => command.addParameter(name), expected);
                        test.assertEqual(1, command.getParameters().getCount().await());
                        test.assertEqual("help", command.getParameters().first().await().getName());
                    });
                }

                addParameterNameErrorTest(undefined!, new PreConditionError({
                    expression: "name",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                addParameterNameErrorTest(null!, new PreConditionError({
                    expression: "name",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                addParameterNameErrorTest("", new PreConditionError({
                    expression: "name",
                    expected: "not empty",
                    actual: `""`,
                }));

                function addParameterNameTest(name: string): void
                {
                    runner.test(`with ${runner.toString(name)}`, (test: Test) =>
                    {
                        const command: CommandLineCommand = CommandLineCommand.create("fake-command-name");
                        const parameter: CommandLineParameter = command.addParameter(name);
                        test.assertNotUndefinedAndNotNull(parameter);
                        test.assertEqual(name, parameter.getName());
                        test.assertEqual([], parameter.getAliases());
                        test.assertEqual(Iterable.create([name]), parameter.getNameAndAliases());
                        test.assertEqual("", parameter.getDescription());
                        test.assertEqual(2, command.getParameters().getCount().await());
                        test.assertSame(parameter, command.getParameters().first().await());
                    });
                }

                addParameterNameTest("a");
            });

            runner.testFunction("showHelp()", () =>
            {
                runner.test("with no arguments", async (test: Test) =>
                {
                    const command: CommandLineCommand = CommandLineCommand.create("a");
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();

                    const showHelpResult: boolean = await command.showHelp(writeStream);
                    test.assertFalse(showHelpResult);
                    test.assertEqual("", writeStream.getWrittenText());
                });

                runner.test("with no parameters", async (test: Test) =>
                {
                    const command: CommandLineCommand = CommandLineCommand.create("fake-command", ["fc"], "fake-command-description");
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();

                    const showHelpResult: boolean = await command.showHelp(writeStream, ["--help"]);
                    test.assertTrue(showHelpResult);
                    test.assertEqual(writeStream.getWrittenText(), join("\n", [
                        "Command:     fake-command [fc]",
                        "Description: fake-command-description",
                        "Parameters:",
                        "--help [-?]: Show the command's help menu.",
                        "",
                    ]));
                });

                runner.test("with parameters", async (test: Test) =>
                {
                    const args: JavascriptIterable<string> = ["--help"];

                    const command: CommandLineCommand = CommandLineCommand.create("fake-command", ["fc"], "fake-command-description");
                    command.addParameter("apples", ["a", "ap"], "How many apples?");
                    command.addParameter("vegetarian", ["v", "veg"], "Should it be vegetarian?");
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();

                    const showHelpResult: boolean = await command.showHelp(writeStream, args);
                    test.assertTrue(showHelpResult);
                    test.assertEqual(writeStream.getWrittenText(), join("\n", [
                        "Command:     fake-command [fc]",
                        "Description: fake-command-description",
                        "Parameters:",
                        "--apples [-a,-ap]:      How many apples?",
                        "--vegetarian [-v,-veg]: Should it be vegetarian?",
                        "--help [-?]:            Show the command's help menu.",
                        "",
                    ]));
                });
            });
        });
    });
}