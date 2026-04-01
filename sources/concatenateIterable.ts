import { ConcatenateIterator } from "./concatenateIterator";
import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { List } from "./list";
import { PreCondition } from "./preCondition";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { Type } from "./types";

export class ConcatenateIterable<T> implements Iterable<T>
{
    private readonly innerIterables: Iterable<Iterable<T>>;

    private constructor(innerIterables: Iterable<Iterable<T>>)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterables, "innerIterables");

        this.innerIterables = innerIterables;
    }

    public static create<T>(innerIterable: Iterable<T>, ...toConcatenate: JavascriptIterable<T>[]): ConcatenateIterable<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterable, "innerIterable");
        PreCondition.assertNotUndefinedAndNotNull(toConcatenate, "toConcatenate");

        const innerIterables: List<Iterable<T>> = List.create();
        innerIterables.add(innerIterable);
        for (const value of toConcatenate)
        {
            innerIterables.add(Iterable.create(value));
        }
        return new ConcatenateIterable<T>(innerIterables);
    }

    public iterate(): Iterator<T>
    {
        return ConcatenateIterator.create<T>(...this.innerIterables);
    }

    public toArray(): SyncResult<T[]>
    {
        return Iterable.toArray(this);
    }

    public any(): SyncResult<boolean>
    {
        return Iterable.any(this);
    }

    public getCount(): SyncResult<number>
    {
        return SyncResult.create(() =>
        {
            let result: number = 0;
            for (const innerIterable of this.innerIterables)
            {
                result += innerIterable.getCount().await();
            }
            return result;
        });
    }

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Iterable.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return Iterable.concatenate(this, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: T) => TOutput | SyncResult<TOutput>): Iterable<TOutput>
    {
        return Iterable.map(this, mapping);
    }

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return Iterable.where(this, condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return Iterable.instanceOf(this, typeOrTypeCheck);
    }

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Iterable.first(this, condition);
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Iterable.last(this, condition);
    }

    public contains(value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.contains(this, value, equalFunctions);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterable[Symbol.iterator](this);
    }
}