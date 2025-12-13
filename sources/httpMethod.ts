

export enum HttpMethod
{
    /**
     * The GET method requests a representation of the specified resource. Requests using GET should
     * only retrieve data and should not contain a request content.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET
     */
    GET,
    /**
     * The HEAD method asks for a response identical to a GET request, but without a response body.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/HEAD
     */
    HEAD,
    /**
     * The POST method submits an entity to the specified resource, often causing a change in state
     * or side effects on the server.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST
     */
    POST,
    /**
     * The PUT method replaces all current representations of the target resource with the request
     * content.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT
     */
    PUT,
    /**
     * The DELETE method deletes the specified resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/DELETE
     */
    DELETE,
    /**
     * The CONNECT method establishes a tunnel to the server identified by the target resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/CONNECT
     */
    CONNECT,
    /**
     * The OPTIONS method describes the communication options for the target resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/OPTIONS
     */
    OPTIONS,
    /**
     * The TRACE method performs a message loop-back test along the path to the target resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/TRACE
     */
    TRACE,
    /**
     * The PATCH method applies partial modifications to a resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH
     */
    PATCH,
}