import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { List } from "./list";
import { PreCondition } from "./preCondition";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { Type } from "./types";

export class JavascriptArrayList<T> implements List<T>
{
    private readonly array: T[];

    private constructor()
    {
        this.array = [];
    }

    public static create<T>(values?: JavascriptIterable<T>): JavascriptArrayList<T>
    {
        const result: JavascriptArrayList<T> = new JavascriptArrayList<T>();
        if (values)
        {
            result.addAll(values);
        }
        return result;
    }

    public set(index: number, value: T): this
    {
        PreCondition.assertAccessIndex(index, this.getCount().await(), "index");

        this.array[index] = value;

        return this;
    }

    public iterate(): Iterator<T>
    {
        return Iterator.create(this.array);
    }

    public getCount(): SyncResult<number>
    {
        return SyncResult.value(this.array.length);
    }

    public get(index: number): SyncResult<T>
    {
        PreCondition.assertAccessIndex(index, this.getCount().await(), "index");

        return SyncResult.value(this.array[index]);
    }

    public insert(index: number, value: T): this
    {
        PreCondition.assertInsertIndex(index, this.getCount().await(), "index");

        this.array.splice(index, 0, value);

        return this;
    }

    public insertAll(index: number, values: JavascriptIterable<T>): this
    {
        PreCondition.assertInsertIndex(index, this.getCount().await(), "index");
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        this.array.splice(index, 0, ...values);

        return this;
    }

    public removeAt(index: number): T
    {
        PreCondition.assertAccessIndex(index, this.getCount().await(), "index");

        return this.array.splice(index, 1)[0];
    }

    public removeLast(): T
    {
        PreCondition.assertNotEmpty(this, "this");

        return this.array.pop()!;
    }

    public add(value: T): this
    {
        return List.add(this, value);
    }

    public addAll(values: JavascriptIterable<T>): this
    {
        return List.addAll(this, values);
    }

    public remove(value: T, equalFunctions?: EqualFunctions): boolean
    {
        return List.remove(this, value, equalFunctions);
    }

    public toArray(): SyncResult<T[]>
    {
        return SyncResult.value(this.array.slice());
    }

    public any(): SyncResult<boolean>
    {
        return List.any(this);
    }

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return List.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return List.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return List.concatenate(this, ...toConcatenate);
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

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return List.first(this, condition);
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return List.last(this, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return List[Symbol.iterator](this);
    }

    public contains(value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return List.contains(this, value, equalFunctions);
    }
}