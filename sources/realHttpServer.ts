import * as http from "http";

import { HttpServer } from "./httpServer";
import { PreCondition } from "./preCondition";
import { Result } from "./result";

export class RealHttpServer extends HttpServer
{
    private httpServer: http.Server | undefined;
    private disposed: boolean;

    private constructor()
    {
        super();

        this.disposed = false;
    }

    public static create(): RealHttpServer
    {
        return new RealHttpServer();
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

    public isListening(): boolean
    {
        return !!this.httpServer;
    }

    public listen(portNumber: number): Result<void>
    {
        PreCondition.assertGreaterThanOrEqualTo(portNumber, 1, "portNumber");
        PreCondition.assertFalse(this.isDisposed(), "this.isDisposed()");
        PreCondition.assertFalse(this.isListening(), "this.isListening()");

        return Result.create(() =>
        {
            this.httpServer = http.createServer((request, response) =>
            {
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end('Hello, world!');
                this.dispose().await();
            });
            this.httpServer.listen(portNumber);
        });
        
        throw new Error("Method not implemented.");
    }
}