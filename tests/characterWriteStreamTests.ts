import { CharacterWriteStream } from "../sources/characterWriteStream";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner, creator: () => CharacterWriteStream): void
{
    runner.testFile("characterWriteStream.ts", () =>
    {
        runner.testType("CharacterWriteStream", () =>
        {
        });
    });
}