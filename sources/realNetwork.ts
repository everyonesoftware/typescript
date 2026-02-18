import { HttpServer } from "./httpServer";
import { Network } from "./network";
import { NodeJSHttpServer } from "./nodeJSHttpServer";

export class RealNetwork extends Network
{
    private constructor()
    {
        super();
    }

    public static create(): RealNetwork
    {
        return new RealNetwork();
    }

    public createHttpServer(): HttpServer
    {
        return NodeJSHttpServer.create();
    }
}