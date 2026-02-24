import { IndexableIterator } from "./indexableIterator";
import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";
import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { Type } from "./types";

/**
 * An {@link Iterator} that iterates over the characters in a {@link string}.
 */
export class StringIterator implements IndexableIterator<string>
{
    private readonly value: string;
    private currentIndex: number;
    private started: boolean;

    private constructor(value: string)
    {
        this.value = value;
        this.currentIndex = 0;
        this.started = false;
    }

    public static create(value: string): StringIterator
    {
        PreCondition.assertNotUndefinedAndNotNull(value, "value");

        return new StringIterator(value);
    }

    public getCurrentIndex(): number
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.currentIndex;
    }

    public next(): boolean
    {
        if (!this.hasStarted())
        {
            this.started = true;
        }
        else if (this.hasCurrent())
        {
            this.currentIndex++;
        }
        return this.hasCurrent();
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.currentIndex < this.value.length;
    }

    public getCurrent(): string
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.value[this.currentIndex];
    }

    public start(): this
    {
        return Iterator.start<string, this>(this);
    }

    public takeCurrent(): string
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

    public toArray(): string[]
    {
        return Iterator.toArray(this);
    }

    public map<TOutput>(mapping: (value: string) => TOutput): MapIterator<string, TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public first(): Result<string>
    {
        return Iterator.first(this);
    }

    public last(): Result<string>
    {
        return Iterator.last(this);
    }

    public where(condition: (value: string) => boolean): Iterator<string>
    {
        return Iterator.where(this, condition);
    }

    public whereInstanceOf<U extends string>(typeCheck: (value: string) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends string>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public take(maximumToTake: number): Iterator<string>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<string>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<string>
    {
        return Iterator[Symbol.iterator](this);
    }
}