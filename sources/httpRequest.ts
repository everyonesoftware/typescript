import { HttpMethod } from "./httpMethod";
import { PreCondition } from "./preCondition";

export class HttpRequest
{
    private readonly method: HttpMethod;
    private readonly url: string;

    private constructor(method: HttpMethod, url: string)
    {
        PreCondition.assertNotUndefinedAndNotNull(method, "method");
        PreCondition.assertNotEmpty(url, "url");

        this.method = method;
        this.url = url;
    }

    public static create(method: HttpMethod, url: string): HttpRequest
    {
        return new HttpRequest(method, url);
    }

    public static get(url: string): HttpRequest
    {
        return HttpRequest.create(HttpMethod.GET, url);
    }

    public getMethod(): HttpMethod
    {
        return this.method;
    }

    public getURL(): string
    {
        return this.url;
    }
}