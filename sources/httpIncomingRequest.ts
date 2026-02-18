import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
import { Result } from "./result";

/**
 * A HTTP request that is received by a {@link HttpServer}.
 */
export abstract class HttpIncomingRequest
{
    /**
     * Get the {@link HttpMethod} of the request.
     */
    public abstract getMethod(): HttpMethod;

    public abstract getHost(): Result<string>;

    /**
     * Get the path component of the requested URL.
     */
    public abstract getURLPath(): string;

    public abstract getHeaders(): Result<HttpHeaders>;

    public abstract getHeader(headerName: string): Result<HttpHeader>;

    public abstract getHeaderValue(headerName: string): Result<string>;

    public abstract getBody(): Result<string>;
}