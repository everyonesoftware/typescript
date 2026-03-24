import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { List } from "./list";
import { PreCondition } from "./preCondition";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { Type } from "./types";

/**
 * A type that wraps around another {@link List}.
 */
export abstract class ListDecorator<T> implements List<T>
{
    private readonly innerList: List<T>;

    protected constructor(innerList: List<T>)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerList, "innerList");

        this.innerList = innerList;
    }

    public set(index: number, value: T): this
    {
        this.innerList.set(index, value);

        return this;
    }

    public iterate(): Iterator<T>
    {
        return this.innerList.iterate();
    }

    public any(): SyncResult<boolean>
    {
        return this.innerList.any();
    }

    public getCount(): SyncResult<number>
    {
        return this.innerList.getCount();
    }

    public get(index: number): SyncResult<T>
    {
        return this.innerList.get(index);
    }

    public insert(index: number, value: T): this
    {
        this.innerList.insert(index, value);

        return this;
    }

    public insertAll(index: number, values: JavascriptIterable<T>): this
    {
        this.innerList.insertAll(index, values);

        return this;
    }

    public remove(value: T): boolean
    {
        return this.innerList.remove(value);
    }

    public removeAt(index: number): T
    {
        return this.innerList.removeAt(index);
    }

    public removeLast(): T
    {
        return this.innerList.removeLast();
    }

    public toArray(): SyncResult<T[]>
    {
        return List.toArray(this);
    }

    public equals(right: Iterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return List.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return List.toString(this, toStringFunctions);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return List.map(this, mapping);
    }

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return List.where(this, condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return List.instanceOf(this, typeOrTypeCheck);
    }

    public first(condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return List.first(this, condition);
    }

    public last(condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return List.last(this, condition);
    }

    public add(value: T): this
    {
        this.innerList.add(value);

        return this;
    }

    public addAll(values: JavascriptIterable<T>): this
    {
        return List.addAll(this, values);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return List[Symbol.iterator](this);
    }
}