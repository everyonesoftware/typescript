import * as byteTests from "./bytesTests";
import * as conditionTests from "./conditionTests";
import { ConsoleTestRunner } from "./consoleTestRunner";
import * as disposableTests from "./disposableTests";

function main(): void
{
    const runner = ConsoleTestRunner.create();

    byteTests.test(runner);
    conditionTests.test(runner);
    disposableTests.test(runner);
}

main();