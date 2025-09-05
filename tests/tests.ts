import * as byteTests from "./bytesTests";
import * as conditionTests from "./conditionTests";
import { ConsoleTestRunner } from "./consoleTestRunner";
import * as disposableTests from "./disposableTests";
import * as englishTests from "./englishTests";
import * as indexableTests from "./indexableTests";
import * as iterableTests from "./iterableTests";
import * as iteratorTests from "./iteratorTests";
import * as javascriptMapMapTests from "./javascriptMapMapTests";
import * as listTests from "./listTests";
import * as mapIteratorTests from "./mapIteratorTests";

function main(): void
{
    const runner = ConsoleTestRunner.create();

    byteTests.test(runner);
    conditionTests.test(runner);
    disposableTests.test(runner);
    englishTests.test(runner);
    indexableTests.test(runner);
    iterableTests.test(runner);
    iteratorTests.test(runner);
    javascriptMapMapTests.test(runner);
    listTests.test(runner);
    mapIteratorTests.test(runner);
}

main();