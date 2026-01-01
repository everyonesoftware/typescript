import { PreConditionError } from "../sources/preConditionError";
import { RealHttpServer } from "../sources/realHttpServer";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("realHttpServer.ts", () =>
    {
        runner.testType("RealHttpServer", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const httpServer: RealHttpServer = RealHttpServer.create();
                test.assertNotUndefinedAndNotNull(httpServer);
                test.assertFalse(httpServer.isDisposed());
                test.assertFalse(httpServer.isListening());
            });

            runner.testFunction("dispose()", (test: Test) =>
            {
                const httpServer: RealHttpServer = RealHttpServer.create();
                
                test.assertTrue(httpServer.dispose().await());
                test.assertTrue(httpServer.isDisposed());
                test.assertFalse(httpServer.isListening());

                for (let i = 0; i < 3; i++)
                {
                    test.assertFalse(httpServer.dispose().await());
                    test.assertTrue(httpServer.isDisposed());
                    test.assertFalse(httpServer.isListening());
                }
            });

            runner.testFunction("listen()", () =>
            {
                runner.test("when disposed", (test: Test) =>
                {
                    const httpServer: RealHttpServer = RealHttpServer.create();
                    test.assertTrue(httpServer.dispose().await());

                    test.assertThrows(() => httpServer.listen(3000), new PreConditionError(
                        "Expression: this.isDisposed()",
                        "Expected: false",
                        "Actual: true",
                    ));
                    test.assertTrue(httpServer.isDisposed());
                    test.assertFalse(httpServer.isListening());
                });

                runner.test("simple scenario", (test: Test) =>
                {
                    const httpServer: RealHttpServer = RealHttpServer.create();

                    httpServer.listen(3000).await();
                });
            });
        });
    });
}