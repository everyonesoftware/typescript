import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("testFailure.ts", () =>
    {
        runner.testType("TestFailure", () =>
        {
            
        });
    });
}