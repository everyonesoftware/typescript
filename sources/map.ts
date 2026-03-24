import { Comparer } from "./comparer";
import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { JavascriptMapMap } from "./javascriptMapMap";
import { NotFoundError } from "./notFoundError";
import { PreCondition } from "./preCondition";
import { join } from "./strings";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { hasFunction, isUndefinedOrNull, Type } from "./types";

/**
 * Get whether the provided value is {@link Map}.
 * @param value The value to check.
 */
export function isMap(value: unknown): value is Map<unknown, unknown>
{
    return value instanceof Map ||
        (
            hasFunction(value, "containsKey", 1) &&
            hasFunction(value, "get", 1) &&
            hasFunction(value, "set", 2) &&
            hasFunction(value, "iterateKeys", 0) &&
            hasFunction(value, "iterateValues", 0)
        );
}

/**
 * An entry within a {@link Map}.
 */
export interface MapEntry<TKey, TValue>
{
    /**
     * The key of the {@link MapEntry}.
     */
    readonly key: TKey,
    /**
     * The value of the {@link MapEntry}.
     */
    readonly value: TValue,
}

/**
 * A type that maps {@link TKey} values to {@link TValue} values.
 */
export abstract class Map<TKey, TValue> implements Iterable<MapEntry<TKey, TValue>>
{
    /**
     * Create a new instance of the default {@link Map} implementation.
     */
    public static create<TKey, TValue>(): Map<TKey, TValue>
    {
        return JavascriptMapMap.create();
    }

    /**
     * Iterate over the entries in this {@link Map}.
     */
    public abstract iterate(): Iterator<MapEntry<TKey, TValue>>;

    public any(): SyncResult<boolean>
    {
        return Map.any(this);
    }

    public static any<TKey,TValue>(map: Map<TKey,TValue>): SyncResult<boolean>
    {
        return Iterable.any(map);
    }

    public toArray(): SyncResult<MapEntry<TKey, TValue>[]>
    {
        return Map.toArray(this);
    }

    public static toArray<TKey,TValue>(map: Map<TKey,TValue>): SyncResult<MapEntry<TKey,TValue>[]>
    {
        return Iterable.toArray(map);
    }

    public equals(right: Iterable<MapEntry<TKey, TValue>>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Map.equals(this, right, equalFunctions);
    }

