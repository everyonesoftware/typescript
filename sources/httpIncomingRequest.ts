import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
import { Result2 } from "./result2";

/**
 * A HTTP request that is received by a {@link HttpServer}.
 */
export abstract class HttpIncomingRequest
{
    /**
     * Get the {@link HttpMethod} of the request.
     */
    public abstract getMethod(): HttpMethod;

    public abstract getHost(): Result2<string>;

    /**
     * Get the path component of the requested URL.
     */
    public abstract getURLPath(): string;

    public abstract getHeaders(): Result2<HttpHeaders>;

    public abstract getHeader(headerName: string): Result2<HttpHeader>;

    public abstract getHeaderValue(headerName: string): Result2<string>;

    public abstract getBody(): Result2<string>;
}