import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { MutableHttpHeaders } from "./mutableHttpHeaders";
import { PreCondition } from "./preCondition";
import { SyncResult2 } from "./syncResult2";

/**
 * A HTTP response that is sent out by an {@link HttpServer}.
 */
export class HttpOutgoingResponse
{
    private statusCode: number;
    private readonly headers: MutableHttpHeaders;
    private body: string;

    private constructor()
    {
        this.statusCode = 200;
        this.headers = MutableHttpHeaders.create();
        this.body = "";
    }

    public static create(): HttpOutgoingResponse
    {
        return new HttpOutgoingResponse();
    }

    /**
     * Get the status code of this {@link HttpOutgoingResponse}.
     */
    public getStatusCode(): number
    {
        return this.statusCode;
    }

    /**
     * Set the status code of this {@link HttpOutgoingResponse}.
     * @param statusCode The status code of this {@link HttpOutgoingResponse}.
     */
    public setStatusCode(statusCode: number): this
    {
        PreCondition.assertBetween(100, statusCode, 599, "statusCode");

        this.statusCode = statusCode;

        return this;
    }

    public getHeaders(): HttpHeaders
    {
        return this.headers;
    }

    /**
     * Get the HTTP header with the provided name or return a {@link NotFoundError} if the header
     * doesn't exist.
     * @param headerName The name of the header to get.
     */
    public getHeader(headerName: string): SyncResult2<HttpHeader>
    {
        return this.headers.get(headerName);
    }

    /**
     * Get the value of the header with the provided name or return a {@link NotFoundError} if the
     * header doesn't exist.
     * @param headerName The name of the header value to get.
     */
    public getHeaderValue(headerName: string): SyncResult2<string>
    {
        return this.headers.getValue(headerName);
    }

    /**
     * Set the HTTP header in this {@link HttpOutgoingResponse}.
     * @param headerName The name of the HTTP header.
     * @param headerValue The value of the HTTP header.
     */
    public setHeader(headerName: string, headerValue: string): this
    {
        this.headers.set(headerName, headerValue);

        return this;
    }

    public setContentTypeHeader(contentType: string): this
    {
        this.headers.setContentType(contentType);

        return this;
    }

    /**
     * Get the body of this {@link HttpOutgoingResponse}.
     */
    public getBody(): string
    {
        return this.body;
    }

    /**
     * Set the body of this {@link HttpOutgoingResponse}.
     * @param body The body for this {@link HttpOutgoingResponse}.
     */
    public setBody(body: string): this
    {
        PreCondition.assertNotUndefinedAndNotNull(body, "body");

        this.body = body;

        return this;
    }
}