import { FetchHttpClient } from "../sources/fetchHttpClient";
import { FetchHttpResponse } from "../sources/fetchHttpResponse";
import { HttpRequest } from "../sources/httpRequest";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("fetchHttpClient.ts", () =>
    {
        runner.testType("FetchHttpClient", () =>
        {
            runner.test("create()", (test: Test) =>
            {
                const client: FetchHttpClient = FetchHttpClient.create();
                test.assertNotUndefinedAndNotNull(client);
            });

            runner.testFunction("sendRequest()", () =>
            {
                runner.test("to URL that exists", runner.skip("No network connection"), async (test: Test) =>
                {
                    const client: FetchHttpClient = FetchHttpClient.create();

                    const response: FetchHttpResponse = await client.sendRequest(HttpRequest.get("https://www.example.com"));
                    test.assertNotUndefinedAndNotNull(response);
                    test.assertEqual(200, response.getStatusCode());
                });
            });
        });
    });
}