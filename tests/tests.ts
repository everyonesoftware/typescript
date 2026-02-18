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
import * as mutableConditionTests from "./mutableConditionTests";
import * as realHttpServerTests from "./nodeJSHttpServerTests";
import * as notFoundErrorTests from "./notFoundErrorTests";
import * as postConditionErrorTests from "./postConditionErrorTests";
import * as preConditionErrorTests from "./preConditionErrorTests";
import * as propertyTests from "./propertyTests";
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

ConsoleTestRunner.run([
    byteTests.test,
    comparerTests,
    conditionTests,
    consoleTestRunner2Tests,
    disposableTests,
    englishTests,
    equalFunctionsTests.test,
    fetchHttpClientTests,
    httpClientTests,
    indexableTests,
    inMemoryCharacterWriteStreamTests,
    iterableTests,
    iteratorTests,
    javascriptMapMapTests,
    listTests,
    mapIteratorTests,
    mapTests,
    mutableConditionTests,
    notFoundErrorTests,
    postConditionErrorTests,
    preConditionErrorTests,
    propertyTests,
    resultTests,
    stringComparerTests,
    stringIteratorTests,
    stringsTests,
    syncResultTests,
    testActionTests,
    testRunnerTests,
    toStringFunctionsTests,
    typesTests,
    whereIteratorTests,
    realHttpServerTests,
]);