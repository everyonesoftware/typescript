import { HttpClient } from "../sources/httpClient";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("httpClient.ts", () =>
    {
        runner.testType("HttpClient", () =>
        {
            runner.test("create()", (test: Test) =>
            {
                const client: HttpClient = HttpClient.create();
                test.assertNotUndefinedAndNotNull(client);
            });
        });
    });
}