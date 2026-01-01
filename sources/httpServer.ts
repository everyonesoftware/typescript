import { Disposable } from "./disposable";
import { Result } from "./result";

export abstract class HttpServer extends Disposable
{
    public addRequestHandler()
    /**
     * Get whether this {@link RealHttpServer} is listening for incoming connections.
     */
    public abstract isListening(): boolean

    /**
     * Start listening for incoming connections on the provided port number. The returned
     * {@link Result} will complete when the server is disposed.
     * @param portNumber The port number to start listening on.
     */
    public abstract listen(portNumber: number): Result<void>;
}