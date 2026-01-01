import { HttpMethod } from "./httpMethod";
import { MutableHttpRequest } from "./mutableHttpRequest";

export abstract class HttpRequest
{
    public static create(method: HttpMethod, url: string): MutableHttpRequest
    {
        return MutableHttpRequest.create(method, url);
    }

    public static get(url: string): MutableHttpRequest
    {
        return HttpRequest.create(HttpMethod.GET, url);
    }

    public abstract getMethod(): HttpMethod;

    public abstract getURL(): string;
}