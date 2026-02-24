import { Disposable } from "./disposable";
import { PreCondition } from "./preCondition";
import { SyncResult2 } from "./syncResult2";

/**
 * A {@link Disposable} type that can be configured with a function that will be invoked when the
 * object is disposed.
 */
export class BasicDisposable implements Disposable
{
    private readonly disposedFunction: () => void;
    private disposed: boolean;

    protected constructor(disposedFunction: () => void)
    {
        PreCondition.assertNotUndefinedAndNotNull(disposedFunction, "disposedFunction");

        this.disposedFunction = disposedFunction;
        this.disposed = false;
    }

    /**
     * Create a new {@link Disposable} that will invoke the provided {@link Function} when it is
     * disposed.
     * @param disposedFunction The function to invoke when the returned {@link Disposable} is
     * disposed.
     */
    public static create(disposedFunction: () => void): Disposable
    {
        return new BasicDisposable(disposedFunction);
    }

    public dispose(): SyncResult2<boolean>
    {
        return SyncResult2.create(() =>
        {
            const result: boolean = !this.disposed;
            if (result)
            {
                try
                {
                    this.disposedFunction();
                }
                finally
                {
                    this.disposed = true;
                }
            }
            return result;
        });
    }

    public isDisposed(): boolean
    {
        return this.disposed;
    }
}