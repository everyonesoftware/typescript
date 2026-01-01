import { HttpServer } from "./httpServer";

/**
 * An object that provides access to the network.
 */
export abstract class Network
{
    /**
     * Create a new {@link HttpServer} that is connected to this {@link Network}.
     */
    public abstract createHttpServer(): HttpServer;
}