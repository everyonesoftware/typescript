import { EqualFunctions } from "./equalFunctions";
import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { List } from "./list";
import { NotFoundError } from "./notFoundError";
import { PreCondition } from "./preCondition";
import { escapeAndQuote } from "./strings";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { isString, Type } from "./types";

export class MutableHttpHeaders implements HttpHeaders
{
    private readonly headers: List<HttpHeader>;

    private constructor(headers?: JavascriptIterable<HttpHeader>)
    {
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

    public get(headerName: string): SyncResult<HttpHeader>
    {
        PreCondition.assertNotEmpty(headerName, "headerName");

        return SyncResult.create(() =>
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

    public getValue(headerName: string): SyncResult<string>
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
        for (let insertIndex = 0; insertIndex < this.headers.getCount().await(); insertIndex++)
        {
            const header: HttpHeader = this.headers.get(insertIndex).await();
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

    public getContentType(): SyncResult<HttpHeader>
    {
        return this.get(HttpHeaders.contentTypeHeaderName);
    }

    public getContentTypeValue(): SyncResult<string>
    {
        return this.getValue(HttpHeaders.contentTypeHeaderName);
    }

    public getCount(): SyncResult<number>
    {
        return this.headers.getCount();
    }

    public toArray(): SyncResult<HttpHeader[]>
    {
        return HttpHeaders.toArray(this);
    }

    public any(): SyncResult<boolean>
    {
        return HttpHeaders.any(this);
    }

    public equals(right: JavascriptIterable<HttpHeader>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return HttpHeaders.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return HttpHeaders.toString(this, toStringFunctions);
    }

    public map<TOutput>(mapping: (value: HttpHeader) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return HttpHeaders.map(this, mapping);
    }

    public where(condition: (value: HttpHeader) => (boolean | SyncResult<boolean>)): Iterable<HttpHeader>
    {
        return HttpHeaders.where(this, condition);
    }

    public instanceOf<TOutput extends HttpHeader>(typeOrTypeCheck: Type<TOutput> | ((value: HttpHeader) => value is TOutput)): Iterable<TOutput>
    {
        return HttpHeaders.instanceOf(this, typeOrTypeCheck);
    }

    public first(condition?: (value: HttpHeader) => (boolean | SyncResult<boolean>)): SyncResult<HttpHeader>
    {
        return HttpHeaders.first(this, condition);
    }

    public last(condition?: (value: HttpHeader) => (boolean | SyncResult<boolean>)): SyncResult<HttpHeader>
    {
        return HttpHeaders.last(this, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<HttpHeader>
    {
        return HttpHeaders[Symbol.iterator](this);
    }
}