import { HttpServer } from "./httpServer";
import { Network } from "./network";
import { RealHttpServer } from "./realHttpServer";

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
        return RealHttpServer.create();
    }
}