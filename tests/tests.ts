import { CurrentProcess } from "../sources/currentProcess";
import * as byteTests from "./bytesTests";
import * as comparerTests from "./comparerTests";
import * as conditionTests from "./conditionTests";
import { ConsoleTestRunner } from "./consoleTestRunner";
import * as consoleTestRunner2Tests from "./consoleTestRunnerTests";
import * as disposableTests from "./disposableTests";
import * as englishTests from "./englishTests";
import * as equalFunctionsTests from "./equalFunctionsTests";
import * as fetchHttpClientTests from "./fetchHttpClientTests";
import * as httpClientTests from "./httpClientTests";
import * as indexableTests from "./indexableTests";
import * as inMemoryCharacterWriteStreamTests from "./inMemoryCharacterWriteStreamTests";
import * as iterableTests from "./iterableTests";
import * as iteratorTests from "./iteratorTests";
import * as javascriptMapMapTests from "./javascriptMapMapTests";
import * as listTests from "./listTests";
import * as mapIteratorTests from "./mapIteratorTests";
import * as mapTests from "./mapTests";
import * as notFoundErrorTests from "./notFoundErrorTests";
import * as postConditionErrorTests from "./postConditionErrorTests";
import * as preConditionErrorTests from "./preConditionErrorTests";
import * as resultTests from "./resultTests";
import * as stringComparerTests from "./stringComparerTests";
import * as stringIteratorTests from "./stringIteratorTests";
import * as stringsTests from "./stringsTests";
import * as syncResultTests from "./syncResultTests";
import * as testActionTests from "./testActionTests";
import * as testRunnerTests from "./testRunnerTests";
import * as toStringFunctionsTests from "./toStringFunctionsTests";
import * as typesTests from "./typesTests";
import * as whereIteratorTests from "./whereIteratorTests";

async function main(): Promise<void>
{
    const currentProcess: CurrentProcess = CurrentProcess.create();
    const runner = ConsoleTestRunner.create()
        .setWriteStream(currentProcess.getOutputWriteStream());

    byteTests.test(runner);
    comparerTests.test(runner);
    conditionTests.test(runner);
    disposableTests.test(runner);
    englishTests.test(runner);
    equalFunctionsTests.test(runner);
    fetchHttpClientTests.test(runner);
    httpClientTests.test(runner);
    indexableTests.test(runner);
    iterableTests.test(runner);
    iteratorTests.test(runner);
    javascriptMapMapTests.test(runner);
    listTests.test(runner);
    mapIteratorTests.test(runner);
    mapTests.test(runner);
    notFoundErrorTests.test(runner);
    postConditionErrorTests.test(runner);
    preConditionErrorTests.test(runner);
    resultTests.test(runner);
    stringComparerTests.test(runner);
    stringIteratorTests.test(runner);
    stringsTests.test(runner);
    syncResultTests.test(runner);
    toStringFunctionsTests.test(runner);
    typesTests.test(runner);
    whereIteratorTests.test(runner);
    testActionTests.test(runner);
    consoleTestRunner2Tests.test(runner);
    testRunnerTests.test(runner);
    inMemoryCharacterWriteStreamTests.test(runner);

    await runner.runAsync();

    runner.printSummary();
}

main();