import { HttpIncomingRequest } from "./httpIncomingRequest";
import { HttpOutgoingResponse } from "./httpOutgoingResponse";
import { PreCondition } from "./preCondition";
import { Result } from "./result";

export class HttpServerRequestHandler
{
    private readonly path: string;
    private readonly handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Result<void>;

    private constructor(path: string, handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Result<void>)
    {
        PreCondition.assertNotEmpty(path, "path");
        PreCondition.assertNotUndefinedAndNotNull(handler, "handler");

        this.path = path;
        this.handler = handler;
    }

    public static create(path: string, handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Result<void>): HttpServerRequestHandler
    {
        return new HttpServerRequestHandler(path, handler);
    }

    public getPath(): string
    {
        return this.path;
    }

    /**
     * Get whether this {@link HttpServerRequestHandler} can handle the provided
     * {@link HttpIncomingRequest}.
     * @param request The {@link HttpIncomingRequest} to check.
     */
    public matchesRequest(request: HttpIncomingRequest): Result<boolean>
    {
        return Result.create(() =>
        {
            return request.getURLPath() === this.path;
        });
    }

    public getHandler(): (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Result<void>
    {
        return this.handler;
    }

    public run(request: HttpIncomingRequest, response: HttpOutgoingResponse): Result<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");
        PreCondition.assertNotUndefinedAndNotNull(response, "response");
        PreCondition.assertTrue(this.matchesRequest(request).await(), "this.matchesRequest(request).await()");

        return this.handler(request, response);
    }
}