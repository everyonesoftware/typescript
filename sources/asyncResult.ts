import { PreCondition } from "./preCondition";

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

    public catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): AsyncResult<T | TResult>
    {
        return AsyncResult.create(this.promise.catch(onrejected));
    }

    public finally(onfinally?: (() => void) | null | undefined): AsyncResult<T>
    {
        return AsyncResult.create(this.promise.finally(onfinally));
    }
    
    readonly [Symbol.toStringTag]: string = "AsyncResult";
}