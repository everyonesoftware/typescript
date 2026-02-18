import { Disposable } from "./disposable";
import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { Result } from "./result";

/**
 * The response from a {@link HttpClient}'s sendRequest() method.
 */
export abstract class HttpIncomingResponse
{
    public abstract getStatusCode(): number;

    public abstract getHeaders(): Result<HttpHeaders>;

    public abstract getHeader(headerName: string): Result<HttpHeader>;

    public abstract getHeaderValue(headerName: string): Result<string>;

    public abstract getBody(): Result<string>;
}