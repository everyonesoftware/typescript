import { CharacterWriteStream } from "./characterWriteStream";
import { CurrentProcess } from "./currentProcess";
import { HttpIncomingRequest } from "./httpIncomingRequest";
import { HttpOutgoingResponse } from "./httpOutgoingResponse";
import { HttpServer } from "./httpServer";
import { Network } from "./network";
import { Result } from "./result";

CurrentProcess.run(async (currentProcess: CurrentProcess) =>
{
    const output: CharacterWriteStream = currentProcess.getOutputWriteStream();
    output.writeLine("Hello world!").await();

    const network: Network = currentProcess.getNetwork();
    const server: HttpServer = network.createHttpServer();

    server.addRequestHandler("", (request: HttpIncomingRequest, response: HttpOutgoingResponse) =>
    {
        return Result.create(() =>
        {
            response.setStatusCode(200);
            response.setBody("Hello world!");
        });
    });

    server.run(10101).await();
});