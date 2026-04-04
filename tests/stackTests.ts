import { EmptyError } from "../sources/emptyError";
import { JavascriptArrayStack } from "../sources/javascriptArrayStack";
import { Stack } from "../sources/stack";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("stack.ts", () =>
    {
        runner.testType("Stack<T>", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const stack: JavascriptArrayStack<number> = Stack.create();
                test.assertNotUndefinedAndNotNull(stack);
                test.assertFalse(stack.any().await());
            });

            runner.testFunction("push()", (test: Test) =>
            {
                const stack: JavascriptArrayStack<number> = Stack.create();

                stack.push(10).await();
                test.assertTrue(stack.any().await());

                stack.push(20).await();
                test.assertTrue(stack.any().await());

                test.assertEqual(20, stack.pop().await());
                test.assertEqual(10, stack.pop().await());
                test.assertFalse(stack.any().await());
            });

            runner.testFunction("pushAll()", () =>
            {
                function pushAllTest(values: number[]): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        const stack: JavascriptArrayStack<number> = Stack.create();
                        stack.pushAll(values).await();

                        for (const value of values.reverse())
                        {
                            test.assertTrue(stack.any().await());
                            test.assertEqual(value, stack.pop().await());
                        }
                        test.assertFalse(stack.any().await());
                    });
                }

                pushAllTest([]);
                pushAllTest([1]);
                pushAllTest([1, 2]);
                pushAllTest([1, 2, 3]);
            });

            runner.testFunction("pop()", (test: Test) =>
            {
                const stack: JavascriptArrayStack<number> = Stack.create();
                test.assertThrows(() => stack.pop().await(), new EmptyError());
            });
        });
    });
}