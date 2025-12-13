import { Disposable } from "./disposable";
import { Result } from "./result";

/**
 * The response from a HttpClient's sendRequest() method.
 */
export abstract class HttpResponse implements Disposable
{
    public abstract dispose(): Result<boolean>;

    public abstract isDisposed(): boolean;

    public abstract getStatusCode(): number;
}