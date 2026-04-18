import { depthFirstSearch } from "../sources/depthFirstSearch";
import { Node } from "../sources/node";
import { Iterator } from "../sources/iterator";
import { PreConditionError } from "../sources/preConditionError";
import { Test } from "./test";
import { TestRunner } from "./testRunner";
import { List } from "../sources/list";
import { SearchControl } from "../sources/searchControl";

export function test(runner: TestRunner): void
{
    runner.testFile("depthFirstSearch.ts", () =>
    {
        runner.testFunction("depthFirstSearch()", () =>
        {
            runner.test("with undefined initialToVisit", (test: Test) =>
            {
                test.assertThrows(() => depthFirstSearch(undefined!, () => {}), new PreConditionError(
                    "Expression: parameters",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
            });

            runner.test("with null initialToVisit", (test: Test) =>
            {
                test.assertThrows(() => depthFirstSearch(null!, () => {}), new PreConditionError(
                    "Expression: parameters",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
            });

            runner.test("with undefined searchAction", (test: Test) =>
            {
                test.assertThrows(() => depthFirstSearch([], undefined!), new PreConditionError(
                    "Expression: searchAction",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
            });

            runner.test("with null searchAction", (test: Test) =>
            {
                test.assertThrows(() => depthFirstSearch([], null!), new PreConditionError(
                    "Expression: searchAction",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
            });

            runner.test("with empty initialToVisit", (test: Test) =>
            {
                const iterator: Iterator<number> = depthFirstSearch([], (searchControl: SearchControl<Node<number>,number>, current: Node<number>) =>
                {
                    searchControl.addAllToVisit(current.iterateConnectedNodes());

                    const currentValue: number = current.getValue();
                    if (currentValue >= 7)
                    {
                        searchControl.addResult(currentValue);
                    }
                });
                test.assertEqual([], iterator.toArray().await());
            });

            runner.test("with non-empty initialToVisit with return values", (test: Test) =>
            {
                const nodes: List<Node<number>> = List.create();
                for (let i = 0; i < 10; i++)
                {
                    nodes.add(Node.create(i));
                }
                
                function connectNodes(index1: number, index2: number): void
                {
                    nodes.get(index1).await().addConnectedNode(nodes.get(index2).await());
                }
                connectNodes(0, 1);
                connectNodes(0, 2);
                connectNodes(1, 5);
                connectNodes(2, 4);
                connectNodes(3, 6);
                connectNodes(4, 5);
                connectNodes(4, 6);
                connectNodes(5, 9);
                connectNodes(6, 7);
                connectNodes(7, 3);
                connectNodes(8, 9);

                const iterator: Iterator<number> = depthFirstSearch([nodes.get(0).await()], (searchControl: SearchControl<Node<number>,number>, current: Node<number>) =>
                {
                    searchControl.addAllToVisit(current.iterateConnectedNodes());

                    const currentValue: number = current.getValue();
                    if (currentValue >= 7)
                    {
                        searchControl.addResult(currentValue);
                    }
                });

                test.assertEqual([7, 9], iterator.toArray().await());
            });
        });
    });
}