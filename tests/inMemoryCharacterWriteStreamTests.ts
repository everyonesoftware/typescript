import { InMemoryCharacterWriteStream } from "../sources/inMemoryCharacterWriteStream";
import { Result } from "../sources/result";
import { isUndefined } from "../sources/types";
import * as characterWriteStreamTests from "./characterWriteStreamTests";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("inMemoryCharacterWriteStream.ts", () =>
    {
        runner.testType("InMemoryCharacterWriteStream", () =>
        {
            characterWriteStreamTests.test(runner, InMemoryCharacterWriteStream.create);

            runner.testFunction("create()", (test: Test) =>
            {
                const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                test.assertNotUndefinedAndNotNull(writeStream);
                test.assertEqual("", writeStream.getWrittenText());
                test.assertEqual("\n", writeStream.getNewlineSequence());
            });

            runner.testFunction("clearWrittenText()", (test: Test) =>
            {
                const writeStream = InMemoryCharacterWriteStream.create();

                const result1: InMemoryCharacterWriteStream = writeStream.clearWrittenText();
                test.assertSame(writeStream, result1);
                test.assertEqual("", writeStream.getWrittenText());

                writeStream.writeString("hello world!").await();
                test.assertEqual("hello world!", writeStream.getWrittenText());

                const result2: InMemoryCharacterWriteStream = writeStream.clearWrittenText();
                test.assertSame(writeStream, result2);
                test.assertEqual("", writeStream.getWrittenText());
            });

            runner.testFunction("setNewlineSequence()", (test: Test) =>
            {
                const writeStream = InMemoryCharacterWriteStream.create();

                const result1: InMemoryCharacterWriteStream = writeStream.setNewlineSequence("d");
                test.assertSame(writeStream, result1);
                test.assertEqual("d", writeStream.getNewlineSequence());
                test.assertEqual("", writeStream.getWrittenText());

                const result2: Result<number> = writeStream.writeString("ab");
                test.assertEqual("", writeStream.getWrittenText());
                for (let i = 0; i < 3; i++)
                {
                    test.assertEqual(2, result2.await());
                    test.assertEqual("ab", writeStream.getWrittenText());
                }
            });

            runner.testFunction("writeString()", () =>
            {
                function writeStringTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const expectedWrittenText: string = text || "";
                        const writeStream = InMemoryCharacterWriteStream.create();
                        const result: number = writeStream.writeString(text).await();
                        test.assertEqual(expectedWrittenText.length, result);
                        test.assertEqual(expectedWrittenText, writeStream.getWrittenText());
                    });
                }

                writeStringTest(undefined!);
                writeStringTest(null!);
                writeStringTest("");
                writeStringTest("a");
                writeStringTest("abc");
            });

            runner.testFunction("writeLine()", () =>
            {
                function writeLineTest(text: string, newlineSequence?: string): void
                {
                    runner.test(`with ${runner.toString(text)}${isUndefined(newlineSequence) ? "" : ` and ${runner.toString(newlineSequence)}`}`, (test: Test) =>
                    {
                        
                        const writeStream = InMemoryCharacterWriteStream.create();
                        if (!isUndefined(newlineSequence))
                        {
                            writeStream.setNewlineSequence(newlineSequence);
                        }
                        const expectedWrittenText: string = (text || "") + writeStream.getNewlineSequence();

                        const result: number = writeStream.writeLine(text).await();
                        test.assertEqual(expectedWrittenText.length, result);
                        test.assertEqual(expectedWrittenText, writeStream.getWrittenText());
                    });
                }

                writeLineTest(undefined!);
                writeLineTest(null!);
                writeLineTest("");
                writeLineTest("a");
                writeLineTest("abc");
                writeLineTest("abc", "\r\n");
                writeLineTest("abc", "");
            });
        });
    });
}