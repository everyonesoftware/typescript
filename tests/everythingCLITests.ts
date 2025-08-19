import { TestRunner } from "./testRunner";
import { VitestTestRunner } from "./vitestTestRunner";
import * as bytesTests from "./bytesTests";

function testMain(): void
{
    const runner: TestRunner = VitestTestRunner.create();

    bytesTests.test(runner);
}
testMain();