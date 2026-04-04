import { JavascriptIterable } from "./javascript";
import { JavascriptArrayStack } from "./javascriptArrayStack";
import { Result } from "./result";

/**
 * A data structure that stores values in a last-in-last-out order.
 */
export abstract class Stack<T>
{
    /**
     * Create an instance of the default {@link Stack} implementation.
     * @returns A new {@link Stack} object.
     */
    public static create<T>(): JavascriptArrayStack<T>
    {
        return JavascriptArrayStack.create();
    }

    /**
     * Get whether there are any values in this {@link Stack}.
     */
    public abstract any(): Result<boolean>;

    /**
     * Push the provided value onto the top of this {@link Stack}.
     * @param value The value to push on the top of this {@link Stack}.
     */
    public abstract push(value: T): Result<void>;

    /**
     * Push the provided values onto the top of this {@link Stack}.
     * @param values The values to push onto this {@link Stack}.
     */
    public abstract pushAll(values: JavascriptIterable<T>): Result<void>;

    /**
     * Pop/remove the top value off of this {@link Stack}.
     */
    public abstract pop(): Result<T>;
}