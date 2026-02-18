import { Indexable } from "./indexable";
import { IndexableIterator } from "./indexableIterator";
import { Iterable } from "./iterable";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { JavascriptArrayList } from "./javascriptArrayList";
import { MapIterable } from "./mapIterable";
import { MutableIndexable } from "./mutableIndexable";
import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { Type } from "./types";

export abstract class List<T> implements MutableIndexable<T>
{
    public static create<T>(values?: JavascriptIterable<T>): List<T>
    {
        return JavascriptArrayList.create(values);
    }

    public abstract iterate(): IndexableIterator<T>;

    public abstract toArray(): T[];

    public abstract equals(right: Iterable<T>): boolean;

    public abstract toString(): string;

    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterable<T, TOutput>;

    public abstract where(condition: (value: T) => boolean): Iterable<T>;

    public abstract instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>;

    public abstract any(): boolean;

    public abstract getCount(): number;

    public first(): Result<T>
    {
        return Indexable.first(this);
    }

    public last(): Result<T>
    {
        return Indexable.last(this);
    }

    public abstract get(index: number): T;

    public abstract set(index: number, value: T): this;

    public abstract [Symbol.iterator](): JavascriptIterator<T>;

    /**
     * Add the provided value to the end of this {@link List}.
     * @param value The value to add.
     */
    public add(value: T): this
    {
        return List.add(this, value);
    }

    /**
     * Add the provided value to the provided {@link List}.
     * @param list The {@link List} to add the value to.
     * @param value The value to add.
     */
    public static add<T,TList extends List<T>>(list: TList, value: T): TList
    {
        PreCondition.assertNotUndefinedAndNotNull(list, "list");
        
        return list.insert(list.getCount(), value);
    }

    /**
     * Add the provided values to the end of this {@link List}.
     * @param values The values to add.
     */
    public addAll(values: JavascriptIterable<T>): this
    {
        return List.addAll(this, values);
    }

    /**
     * Add the provided values to the end of the provided {@link List}.
     * @param list The {@link List} to add the values to.
     * @param values The values to add.
     */
    public static addAll<T,TList extends List<T>>(list: TList, values: JavascriptIterable<T>): TList
    {
        PreCondition.assertNotUndefinedAndNotNull(list, "list");
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        return list.insertAll(list.getCount(), values);
    }

    /**
     * Insert the value at the index in this {@link List}.
     * @param index The index to insert the value at.
     * @param value The value to insert.
     */
    public abstract insert(index: number, value: T): this;

    /**
     * Insert the values at the index in this {@link List}.
     * @param index The index to insert the values at.
     * @param values The values to insert.
     */
    public abstract insertAll(index: number, values: JavascriptIterable<T>): this;

    /**
     * Insert the values at the index in this {@link List}.
     * @param list The list to insert the values into.
     * @param index The index to insert the values at.
     * @param values The values to insert.
     */
    public static insertAll<T,TList extends List<T>>(list: TList, index: number, values: JavascriptIterable<T>): TList
    {
        PreCondition.assertNotUndefinedAndNotNull(list, "list");
        PreCondition.assertInsertIndex(index, list.getCount(), "index");
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        let insertIndex: number = index;
        for (const value of values)
        {
            list.insert(insertIndex, value);
            insertIndex++;
        }
        return list;
    }

    /**
     * Attempt to remove the first instance of the provided value from this {@link List}. Return
     * whether the value was removed.
     * @param value The value to remove.
     */
    public abstract remove(value: T): boolean;

    public static remove<T>(list: List<T>, value: T): boolean
    {
        PreCondition.assertNotUndefinedAndNotNull(list, "list");

        let result: boolean = false;
        for (let i = 0; i < list.getCount(); i++)
        {
            if (value === list.get(i))
            {
                list.removeAt(i);
                result = true;
                break;
            }
        }

        return result;
    }

    /**
     * Remove and return the value in this {@link List} at the provided index.
     * @param index The index to remove a value from.
     */
    public abstract removeAt(index: number): T;

    /**
     * Remove the last value in this {@link List}.
     */
    public abstract removeLast(): T;

    public static removeLast<T,TList extends List<T>>(list: TList): T
    {
        PreCondition.assertNotEmpty(list, "list");

        return list.removeAt(list.getCount() - 1);
    }
}