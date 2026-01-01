import { HttpMethod } from "./httpMethod";
import { HttpRequest } from "./httpRequest";
import { PreCondition } from "./preCondition";

export class MutableHttpRequest extends HttpRequest
{
    private readonly method: HttpMethod;
    private readonly url: string;

    private constructor(method: HttpMethod, url: string)
    {
        PreCondition.assertNotUndefinedAndNotNull(method, "method");
        PreCondition.assertNotEmpty(url, "url");

        super();

        this.method = method;
        this.url = url;
    }

    public static create(method: HttpMethod, url: string): MutableHttpRequest
    {
        return new MutableHttpRequest(method, url);
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