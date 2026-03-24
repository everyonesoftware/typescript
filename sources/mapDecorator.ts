import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { Map, MapEntry } from "./map";
import { PreCondition } from "./preCondition";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { Type } from "./types";

/**
 * A {@link Map} decorator type that wraps around another {@link Map}.
 */
export abstract class MapDecorator<TKey,TValue> extends Map<TKey,TValue>
{
    private readonly innerMap: Map<TKey,TValue>;

    protected constructor(innerMap: Map<TKey,TValue>)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerMap, "innerMap");

        super();

        this.innerMap = innerMap;
    }

    public any(): SyncResult<boolean>
    {
        return this.innerMap.any();
    }

    public getCount(): SyncResult<number>
    {
        return this.innerMap.getCount();
    }

    public containsKey(key: TKey): SyncResult<boolean>
    {
        return this.innerMap.containsKey(key);
    }

    public get(key: TKey): SyncResult<TValue>
    {
        return this.innerMap.get(key);
    }

    public set(key: TKey, value: TValue): this
    {
        this.innerMap.set(key, value);
        return this;
    }

    public getOrSet(key: TKey, valueCreator: () => (TValue | SyncResult<TValue>)): SyncResult<TValue>
    {
        return this.innerMap.getOrSet(key, valueCreator);
    }

    public remove(key: TKey): SyncResult<TValue>
    {
        return this.innerMap.remove(key);
    }

    public iterate(): Iterator<MapEntry<TKey,TValue>>
    {
        return this.innerMap.iterate();
    }

    public iterateKeys(): Iterator<TKey>
    {
        return this.innerMap.iterateKeys();
    }

    public iterateValues(): Iterator<TValue>
    {
        return this.innerMap.iterateValues();
    }
}