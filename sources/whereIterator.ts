import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";
import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { Type } from "./types";

/**
 * An {@link Iterator} that only returns values that match a condition.
 */
export class WhereIterator<T> implements Iterator<T>
{
    private readonly innerIterator: Iterator<T>;
    private started: boolean;
    private readonly condition: (value: T) => boolean;
    
    private constructor(innerIterator: Iterator<T>, condition: (value: T) => boolean)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");

        this.innerIterator = innerIterator;
        this.started = false;
        this.condition = condition;
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

    public static create<T>(innerIterator: Iterator<T>, condition: (value: T) => boolean): WhereIterator<T>
    {
        return new WhereIterator(innerIterator, condition);
    }

    public next(): boolean
    {
        if (!this.hasStarted())
        {
            this.innerIterator.start();
            this.started = true;

            while (this.hasCurrent() && !this.condition(this.getCurrent()))
            {
                this.innerIterator.next();
            }
        }
        else
        {
            do
            {
                this.innerIterator.next();
            }
            while (this.hasCurrent() && !this.condition(this.getCurrent()));
        }
        return this.hasCurrent();
    }

    public start(): this
    {
        return Iterator.start<T, this>(this);
    }

    public takeCurrent(): T
    {
        return Iterator.takeCurrent(this);
    }

    public any(): boolean
    {
        return Iterator.any(this);
    }

    public getCount(): number
    {
        return Iterator.getCount(this);
    }

    public toArray(): T[]
    {
        return Iterator.toArray(this);
    }

    public where(condition: (value: T) => boolean): Iterator<T>
    {
        return Iterator.where(this, condition);
    }

    public map<TOutput>(mapping: (value: T) => TOutput): MapIterator<T, TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends T>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public first(condition?: (value: T) => boolean): Result<T>
    {
        return Iterator.first(this, condition);
    }

    public last(condition?: (value: T) => boolean): Result<T>
    {
        return Iterator.last(this, condition);
    }

    public take(maximumToTake: number): Iterator<T>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<T>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<T>
    {
        return Iterator[Symbol.iterator](this);
    }
}