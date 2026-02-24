import * as http from "http";

import { HttpOutgoingRequest } from "./httpOutgoingRequest";
import { HttpServer } from "./httpServer";
import { HttpIncomingRequest } from "./httpIncomingRequest";
import { HttpServerRequestHandler } from "./httpServerRequestHandler";
import { HttpOutgoingResponse } from "./httpOutgoingResponse";
import { List } from "./list";
import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { NodeJSHttpIncomingRequest } from "./nodeJSHttpIncomingRequest";
import { HttpHeaders } from "./httpHeaders";

/**
 * A {@link HttpServer} implementation that uses the Node.js HTTP module.
 */
export class NodeJSHttpServer extends HttpServer
{
    private httpServer: http.Server | undefined;
    private disposed: boolean;
    private readonly handlers: List<HttpServerRequestHandler>;
    private defaultHandler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Result<void>;

    private constructor()
    {
        super();

        this.disposed = false;
        this.handlers = List.create();
        this.defaultHandler = NodeJSHttpServer.defaultRequestHandler;
    }

    public static create(): NodeJSHttpServer
    {
        return new NodeJSHttpServer();
    }

    public static defaultRequestHandler(request: HttpIncomingRequest, response: HttpOutgoingResponse): Result<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");
        PreCondition.assertNotUndefinedAndNotNull(response, "response");

        return Result.create(() =>
        {
            response.setStatusCode(404);
            response.setContentTypeHeader("text/plain");
            response.setBody("Hello, world!");
        });
    }

    public setDefaultRequestHandler(handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Result<void>): void
    {
        throw new Error("Method not implemented.");
    }

    public dispose(): Result<boolean>
    {
        return Result.create(() =>
        {
            const result: boolean = !this.disposed;
            if (result)
            {
                this.disposed = true;
                if (this.httpServer)
                {
                    this.httpServer.close((err?: Error) =>
                    {
                        this.httpServer = undefined;
                        // Do something when the server is actually closed.
                    });
                }
            }
            return result;
        });
    }

    public isDisposed(): boolean
    {
        return this.disposed;
    }

    public addRequestHandler(requestPath: string, handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Result<void>): void
    {
        PreCondition.assertNotEmpty(requestPath, "requestPath");
        PreCondition.assertNotUndefinedAndNotNull(handler, "handler");

        const requestHandler: HttpServerRequestHandler = HttpServerRequestHandler.create(requestPath, handler);
        this.handlers.insert(0, requestHandler);
    }

    public run(portNumber: number): Result<void>
    {
        PreCondition.assertGreaterThanOrEqualTo(portNumber, 1, "portNumber");
        PreCondition.assertFalse(this.isDisposed(), "this.isDisposed()");

        return Result.create(() =>
        {
            this.httpServer = http.createServer((request: http.IncomingMessage, response: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }) =>
            {
                const httpRequest: HttpIncomingRequest = NodeJSHttpIncomingRequest.create(request);
                const httpResponse: HttpOutgoingResponse = HttpOutgoingResponse.create()
                    .setStatusCode(200)
                    .setHeader("Content-Type", "text/plain")
                    .setBody("Hello world!");

                const statusCode: number = httpResponse.getStatusCode();
                const headers: HttpHeaders = httpResponse.getHeaders();

                const responseHeaders: http.OutgoingHttpHeaders = {};
                for (const header of headers)
                {
                    responseHeaders[header.getName()] = header.getValue();
                }

                response.writeHead(statusCode, responseHeaders);
                response.end(httpResponse.getBody());

                this.dispose().await();
            });
            this.httpServer.listen(portNumber);
        });
    }
}