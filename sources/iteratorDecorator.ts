import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { PreCondition } from "./preCondition";
import { SyncResult } from "./syncResult";
import { Type } from "./types";

export abstract class IteratorDecorator<T> implements Iterator<T>
{
    private readonly innerIterator: Iterator<T>;
    private started: boolean;

    protected constructor(innerIterator: Iterator<T>)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");

        this.innerIterator = innerIterator;
        this.started = false;
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (!this.hasStarted())
            {
                this.started = true;
                this.innerIterator.start().await();
            }
            else
            {
                this.innerIterator.next().await();
            }
            return this.hasCurrent();
        });
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.innerIterator.hasCurrent();
    }

    public getCurrent(): T
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.innerIterator.getCurrent();
    }

    public start(): SyncResult<this>
    {
        return Iterator.start<T, this>(this);
    }

    public takeCurrent(): SyncResult<T>
    {
        return Iterator.takeCurrent(this);
    }

    public any(): SyncResult<boolean>
    {
        return Iterator.any(this);
    }

    public getCount(): SyncResult<number>
    {
        return Iterator.getCount(this);
    }

    public toArray(): SyncResult<T[]>
    {
        return Iterator.toArray(this);
    }

    public where(condition: (value: T) => boolean): Iterator<T>
    {
        return Iterator.where(this, condition);
    }

    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends T>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterator<TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public first(condition?: (value: T) => boolean): SyncResult<T>
    {
        return Iterator.first(this, condition);
    }

    public last(condition?: (value: T) => boolean): SyncResult<T>
    {
        return Iterator.last(this, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterator[Symbol.iterator](this);
    }

    public take(maximumToTake: number): Iterator<T>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<T>
    {
        return Iterator.skip(this, maximumToSkip);
    }
}