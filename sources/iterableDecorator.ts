import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { PreCondition } from "./preCondition";
import { SyncResult } from "./syncResult";
import { Type } from "./types";

export abstract class IterableDecorator<T> implements Iterable<T>
{
    private readonly innerIterable: Iterable<T>;

    protected constructor(innerIterable: Iterable<T>)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterable, "innerIterable");

        this.innerIterable = innerIterable;
    }

    public any(): SyncResult<boolean>
    {
        return this.innerIterable.any();
    }

    public getCount(): SyncResult<number>
    {
        return this.innerIterable.getCount();
    }

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return this.innerIterable.equals(right, equalFunctions);
    }

    public toArray(): SyncResult<T[]>
    {
        return this.innerIterable.toArray();
    }

    public where(condition: (value: T) => boolean): Iterable<T>
    {
        return this.innerIterable.where(condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return this.innerIterable.instanceOf(typeOrTypeCheck);
    }

    public map<TOutput>(mapping: (value: T) => TOutput): Iterable<TOutput>
    {
        return this.innerIterable.map(mapping);
    }

    public first(condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return this.innerIterable.first(condition);
    }

    public last(condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return this.innerIterable.last(condition);
    }

    public iterate(): Iterator<T>
    {
        return this.innerIterable.iterate();
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return this.innerIterable[Symbol.iterator]();
    }
}