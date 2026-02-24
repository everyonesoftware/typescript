import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { Result2 } from "./result2";

/**
 * The response from a {@link HttpClient}'s sendRequest() method.
 */
export abstract class HttpIncomingResponse
{
    public abstract getStatusCode(): number;

    public abstract getHeaders(): Result2<HttpHeaders>;

    public abstract getHeader(headerName: string): Result2<HttpHeader>;

    public abstract getHeaderValue(headerName: string): Result2<string>;

    public abstract getBody(): Result2<string>;
}