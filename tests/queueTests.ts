import { EmptyError } from "../sources/emptyError";
import { ListQueue } from "../sources/listQueue";
import { Queue } from "../sources/queue";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("queue.ts", () =>
    {
        runner.testType("Queue<T>", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const queue: ListQueue<number> = Queue.create();
                test.assertNotUndefinedAndNotNull(queue);
                test.assertFalse(queue.any().await());
                test.assertThrows(() => queue.remove().await(), new EmptyError());
            });

            runner.testFunction("add()", (test: Test) =>
            {
                const queue: ListQueue<number> = Queue.create();
                queue.add(20).await();
                test.assertEqual(20, queue.remove().await());
            });
        });
    });
}