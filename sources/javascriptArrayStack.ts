import { EmptyError } from "./emptyError";
import { JavascriptIterable } from "./javascript";
import { PreCondition } from "./preCondition";
import { Stack } from "./stack";
import { SyncResult } from "./syncResult";

export class JavascriptArrayStack<T> implements Stack<T>
{
    private readonly values: T[];

    private constructor()
    {
        this.values = [];
    }

    public static create<T>(): JavascriptArrayStack<T>
    {
        return new JavascriptArrayStack<T>();
    }

    public any(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            return this.values.length > 0;
        });
    }

    public push(value: T): SyncResult<void>
    {
        return SyncResult.create(() =>
        {
            this.values.push(value);
        });
    }

    public pushAll(values: JavascriptIterable<T>): SyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        return SyncResult.create(() =>
        {
            this.values.push(...values);
        });
    }

    public pop(): SyncResult<T>
    {
        return SyncResult.create(() =>
        {
            if (!this.any().await())
            {
                throw new EmptyError();
            }
            return this.values.pop()!;
        });
    }
}