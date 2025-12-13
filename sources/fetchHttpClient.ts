import { FetchHttpResponse } from "./fetchHttpResponse";
import { HttpClient } from "./httpClient";
import { HttpMethod } from "./httpMethod";
import { HttpRequest } from "./httpRequest";
import { PostCondition } from "./postCondition";
import { PreCondition } from "./preCondition";

/**
 * A {@link HttpClient} that uses {@link fetch}() to make network requests.
 */
export class FetchHttpClient extends HttpClient
{
    protected constructor()
    {
        super();
    }

    public static create(): FetchHttpClient
    {
        return new FetchHttpClient();
    }

    public async sendRequest(request: HttpRequest): Promise<FetchHttpResponse>
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");

        const requestInit: RequestInit = {
            method: FetchHttpClient.convertMethod(request.getMethod()),
        };
        const fetchResponse: Response = await fetch(request.getURL(), requestInit);
        const result: FetchHttpResponse = FetchHttpResponse.create(fetchResponse);

        PostCondition.assertNotUndefinedAndNotNull(result, "result");

        return result;
    }

    public static convertMethod(method: HttpMethod): string
    {
        PreCondition.assertNotUndefinedAndNotNull(method, "method");

        let result: string;
        switch (method)
        {
            case HttpMethod.CONNECT:
                result = "CONNECT";
                break;
            case HttpMethod.DELETE:
                result = "DELETE";
                break;
            case HttpMethod.GET:
                result = "GET";
                break;
            case HttpMethod.HEAD:
                result = "HEAD";
                break;
            case HttpMethod.OPTIONS:
                result = "OPTIONS";
                break;
            case HttpMethod.PATCH:
                result = "PATCH";
                break;
            case HttpMethod.POST:
                result = "POST";
                break;
            case HttpMethod.PUT:
                result = "PUT";
                break;
            case HttpMethod.TRACE:
                result = "TRACE";
                break;
        }

        PostCondition.assertNotEmpty(result, "result");

        return result;
    }
}