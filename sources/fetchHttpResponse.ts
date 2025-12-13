import { HttpResponse } from "./httpResponse";
import { PreCondition } from "./preCondition";
import { Result } from "./result";

/**
 * An {@link HttpResponse} that comes from a {@link FetchHttpClient}.
 */
export class FetchHttpResponse implements HttpResponse
{
    private readonly response: Response;
    private disposed: boolean;

    private constructor(response: Response)
    {
        PreCondition.assertNotUndefinedAndNotNull(response, "response");

        this.response = response;
        this.disposed = false;
    }

    public static create(response: Response): FetchHttpResponse
    {
        return new FetchHttpResponse(response);
    }

    public dispose(): Result<boolean>
    {
        return Result.create(() =>
        {
            const result: boolean = !this.isDisposed();
            this.disposed = true;
            return result;
        });
    }

    public isDisposed(): boolean
    {
        return this.disposed;
    }

    public getStatusCode(): number
    {
        return this.response.status;
    }
}