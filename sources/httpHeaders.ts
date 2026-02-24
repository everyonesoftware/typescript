import { EqualFunctions } from "./equalFunctions";
import { HttpHeader } from "./httpHeader";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { MutableHttpHeaders } from "./mutableHttpHeaders";
import { Result } from "./result";
import { ToStringFunctions } from "./toStringFunctions";
import { Type } from "./types";

/**
 * A collection of {@link HttpHeader}s.
 */
export abstract class HttpHeaders implements Iterable<HttpHeader>
{
    public static readonly contentTypeHeaderName: string = "Content-Type";

    public static create(headers?: JavascriptIterable<HttpHeader>): MutableHttpHeaders
    {
        return MutableHttpHeaders.create(headers);
    }

    /**
     * Get the header with the provided name.
     * @param headerName The name of the header.
     */
    public abstract get(headerName: string): Result<HttpHeader>;

    /**
     * Get the value of the header with the provided name.
     * @param headerName The name of the header.
     */
    public abstract getValue(headerName: string): Result<string>;

    public getContentType(): Result<HttpHeader>
    {
        return HttpHeaders.getContentType(this);
    }

    public static getContentType(headers: HttpHeaders): Result<HttpHeader>
    {
        return headers.get(HttpHeaders.contentTypeHeaderName);
    }

    public getContentTypeValue(): Result<string>
    {
        return HttpHeaders.getContentTypeValue(this);
    }

    public static getContentTypeValue(headers: HttpHeaders): Result<string>
    {
        return headers.getValue(HttpHeaders.contentTypeHeaderName);
    }

    /**
     * Get an {@link Iterator} that can be used to iterate through the {@link HttpHeader}s in this
     * collection.
     */
    public abstract iterate(): Iterator<HttpHeader>;

    /**
     * Get the {@link HttpHeader}s in this {@link HttpHeaders} object as an array.
     */
    public toArray(): HttpHeader[]
    {
        return Iterable.toArray(this);
    }

    public any(): boolean
    {
        return Iterable.any(this);
    }

    public getCount(): number
    {
        return Iterable.getCount(this);
    }

    public equals(right: JavascriptIterable<HttpHeader>, equalFunctions?: EqualFunctions): boolean
    {
        return Iterable.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Iterable.toString(this, toStringFunctions);
    }

    public map<TOutput>(mapping: (value: HttpHeader) => TOutput): MapIterable<HttpHeader, TOutput>
    {
        return Iterable.map(this, mapping);
    }

    public where(condition: (value: HttpHeader) => boolean): Iterable<HttpHeader>
    {
        return Iterable.where(this, condition);
    }

    public instanceOf<TOutput extends HttpHeader>(typeOrTypeCheck: Type<TOutput> | ((value: HttpHeader) => value is TOutput)): Iterable<TOutput>
    {
        return Iterable.instanceOf(this, typeOrTypeCheck);
    }

    public first(): Result<HttpHeader>
    {
        return Iterable.first(this);
    }

    public last(): Result<HttpHeader>
    {
        return Iterable.last(this);
    }

    public [Symbol.iterator](): JavascriptIterator<HttpHeader>
    {
        return Iterable[Symbol.iterator](this);
    }
}