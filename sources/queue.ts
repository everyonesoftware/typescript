import { EqualFunctions } from "./equalFunctions";
import { JavascriptIterable } from "./javascript";
import { ListQueue } from "./listQueue";
import { ListStack } from "./listStack";
import { Result } from "./result";

/**
 * A data structure that stores values in a first-in-first-out order.
 */
export abstract class Queue<T>
{
    /**
     * Create an instance of the default {@link Queue} implementation.
     * @returns A new {@link Queue} object.
     */
    public static create<T>(): ListQueue<T>
    {
        return ListQueue.create();
    }

    /**
     * Get whether there are any values in this {@link Stack}.
     */
    public abstract any(): Result<boolean>;

    /**
     * Add the provided value onto the end of this {@link Queue}.
     * @param value The value to add to the end of this {@link Queue}.
     */
    public abstract add(value: T): Result<void>;

    /**
     * Add the provided values to the end of this {@link Queue}.
     * @param values The values to add to the end of this {@link Queue}.
     */
    public abstract addAll(values: JavascriptIterable<T>): Result<void>;

    /**
     * Remove the next value off of this {@link Queue}.
     */
    public abstract remove(): Result<T>;

    /**
     * Get whether this {@link Stack} contains the provided value.
     * @param value The value to look for.
     * @param equalFunctions The functions to use to compare values.
     */
    public abstract contains(value: T, equalFunctions?: EqualFunctions): Result<boolean>;
}