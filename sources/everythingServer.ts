import { CharacterWriteStream } from "./characterWriteStream";
import { CurrentProcess } from "./currentProcess";
import { HttpClient } from "./httpClient";
import { HttpIncomingRequest } from "./httpIncomingRequest";
import { HttpIncomingResponse } from "./httpIncomingResponse";
import { HttpOutgoingResponse } from "./httpOutgoingResponse";
import { HttpServer } from "./httpServer";
import { Network } from "./network";
import { Result } from "./result";

CurrentProcess.run(async (currentProcess: CurrentProcess) =>
{
    const output: CharacterWriteStream = currentProcess.getOutputWriteStream();
    await output.writeLine("Hello world!");

    const network: Network = currentProcess.getNetwork();

    const client: HttpClient = network.createHttpClient();
    const response: HttpIncomingResponse = await client.sendGetRequest("https://www.example.com");
    output.writeLine(response.getStatusCode().toString()).await();

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