import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { isMap, Map, MapEntry } from "./map";
import { escapeAndQuote, join } from "./strings";
import { isArray, isIterable, isNumber, isObject, isString } from "./types";

/**
 * A collection of {@link ToStringFunction}s.
 */
export class ToStringFunctions
{
    private readonly functions: ((value: unknown) => (string | undefined))[];

    private constructor()
    {
        this.functions = [];
    }

    public static create(): ToStringFunctions
    {
        return new ToStringFunctions();
    }

    private defaultToString(value: unknown): string
    {
        let result: string;
        if (isMap(value))
        {
            result = this.mapToString(value);
        }
        else if (isIterable(value))
        {
            result = this.iterableToString(value);
        }
        else if (isNumber(value))
        {
            result = value.toString();
        }
        else if (value === undefined)
        {
            result = "undefined";
        }
        else if (value === null)
        {
            result = "null";
        }
        else if (isString(value))
        {
            result = escapeAndQuote(value);
        }
        else if (isArray(value))
        {
            result = `[${join(",", value.map(x => this.toString(x)))}]`;
        }
        else if (isObject(value))
        {
            result = `{${join(",", Object.entries(value).map(p => join(":", p.map(x => this.toString(x)))))}}`;
        }
        else
        {
            result = JSON.stringify(value);
        }
        return result;
    }

    /**
     * Get the {@link String} representation of the value with the registered
     * {@link ToStringFunction}s.
     * @param value The value to get the {@link String} representation of.
     */
    public toString(value: unknown): string
    {
        let result: string | undefined;
        for (const toStringFunction of this.functions)
        {
            result = toStringFunction(value);
            if (result !== undefined)
            {
                break;
            }
        }

        if (result === undefined)
        {
            result = this.defaultToString(value);
        }

        return result;
    }

    public add(toStringFunction: (value: unknown) => (string | undefined)): this;
    public add<T>(typeCheckFunction: (value: unknown) => value is T, typedToStringFunction: (value: T) => string): this;
    add<T>(typeCheckFunctionOrToStringFunction: ((value: unknown) => (string | undefined)) | ((value: unknown) => value is T), typedToStringFunction?: (value: T) => string): this
    {
        let toStringFunction: (value: unknown) => (string | undefined);
        if (typedToStringFunction)
        {
            const typeCheckFunction = typeCheckFunctionOrToStringFunction as (value: unknown) => value is T;
            toStringFunction = (value: unknown) =>
            {
                let result: string | undefined;
                if (typeCheckFunction(value))
                {
                    result = typedToStringFunction!(value);
                }
                return result;
            };
        }
        else
        {
            toStringFunction = typeCheckFunctionOrToStringFunction as (value: unknown) => (string | undefined);
        }

        this.functions.unshift(toStringFunction);

        return this;
    }

    private iterableToString(values: Iterable<unknown>): string
    {
        let result: string = "";
        result += "[";

        const iterator: Iterator<unknown> = values.iterate().start();
        if (iterator.hasCurrent())
        {
            result += this.toString(iterator.takeCurrent());
            while (iterator.hasCurrent())
            {
                result += ",";
                result += this.toString(iterator.takeCurrent());
            }
        }

        result += "]";
        return result;
    }

    private mapToString(values: Map<unknown,unknown>): string
    {
        let result = "";
        result += "{";

        const iterator: Iterator<MapEntry<unknown,unknown>> = values.iterate();
        if (iterator.next())
        {
            let entry: MapEntry<unknown,unknown> = iterator.getCurrent();
            result += `${this.toString(entry.key)}:${this.toString(entry.value)}`;
            while (iterator.next())
            {
                result += ",";

                entry = iterator.getCurrent();
                result += `${this.toString(entry.key)}:${this.toString(entry.value)}`;
            }
        }

        result += "}";
        return result;
    }
}