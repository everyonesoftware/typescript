import { MochaTestRunner } from "./mochaTestRunner";
import { TestRunner } from "./testRunner";

export function createTestRunner(): TestRunner
{
    return MochaTestRunner.create();
}