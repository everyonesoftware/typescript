import { EmptyError } from "./emptyError";
import { Iterator } from "./iterator";
import { IndexableIterator } from "./indexableIterator";
import { Iterable } from "./iterable";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { MutableIndexable } from "./mutableIndexable";
import { PreCondition } from "./preCondition";
import { Result2 } from "./result2";
import { SyncResult2 } from "./syncResult2";
import { Type } from "./types";

/**
 * An object that can access its elements by index.
 */
export abstract class Indexable<T> implements Iterable<T>
{
    public static create<T>(values?: JavascriptIterable<T>): Indexable<T>
    {
        return MutableIndexable.create(values);
    }

    public abstract iterate(): IndexableIterator<T>;

    public abstract toArray(): T[];

    public any(): SyncResult2<boolean>
    {
        return Indexable.any(this);
    }

    public static any<T>(indexable: Indexable<T>): SyncResult2<boolean>
    {
        return SyncResult2.create(() => indexable.iterate().next());
    }

    public abstract getCount(): SyncResult2<number>;

    public abstract equals(right: Iterable<T>): SyncResult2<boolean>;

    public abstract toString(): string;

    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterable<T, TOutput>;

    public abstract where(condition: (value: T) => boolean): Iterable<T>;

    public abstract instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>;

    public abstract [Symbol.iterator](): JavascriptIterator<T>;

    /**
     * Get the value at the provided index.
     * @param index The index of the value to return.
     */
    public abstract get(index: number): SyncResult2<T>;

    /**
     * Get the first value in this {@link Indexable}.
     */
    public first(): SyncResult2<T>
    {
        return Indexable.first(this);
    }

    /**
     * Get the first value in the provided {@link Indexable}.
     */
    public static first<T>(indexable: Indexable<T>): SyncResult2<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(indexable, "indexable");

        return SyncResult2.create(() =>
        {
            const iterator: Iterator<T> = indexable.iterate();
            if (!iterator.next())
            {
                throw new EmptyError();
            }
            return iterator.getCurrent();
        });
    }

    /**
     * Get the last value in this {@link Indexable}.
     */
    public last(): SyncResult2<T>
    {
        return Indexable.last(this);
    }

    /**
     * Get the last value in the provided {@link Indexable}.
     */
    public static last<T>(indexable: Indexable<T>): SyncResult2<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(indexable, "indexable");

        return SyncResult2.create(() =>
        {
            const iterator: Iterator<T> = indexable.iterate();
            if (!iterator.next())
            {
                throw new EmptyError();
            }

            let result: T = iterator.getCurrent();
            while (iterator.next())
            {
                result = iterator.getCurrent();
            }

            return result;
        });
    }
}

