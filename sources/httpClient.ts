import { FetchHttpClient } from "./fetchHttpClient";

/**
 * An object that can make HTTP network requests.
 */
export abstract class HttpClient
{
    public static create(): HttpClient
    {
        return FetchHttpClient.create();
    }
}