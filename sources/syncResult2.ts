import { NotFoundError } from "./notFoundError";
import { PreCondition } from "./preCondition";
import { AsyncResult } from "./asyncResult";
import { isPromise } from "./types";

export class SyncResult2<T> implements Promise<T>
{
    private value: T | undefined;
    private error: unknown | undefined;

    private constructor(value: T | undefined, error: unknown | undefined)
    {
        PreCondition.assertTrue(value === undefined || error === undefined, "value === undefined || error === undefined", "Either value or error must be undefined.");

        this.value = value;
        this.error = error;
    }

    public static create<T>(action: () => T): SyncResult2<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(action, "action");

        let value: T | undefined;
        let error: unknown | undefined;
        try
        {
            value = action();
        }
        catch (e)
        {
            error = e;
        }
        return new SyncResult2(value, error);
    }

    public static value<T>(value: T): SyncResult2<T>
    {
        return new SyncResult2(value, undefined);
    }

    public static error<T>(error: unknown): SyncResult2<T>
    {
        return new SyncResult2<T>(undefined, error);
    }

    public await(): T
    {
        if (this.error)
        {
            throw this.error;
        }
        return this.value!;
    }

    public then<TResult1 = T, TResult2 = never>(onfullfilled?: ((value: T) => TResult1) | null, onrejected?: ((reason: unknown) => TResult2) | null): SyncResult2<TResult1 | TResult2>;
    public then<TResult1 = T, TResult2 = never>(onfullfilled?: ((value: T) => (TResult1 | PromiseLike<TResult1>)) | null, onrejected?: ((reason: unknown) => (TResult2 | PromiseLike<TResult2>)) | null): SyncResult2<TResult1 | TResult2>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => (TResult1 | PromiseLike<TResult1>)) | null, onrejected?: ((reason: unknown) => (TResult2 | PromiseLike<TResult2>)) | null): SyncResult2<TResult1 | TResult2> | AsyncResult<TResult1 | TResult2>
    {
        let result: SyncResult2<TResult1 | TResult2> | AsyncResult<TResult1 | TResult2>;
        if (this.error)
        {
            if (onrejected)
            {
                try
                {
                    const onRejectedResult: TResult2 | PromiseLike<TResult2> = onrejected(this.error);
                    if (onRejectedResult instanceof SyncResult2)
                    {
                        result = onRejectedResult;
                    }
                    else if (isPromise<TResult2>(onRejectedResult))
                    {
                        result = AsyncResult.create(onRejectedResult);
                    }
                    else
                    {
                        result = SyncResult2.value(onRejectedResult as TResult2);
                    }
                }
                catch (error)
                {
                    result = SyncResult2.error(error);
                }
            }
            else
            {
                result = SyncResult2.error<TResult2>(this.error);
            }
        }
        else
        {
            if (onfulfilled)
            {
                try
                {
                    const onFullfilledResult: TResult1 | PromiseLike<TResult1> = onfulfilled(this.value!);
                    if (onFullfilledResult instanceof SyncResult2)
                    {
                        result = onFullfilledResult;
                    }
                    else if (isPromise<TResult1>(onFullfilledResult))
                    {
                        result = AsyncResult.create(onFullfilledResult);
                    }
                    else
                    {
                        result = SyncResult2.value(onFullfilledResult as TResult1);
                    }
                }
                catch (error)
                {
                    result = SyncResult2.error(error);
                }
            }
            else
            {
                result = SyncResult2.value<TResult1>(this.value as TResult1);
            }
        }
        return result;
    }

    public catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): SyncResult2<T | TResult>
    {
        throw new NotFoundError("catch() Not Implemented");
    }

    public finally(onfinally?: (() => void) | null | undefined): SyncResult2<T>
    {
        throw new NotFoundError("finally() Not Implemented");
    }

    readonly [Symbol.toStringTag]: string = "SyncResult2";
}