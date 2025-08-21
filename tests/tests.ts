import { TestRunner } from "./testRunner";
import { VitestTestRunner } from "./vitestTestRunner";

export function createTestRunner(): TestRunner
{
    return VitestTestRunner.create();
}