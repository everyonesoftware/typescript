import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { isFunction, isUndefinedOrNull, Type } from "./types";

/**
 * A {@link Result} type that contains values or errors that have already occurred.
 */
export class SyncResult<T> implements Result<T>
{
    private action: (() => void) | undefined;
    private value: T | undefined;
    private error: unknown | undefined;

    private constructor(action: (() => T))
    {
        PreCondition.assertNotUndefinedAndNotNull(action, "action");

        this.action = () =>
        {
            try
            {
                this.value = action();
            }
            catch (e)
            {
                this.error = e;
            }
            this.action = undefined;
        }
    }

    /**
     * Create a new {@link SyncResult} that contains the result of the provided function.
     * @param action The function to run.
     */
    public static create<T>(action: (() => T)): SyncResult<T>
    {
        return new SyncResult<T>(action);
    }

    /**
     * Create a new {@link SyncResult} that contains the provided value.
     * @param value The value to wrap in a {@link SyncResult}.
     */
    public static value<T>(value: T): SyncResult<T>
    {
        return SyncResult.create(() => value);
    }

    /**
     * Create a new {@link SyncResult} that contains the provided error.
     * @param error The error to wrap in a {@link SyncResult}.
     */
    public static error<T>(error: Error): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        return SyncResult.create<T>(() => { throw error; });
    }

    public await(): T
    {
        if (this.action)
        {
            this.action();
        }
        if (this.error)
        {
            throw this.error;
        }
        return this.value!;
    }

    public then<U>(thenFunction: (() => U) | ((argument: T) => U)): SyncResult<U>
    {
        PreCondition.assertNotUndefinedAndNotNull(thenFunction, "thenFunction");

        return SyncResult.create(() =>
        {
            const value: T = this.await();
            return thenFunction(value);
        });
    }

    public onValue(onValueFunction: (() => void) | ((argument: T) => void)): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(onValueFunction, "onValueFunction");

        return SyncResult.create(() =>
        {
            const value: T = this.await();
            onValueFunction(value);
            return value;
        });
    }

    public catch(catchFunction: (() => T) | ((error: unknown) => T)): SyncResult<T>;
    public catch<TError>(errorType: Type<TError>, catchFunction: (() => T) | ((error: TError) => T)): SyncResult<T>;
    catch<TError>(errorTypeOrCatchFunction: Type<TError> | (() => T) | ((error: unknown) => T), catchFunction?: (() => T) | ((error: TError) => T)): SyncResult<T>
    {
        let errorType: Type<TError> | undefined;
        if (isUndefinedOrNull(catchFunction))
        {
            errorType = undefined;
            catchFunction = errorTypeOrCatchFunction as (() => T) | ((error: unknown) => T);
        }
        else
        {
            errorType = errorTypeOrCatchFunction as Type<TError>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        PreCondition.assertNotUndefinedAndNotNull(catchFunction, "catchFunction");
        PreCondition.assertTrue(isFunction(catchFunction), "isFunction(catchFunction)");

        return SyncResult.create(() =>
        {
            let value: T;
            try
            {
                value = this.await();
            }
            catch (error)
            {
                 if (isUndefinedOrNull(errorType) || error instanceof errorType)
                 {
                    value = catchFunction(error as TError);
                 }
                 else
                 {
                    throw error;
                 }
            }
            return value;
        });
    }

    public onError(onErrorFunction: (() => void) | ((error: unknown) => void)): SyncResult<T>;
    public onError<TError>(errorType: Type<TError>, onErrorFunction: (() => void) | ((error: TError) => void)): SyncResult<T>;
    onError<TError>(errorTypeOrOnErrorFunction: Type<TError> | (() => void) | ((error: unknown) => void), onErrorFunction?: (() => void) | ((error: TError) => void)): SyncResult<T>
    {
        let errorType: Type<TError> | undefined;
        if (isUndefinedOrNull(onErrorFunction))
        {
            onErrorFunction = errorTypeOrOnErrorFunction as (() => void) | ((error: unknown) => void);
        }
        else
        {
            errorType = errorTypeOrOnErrorFunction;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        PreCondition.assertNotUndefinedAndNotNull(onErrorFunction, "onErrorFunction");
        PreCondition.assertTrue(isFunction(onErrorFunction), "isFunction(onErrorFunction)");

        return SyncResult.create(() =>
        {
            let value: T;
            try
            {
                value = this.await();
            }
            catch (error)
            {
                 if (isUndefinedOrNull(errorType) || error instanceof errorType)
                 {
                    onErrorFunction(error as TError);
                 }
                 throw error;
            }
            return value;
        });
    }

    public convertError(convertErrorFunction: (() => unknown) | ((error: unknown) => unknown)): SyncResult<T>;
    public convertError<TError>(errorType: Type<TError>, convertErrorFunction: (() => unknown) | ((error: TError) => unknown)): SyncResult<T>;
    convertError<TError>(errorTypeOrConvertErrorFunction: Type<TError> | (() => unknown) | ((error: unknown) => unknown), convertErrorFunction?: (() => unknown) | ((error: TError) => unknown)): SyncResult<T>
    {
        let errorType: Type<TError> | undefined;
        if (isUndefinedOrNull(convertErrorFunction))
        {
            convertErrorFunction = errorTypeOrConvertErrorFunction as (() => void) | ((error: unknown) => void);
        }
        else
        {
            errorType = errorTypeOrConvertErrorFunction;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        PreCondition.assertNotUndefinedAndNotNull(convertErrorFunction, "convertErrorFunction");
        PreCondition.assertTrue(isFunction(convertErrorFunction), "isFunction(convertErrorFunction)");

        return SyncResult.create(() =>
        {
            let value: T;
            try
            {
                value = this.await();
            }
            catch (error)
            {
                 if (isUndefinedOrNull(errorType) || error instanceof errorType)
                 {
                    error = convertErrorFunction(error as TError);
                 }
                 throw error;
            }
            return value;
        });
    }

    public toPromise(): PromiseLike<T>
    {
        return Result.toPromise(this);
    }
}
