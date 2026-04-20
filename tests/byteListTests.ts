import { ByteList } from "../sources/byteList";
import { EqualFunctions } from "../sources/equalFunctions";
import { NotFoundError } from "../sources/notFoundError";
import { PreConditionError } from "../sources/preConditionError";
import { isNumber } from "../sources/types";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("byteList.ts", () =>
    {
        runner.testType("ByteList", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const list: ByteList = ByteList.create();
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(0, list.getCount().await());
                    test.assertFalse(list.any().await());
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with undefined", (test: Test) =>
                {
                    const list: ByteList = ByteList.create(undefined);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(0, list.getCount().await());
                    test.assertFalse(list.any().await());
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with null", (test: Test) =>
                {
                    const list: ByteList = ByteList.create(null!);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(0, list.getCount().await());
                    test.assertFalse(list.any().await());
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with empty initialValues", (test: Test) =>
                {
                    const list: ByteList = ByteList.create([]);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(0, list.getCount().await());
                    test.assertFalse(list.any().await());
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with negative value", (test: Test) =>
                {
                    test.assertThrows(() => ByteList.create([-1]), new PreConditionError(
                        "Expression: value",
                        "Expected: between 0 and 255",
                        "Actual: -1",
                    ));
                });

                runner.test("with too large values", (test: Test) =>
                {
                    test.assertThrows(() => ByteList.create([1, 10, 100, 1000]), new PreConditionError(
                        "Expression: value",
                        "Expected: between 0 and 255",
                        "Actual: 1000",
                    ));
                });

                runner.test("with one value", (test: Test) =>
                {
                    const list: ByteList = ByteList.create([20]);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(1, list.getCount().await());
                    test.assertTrue(list.any().await());
                    test.assertEqual([20], list.toArray().await());
                });

                runner.test("with two values", (test: Test) =>
                {
                    const list: ByteList = ByteList.create([20, 21]);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(2, list.getCount().await());
                    test.assertTrue(list.any().await());
                    test.assertEqual([20, 21], list.toArray().await());
                });
            });

            runner.testFunction("add()", () =>
            {
                function addErrorTest(value: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const list: ByteList = ByteList.create();
                        test.assertThrows(() => list.add(value), expected);
                        test.assertEqual([], list.toArray().await());
                    });
                }

                addErrorTest(-1, new PreConditionError(
                    "Expression: value",
                    "Expected: between 0 and 255",
                    "Actual: -1",
                ));
                addErrorTest(256, new PreConditionError(
                    "Expression: value",
                    "Expected: between 0 and 255",
                    "Actual: 256",
                ));

                runner.test("with valid value", (test: Test) =>
                {
                    const list: ByteList = ByteList.create();

                    const addResult1: ByteList = list.add(25);
                    test.assertSame(list, addResult1);
                    test.assertEqual([25], addResult1.toArray().await());
                    
                    const addResult2: ByteList = list.add(26);
                    test.assertSame(list, addResult2);
                    test.assertEqual([25, 26], addResult2.toArray().await());

                    const addResult3: ByteList = list.add(27);
                    test.assertSame(list, addResult3);
                    test.assertEqual([25, 26, 27], addResult3.toArray().await());

                    const addResult4: ByteList = list.add(28);
                    test.assertSame(list, addResult4);
                    test.assertEqual([25, 26, 27, 28], addResult4.toArray().await());
                });
            });

            runner.testFunction("addAll()", () =>
            {
                runner.test("with empty values", (test: Test) =>
                {
                    const list: ByteList = ByteList.create();

                    const addAllResult: ByteList = list.addAll([]);
                    test.assertSame(list, addAllResult);
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with non-empty values", (test: Test) =>
                {
                    const list: ByteList = ByteList.create();

                    const addAllResult: ByteList = list.addAll([1, 2, 3, 4, 5]);
                    test.assertSame(list, addAllResult);
                    test.assertEqual([1, 2, 3, 4, 5], list.toArray().await());
                });
            });

            runner.testFunction("insert()", () =>
            {
                function insertErrorTest(initialValues: number[], index: number, value: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index, value])}`, (test: Test) =>
                    {
                        const list: ByteList = ByteList.create(initialValues);
                        test.assertThrows(() => list.insert(index, value), expected);
                        test.assertEqual(initialValues, list.toArray().await());
                    });
                }

                insertErrorTest([], -1, 0, new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: -1",
                ));
                insertErrorTest([], 1, 0, new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: 1",
                ));
                insertErrorTest([100], -1, 0, new PreConditionError(
                    "Expression: index",
                    "Expected: between 0 and 1",
                    "Actual: -1",
                ));
                insertErrorTest([100], 2, 0, new PreConditionError(
                    "Expression: index",
                    "Expected: between 0 and 1",
                    "Actual: 2",
                ));
                insertErrorTest([], 0, -1, new PreConditionError(
                    "Expression: value",
                    "Expected: between 0 and 255",
                    "Actual: -1",
                ));
                insertErrorTest([], 0, 256, new PreConditionError(
                    "Expression: value",
                    "Expected: between 0 and 255",
                    "Actual: 256",
                ));

                function insertTest(initialValues: number[], index: number, value: number, expected: number[]): void
                {
                    runner.test(`with ${runner.andList([initialValues, index, value])}`, (test: Test) =>
                    {
                        const list: ByteList = ByteList.create(initialValues);

                        const insertResult: ByteList = list.insert(index, value);
                        test.assertSame(list, insertResult);
                        test.assertEqual(expected, list.toArray().await());
                    });
                }

                insertTest([], 0, 100, [100]);
                insertTest([1], 0, 10, [10, 1]);
                insertTest([1], 1, 10, [1, 10]);
                insertTest([1, 2, 3], 0, 100, [100, 1, 2, 3]);
                insertTest([1, 2, 3], 1, 100, [1, 100, 2, 3]);
                insertTest([1, 2, 3], 2, 100, [1, 2, 100, 3]);
                insertTest([1, 2, 3], 3, 100, [1, 2, 3, 100]);
                insertTest([1, 2, 3, 4, 5], 2, 100, [1, 2, 100, 3, 4, 5]);
            });

            runner.testFunction("remove()", () =>
            {
                runner.test("with not-found value", (test: Test) =>
                {
                    const list: ByteList = ByteList.create();

                    test.assertThrows(() => list.remove(20).await(), new NotFoundError("Could not find the value to remove: 20"));
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with found value", (test: Test) =>
                {
                    const list: ByteList = ByteList.create([20]);

                    const removeResult: number = list.remove(20).await();
                    test.assertEqual(20, removeResult);
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with multiple found values", (test: Test) =>
                {
                    const list: ByteList = ByteList.create([20, 20, 20]);

                    const removeResult: number = list.remove(20).await();
                    test.assertEqual(20, removeResult);
                    test.assertEqual([20, 20], list.toArray().await());
                });

                runner.test("with multiple found values and equalFunctions", (test: Test) =>
                {
                    const list: ByteList = ByteList.create([20, 21, 22, 23, 24]);
                    const equalFunctions: EqualFunctions = EqualFunctions.create()
                        .add((left: unknown, right: unknown) =>
                        {
                            return isNumber(left) && isNumber(right)
                                ? (left % 2) === (right % 2)
                                : undefined;
                        });
                    const removeResult: number = list.remove(5, equalFunctions).await();
                    test.assertEqual(21, removeResult);
                    test.assertEqual([20, 22, 23, 24], list.toArray().await());
                });
            });
        });
    });
}