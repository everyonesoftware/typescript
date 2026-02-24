import { PreCondition } from "./preCondition";
import { instanceOfType, isUndefinedOrNull, Type } from "./types";

export class AsyncResult<T> implements Promise<T>
{
    private readonly promise: Promise<T>;

    private constructor(promise: Promise<T>)
    {
        PreCondition.assertNotUndefinedAndNotNull(promise, "promise");

        this.promise = promise;
    }

    public static create<T>(promise: Promise<T>): AsyncResult<T>
    {
        return new AsyncResult(promise);
    }

    public static value<T>(value: T): AsyncResult<T>
    {
        return AsyncResult.create(Promise.resolve(value));
    }

    public static error<T>(error: unknown): AsyncResult<T>
    {
        return AsyncResult.create(Promise.reject(error));
    }

    public static yield(): AsyncResult<void>
    {
        return AsyncResult.create(Promise.resolve());
    }

    public then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): AsyncResult<TResult1 | TResult2>
    {
        return AsyncResult.create(this.promise.then(onfulfilled, onrejected));
    }

    public onValue(onValueFunction: (value: T) => (void | Promise<void>)): AsyncResult<T>
    {
        return this.then<T>(async (value: T) =>
        {
            let result: AsyncResult<T>;
            try
            {
                await onValueFunction(value);
                result = this;
            }
            catch (error)
            {
                result = AsyncResult.error(error);
            }
            return result;
        })
    }

    public catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null): AsyncResult<T | TResult>
    public catch<TError,TResult = never>(errorType: Type<TError>, onrejected: (reason: TError) => (TResult | PromiseLike<TResult>)): AsyncResult<T | TResult>
    catch<TResult = never>(errorTypeOrOnRejected?: Type<Error> | ((reason: unknown) => TResult | PromiseLike<TResult>) | null, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null): AsyncResult<T | TResult>
    {
        let errorType: Type<Error> | undefined;
        if (!isUndefinedOrNull(onrejected))
        {
            errorType = errorTypeOrOnRejected as Type<unknown>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        else
        {
            onrejected = errorTypeOrOnRejected as ((reason: any) => TResult | PromiseLike<TResult>) | null;
        }

        return AsyncResult.create<T | TResult>(this.promise.catch((reason: unknown) =>
        {
            let value: TResult | PromiseLike<TResult> | undefined;
            if (errorType && !instanceOfType(reason, errorType))
            {
                throw reason;
            }
            else if (!isUndefinedOrNull(onrejected))
            {
                value = onrejected(reason);
            }
            return value!;
        }));
    }

    public onError(onErrorFunction: (reason: unknown) => (void | PromiseLike<void>)): AsyncResult<T>;
    public onError<TError>(errorType: Type<TError>, onErrorFunction: (reason: TError) => (void | PromiseLike<void>)): AsyncResult<T>;
    onError(errorTypeOrOnErrorFunction: Type<unknown> | ((reason: unknown) => (void | PromiseLike<void>)), onErrorFunction?: (reason: unknown) => (void | PromiseLike<void>)): AsyncResult<T>
    {
        let errorType: Type<unknown> | undefined;
        if (!isUndefinedOrNull(onErrorFunction))
        {
            errorType = errorTypeOrOnErrorFunction as Type<unknown>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        else
        {
            onErrorFunction = errorTypeOrOnErrorFunction as ((reason: unknown) => void | PromiseLike<void>);
        }
        PreCondition.assertNotUndefinedAndNotNull(onErrorFunction, "onErrorFunction");

        let result: AsyncResult<T>;
        if (errorType)
        {
            result = this.catch(errorType, async (reason: unknown) =>
            {
                await onErrorFunction(reason);
                throw reason;
            });
        }
        else
        {
            result = this.catch(async (reason: unknown) =>
            {
                await onErrorFunction(reason);
                throw reason;
            });
        }

        return result;
    }

    public convertError(convertErrorFunction: (reason: unknown) => (unknown | PromiseLike<unknown>)): AsyncResult<T>;
    public convertError<TError>(errorType: Type<TError>, convertErrorFunction: (reason: TError) => (unknown | PromiseLike<unknown>)): AsyncResult<T>;
    convertError(errorTypeOrConvertErrorFunction: Type<unknown> | ((reason: unknown) => (unknown | PromiseLike<unknown>)), convertErrorFunction?: (reason: unknown) => (unknown | PromiseLike<unknown>)): AsyncResult<T>
    {
        let errorType: Type<unknown> | undefined;
        if (!isUndefinedOrNull(convertErrorFunction))
        {
            errorType = errorTypeOrConvertErrorFunction as Type<unknown>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        else
        {
            convertErrorFunction = errorTypeOrConvertErrorFunction as ((reason: unknown) => void | PromiseLike<void>);
        }
        PreCondition.assertNotUndefinedAndNotNull(convertErrorFunction, "convertErrorFunction");

        let result: AsyncResult<T>;
        if (errorType)
        {
            result = this.catch(errorType, async (reason: unknown) =>
            {
                throw await convertErrorFunction(reason);
            });
        }
        else
        {
            result = this.catch(async (reason: unknown) =>
            {
                throw await convertErrorFunction(reason);
            });
        }

        return result;
    }

    public finally(onfinally?: (() => void) | null | undefined): AsyncResult<T>
    {
        return AsyncResult.create(this.promise.finally(onfinally));
    }
    
    readonly [Symbol.toStringTag]: string = "AsyncResult";
}