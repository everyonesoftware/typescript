import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { Iterator } from "./iterator";
import { JavascriptIterable } from "./javascript";
import { List } from "./list";
import { NotFoundError } from "./notFoundError";
import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { escapeAndQuote } from "./strings";
import { isString } from "./types";

export class MutableHttpHeaders extends HttpHeaders
{
    private readonly headers: List<HttpHeader>;

    private constructor(headers?: JavascriptIterable<HttpHeader>)
    {
        super();

        this.headers = List.create();
        if (headers)
        {
            this.setAll(headers);
        }
    }

    public static create(headers?: JavascriptIterable<HttpHeader>): MutableHttpHeaders
    {
        return new MutableHttpHeaders(headers);
    }

    public iterate(): Iterator<HttpHeader>
    {
        return this.headers.iterate();
    }

    public get(headerName: string): Result<HttpHeader>
    {
        PreCondition.assertNotEmpty(headerName, "headerName");

        return Result.create(() =>
        {
            let result: HttpHeader | undefined;

            const lowerHeaderName: string = headerName.toLowerCase();
            for (const header of this.headers)
            {
                if (header.getName().toLowerCase() === lowerHeaderName)
                {
                    result = header
                    break;
                }
            }
            if (result === undefined)
            {
                throw new NotFoundError(`No HttpHeader found with the name ${escapeAndQuote(headerName)}.`);
            }

            return result;
        });
    }

    public getValue(headerName: string): Result<string>
    {
        return this.get(headerName)
            .then((header: HttpHeader) => header.getValue());
    }

    /**
     * Set a {@link HttpHeader} value in this collection. This will overwrite any existing 
     * {@link HttpHeader} with the same name.
     * @param headerName The name of the header to set.
     * @param headerValue The value of the header to set.
     */
    public set(headerName: string, headerValue: string): this;
    public set(header: HttpHeader): this;
    set(headerOrHeaderName: HttpHeader | string, headerValue?: string): this
    {
        let headerName: string;
        if (isString(headerOrHeaderName))
        {
            headerName = headerOrHeaderName;
        }
        else
        {
            headerName = headerOrHeaderName.getName();
            headerValue = headerOrHeaderName.getValue();
        }
        PreCondition.assertNotEmpty(headerName, "headerName");
        PreCondition.assertNotUndefinedAndNotNull(headerValue, "headerValue");

        let insertIndex: number = 0;
        for (let insertIndex = 0; insertIndex < this.headers.getCount(); insertIndex++)
        {
            const header: HttpHeader = this.headers.get(insertIndex);
            if (header.getName() === headerName)
            {
                this.headers.removeAt(insertIndex);
                break;
            }
        }
        this.headers.insert(insertIndex, HttpHeader.create(headerName, headerValue));

        return this;
    }

    public setAll(headers: JavascriptIterable<HttpHeader>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(headers, "headers");

        for (const header of headers)
        {
            this.set(header);
        }

        return this;
    }

    public setContentType(contentType: string): this
    {
        return this.set(HttpHeaders.contentTypeHeaderName, contentType);
    }
}