    public static equals<TKey, TValue>(left: Map<TKey, TValue>, right: Iterable<MapEntry<TKey, TValue>>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (isUndefinedOrNull(equalFunctions))
            {
                equalFunctions = EqualFunctions.create();
            }

            let result: boolean | undefined = Comparer.equalSameUndefinedNull(left, right);
            if (result === undefined)
            {
                result = true;
                for (const entry of right)
                {
                    result = left.get(entry.key)
                        .then((value: TValue) => equalFunctions!.areEqual(value, entry.value).await())
                        .catch(() => false)
                        .await();
                    if (result === false)
                    {
                        break;
                    }
                }
            }
            return result;
        });
    }

    /**
     * Get the {@link String} representation of this {@link Map}.
     */
    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Map.toString(this, toStringFunctions);
    }

    /**
     * Get the {@link String} representation of the provided {@link Map}.
     */
    public static toString<TKey, TValue>(map: Map<TKey, TValue>, toStringFunctions?: ToStringFunctions): string
    {
        PreCondition.assertNotUndefinedAndNotNull(map, "iterable");

        if (!toStringFunctions)
        {
            toStringFunctions = ToStringFunctions.create();
        }
        return `{${join(",", map.map((entry: MapEntry<unknown, unknown>) => `${toStringFunctions.toString(entry.key)}:${toStringFunctions.toString(entry.value)}`))}}`;
    }

    public map<TOutput>(mapping: (value: MapEntry<TKey, TValue>) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Map.map(this, mapping);
    }

    public static map<TKey,TValue,TOutput>(map: Map<TKey,TValue>, mapping: (value: MapEntry<TKey,TValue>) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Iterable.map(map, mapping);
    }

    public where(condition: (value: MapEntry<TKey, TValue>) => (boolean | SyncResult<boolean>)): Iterable<MapEntry<TKey, TValue>>
    {
        return Map.where(this, condition);
    }

    public static where<TKey,TValue>(map: Map<TKey,TValue>, condition: (value: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): Iterable<MapEntry<TKey,TValue>>
    {
        return Iterable.where(map, condition);
    }

    public instanceOf<T extends MapEntry<TKey, TValue>>(typeOrTypeCheck: Type<T> | ((value: MapEntry<TKey, TValue>) => value is T)): Iterable<T>
    {
        return Map.instanceOf(this, typeOrTypeCheck);
    }

    public static instanceOf<TKey,TValue,T extends MapEntry<TKey, TValue>>(map: Map<TKey,TValue>, typeOrTypeCheck: Type<T> | ((value: MapEntry<TKey, TValue>) => value is T)): Iterable<T>
    {
        return Iterable.instanceOf(map, typeOrTypeCheck);
    }

    public [Symbol.iterator](): JavascriptIterator<MapEntry<TKey, TValue>>
    {
        return Map[Symbol.iterator](this);
    }

    public static [Symbol.iterator]<TKey,TValue>(map: Map<TKey,TValue>): JavascriptIterator<MapEntry<TKey,TValue>>
    {
        return Iterable[Symbol.iterator](map);
    }

    /**
     * Get the number of entries in this {@link Map}.
     */
    public getCount(): SyncResult<number>
    {
        return Map.getCount(this);
    }

    public static getCount<TKey,TValue>(map: Map<TKey,TValue>): SyncResult<number>
    {
        return Iterable.getCount(map);
    }

    public first(condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Map.first(this, condition);
    }

    public static first<TKey,TValue>(map: Map<TKey,TValue>, condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Iterable.first(map, condition);
    }

    public last(condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Map.last(this, condition);
    }

    public static last<TKey,TValue>(map: Map<TKey,TValue>, condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Iterable.last(map, condition);
    }

    /**
     * Get whether this {@link Map} contains the provided key.
     * @param key The key to look for.
     */
    public abstract containsKey(key: TKey): SyncResult<boolean>;

    /**
     * Get the value associated with the provided key.
     * @param key The key of the value to get.
     */
    public abstract get(key: TKey): SyncResult<TValue>;

    /**
     * Set the key/value association in this {@link Map}.
     * @param key The key associated with the value.
     * @param value The value associated with the key.
     */
    public abstract set(key: TKey, value: TValue): this;

    /**
     * Get the {@link TValue} associated with the provided {@link TKey}. If the provided
     * {@link TKey} doesn't exist in this {@link Map}, then invoke the provided {@link valueCreator}
     * and associate the returned {@link TValue} with the provided {@link TKey}. Then return the new
     * {@link TValue}.
     * @param key The {@link TKey} of the {@link TValue} to get.
     * @param valueCreator The {@link Function} that will be invoked if the {@link TKey} doesn't
     * exist in this {@link Map}.
     */
    public getOrSet(key: TKey, valueCreator: () => (TValue | SyncResult<TValue>)): SyncResult<TValue>
    {
        return Map.getOrSet(this, key, valueCreator);
    }

    /**
     * Get the {@link TValue} associated with the provided {@link TKey}. If the provided
     * {@link TKey} doesn't exist in the {@link Map}, then invoke the provided {@link valueCreator}
     * and associate the returned {@link TValue} with the provided {@link TKey}. Then return the new
     * {@link TValue}.
     * @param key The {@link TKey} of the {@link TValue} to get.
     * @param valueCreator The {@link Function} that will be invoked if the {@link TKey} doesn't
     * exist in this {@link Map}.
     */
    public static getOrSet<TKey, TValue>(map: Map<TKey, TValue>, key: TKey, valueCreator: () => (TValue | SyncResult<TValue>)): SyncResult<TValue>
    {
        PreCondition.assertNotUndefinedAndNotNull(map, "map");
        PreCondition.assertNotUndefinedAndNotNull(valueCreator, "valueCreator");

        return map.get(key)
            .catch(NotFoundError, () =>
            {
                const creatorResult: TValue | SyncResult<TValue> = valueCreator();
                const value: TValue = creatorResult instanceof SyncResult ? creatorResult.await() : creatorResult;
                map.set(key, value);
                return value;
            });
    }

    /**
     * Remove the provided {@link TKey} from this {@link Map}. If the {@link TKey} doesn't exist in
     * this {@link Map}, then return a {@link NotFoundError}. If the {@link TKey} does exist, then
     * return the {@link TValue} that was associated with it.
     * @param key The {@link TKey} to remove from this {@link Map}.
     */
    public abstract remove(key: TKey): SyncResult<TValue>;

    /**
     * Iterate over the keys in this {@link Map}.
     */
    public iterateKeys(): Iterator<TKey>
    {
        return Map.iterateKeys(this);
    }

    /**
     * Iterate over the keys in the {@link Map}.
     * @param map The map to iterate over.
     */
    public static iterateKeys<TKey, TValue>(map: Map<TKey, TValue>): Iterator<TKey>
    {
        PreCondition.assertNotUndefinedAndNotNull(map, "map");

        return map.iterate().map((entry: MapEntry<TKey, TValue>) => entry.key);
    }

    /**
     * Iterate over the values in this {@link Map}.
     */
    public iterateValues(): Iterator<TValue>
    {
        return Map.iterateValues(this);
    }

    /**
     * Iterate over the keys in the {@link Map}.
     * @param map The map to iterate over.
     */
    public static iterateValues<TKey, TValue>(map: Map<TKey, TValue>): Iterator<TValue>
    {
        PreCondition.assertNotUndefinedAndNotNull(map, "map");

        return map.iterate().map((entry: MapEntry<TKey, TValue>) => entry.value);
    }
}