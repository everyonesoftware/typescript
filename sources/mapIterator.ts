import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { Type } from "./types";

/**
 * An {@link Iterator} that maps {@link TInput} values to {@link TOutput} values.
 */
export class MapIterator<TInput,TOutput> implements Iterator<TOutput>
{
    private readonly inputIterator: Iterator<TInput>;
    private readonly mapping: (value: TInput) => TOutput;
    private started: boolean;

    protected constructor(inputIterator: Iterator<TInput>, mapping: (value: TInput) => TOutput)
    {
        PreCondition.assertNotUndefinedAndNotNull(inputIterator, "inputIterator");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        this.inputIterator = inputIterator;
        this.mapping = mapping;
        this.started = false;
    }

    public static create<TInput,TOutput>(inputIterator: Iterator<TInput>, mapping: (value: TInput) => TOutput): MapIterator<TInput,TOutput>
    {
        return new MapIterator(inputIterator, mapping);
    }

    public next(): boolean
    {
        if (!this.hasStarted())
        {
            this.started = true;
            this.inputIterator.start();
        }
        else
        {
            this.inputIterator.next();
        }
        return this.inputIterator.hasCurrent();
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.inputIterator.hasCurrent();
    }

    public getCurrent(): TOutput
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.mapping(this.inputIterator.getCurrent());
    }

    public start(): this
    {
        return Iterator.start<TOutput,this>(this);
    }

    public takeCurrent(): TOutput
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

    public toArray(): TOutput[]
    {
        return Iterator.toArray(this);
    }

    public map<TOutput2>(mapping: (value: TOutput) => TOutput2): MapIterator<TOutput, TOutput2>
    {
        return Iterator.map(this, mapping);
    }

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<TOutput>
    {
        return Iterator[Symbol.iterator](this);
    }

    public first(condition?: (value: TOutput) => boolean): Result<TOutput>
    {
        return Iterator.first(this, condition);
    }

    public last(): Result<TOutput>
    {
        return Iterator.last(this);
    }

    public where(condition: (value: TOutput) => boolean): Iterator<TOutput>
    {
        return Iterator.where(this, condition);
    }

    public whereInstanceOf<U extends TOutput>(typeCheck: (value: TOutput) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends TOutput>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public take(maximumToTake: number): Iterator<TOutput>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<TOutput>
    {
        return Iterator.skip(this, maximumToSkip);
    }
}