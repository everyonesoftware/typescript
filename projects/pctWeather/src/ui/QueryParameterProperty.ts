import React from "react";
import { ensureReadonlyArray, hasProperty } from "./Utils";
import { Property } from "./Property";

/**
 * Parameters that can be passed to {@link Property.create()}.
 */
export interface QueryParameterPropertyCreateParameters
{
    /**
     * The value that the {@link QueryParameterProperty} will be initialized with if there is no
     * matching query parameter in the URL.
     */
    readonly initialValue?: string;
    /**
     * The function that will be used to create the React property. Defaults to
     * {@link React.useState()}.
     */
    readonly valueSetterCreator?: () => [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>];
    /**
     * The names of the query parameters that will be associated with the
     * {@link QueryParameterProperty}.
     */
    readonly queryParameterNames: string | ReadonlyArray<string>;

    /**
     * Whether the URL's query parameters should update automatically when this
     * {@link QueryParameterProperty} changes.
     */
    readonly autoUpdate?: boolean;
}

/**
 * Get whether the provided {@link value} is a {@link QueryParameterPropertyCreateParameters}
 * object.
 * @param value The value to check.
 */
export function isQueryParameterPropertyCreateParameters(value: unknown): value is QueryParameterPropertyCreateParameters
{
    return hasProperty(value, "queryParameterNames");
}

/**
 * A React value and setter combined into a single object.
 */
export class QueryParameterProperty implements Property<string | undefined>
{
    /**
     * The value of this {@link Property}.
     */
    public readonly value: string | undefined;
    /**
     * Get this {@link QueryParameterProperty}'s {@link value} as a number.
     */
    public get valueAsNumber(): number | undefined
    {
        let result: number | undefined;
        if (this.value !== undefined)
        {
            const resultNumber: number = parseFloat(this.value);
            if (!isNaN(resultNumber))
            {
                result = resultNumber;
            }
        }
        return result;
    }
    /**
     * The setter of this {@link Property}. Any changes made by this setter will not be reflected in
     * {@link value} until the next render.
     */
    public readonly set: React.Dispatch<React.SetStateAction<string | undefined>>
    /**
     * The query parameter names that will be associated with this {@link QueryParameterProperty}.
     */
    public readonly queryParameterNames: ReadonlyArray<string>;

    protected constructor(value: string | undefined, setter: React.Dispatch<React.SetStateAction<string | undefined>>, queryParameterNames: ReadonlyArray<string>)
    {
        this.value = value;
        this.set = setter;
        this.queryParameterNames = queryParameterNames;
    }

    /**
     * Create a new {@link QueryParameterProperty} using the provided
     * {@link QueryParameterPropertyCreateParameters}. This must be invoked within the context of a
     * React component.
     * @param queryParameterNames The query parameter names that are associated with this
     * {@link QueryParameterProperty}.
     * @param initialValue The initial value of this {@link QueryParameterProperty}.
     */
    public static create(queryParameterNames: string | ReadonlyArray<string>, initialValue?: string): QueryParameterProperty;
    /**
     * Create a new {@link QueryParameterProperty} using the provided
     * {@link QueryParameterPropertyCreateParameters}. This must be invoked within the context of a
     * React component.
     * @param parameters The parameters that define the {@link QueryParameterProperty}.
     */
    public static create(parameters: QueryParameterPropertyCreateParameters): QueryParameterProperty;
    static create(parametersOrQueryParameterNames: string | ReadonlyArray<string> | QueryParameterPropertyCreateParameters, initialValue?: string): QueryParameterProperty
    {
        let parameters: QueryParameterPropertyCreateParameters;
        if (isQueryParameterPropertyCreateParameters(parametersOrQueryParameterNames))
        {
            parameters = parametersOrQueryParameterNames;
        }
        else
        {
            parameters = {
                queryParameterNames: parametersOrQueryParameterNames,
                initialValue,
            };
        }

        const valueSetterCreator: (initialValue: string | undefined) => [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>] = parameters.valueSetterCreator ?? React.useState;

        const [value, set] = valueSetterCreator(parameters.initialValue);
        const queryParameterNames: ReadonlyArray<string> = ensureReadonlyArray(parameters.queryParameterNames);
        const result = new QueryParameterProperty(value, set, queryParameterNames);

        React.useEffect(() =>
        {
            result.updateBrowserURL();
        }, parameters.autoUpdate ? [value] : []);

        return result;
    }

    /**
     * Update the browser's URL query parameters based on this {@link QueryParameterProperty}'s
     * value.
     */
    public updateBrowserURL(): void
    {
        const browserURL: URL = QueryParameterProperty.getBrowserURL();
        const queryParameters: URLSearchParams = browserURL.searchParams;

        let changedQueryParameters: boolean = false;
        // console.log(`Updating ${JSON.stringify(this.queryParameterNames)} to ${JSON.stringify(this.value)}`);
        let foundQueryParameterName: boolean = false;
        for (const queryParameterName of this.queryParameterNames)
        {
            if (foundQueryParameterName)
            {
                // console.log(`Deleting query parameter ${JSON.stringify(queryParameterName)}`);
                queryParameters.delete(queryParameterName);
                changedQueryParameters = true;
            }
            else
            {
                const queryParameterValue: string | null = queryParameters.get(queryParameterName);
                if (queryParameterValue !== null)
                {
                    // console.log(`Found query parameter ${JSON.stringify(queryParameterName)}=${JSON.stringify(queryParameterValue)}`);
                    if (this.value !== queryParameterValue)
                    {
                        if (this.value === undefined)
                        {
                            // console.log(`Updating value to ${JSON.stringify(queryParameterValue)}`);
                            this.set(queryParameterValue);
                        }
                        else
                        {
                            // console.log(`Updating query parameter ${JSON.stringify(queryParameterName)} to ${JSON.stringify(this.value)}`);
                            queryParameters.set(queryParameterName, this.value);
                            changedQueryParameters = true;
                        }
                    }
                    foundQueryParameterName = true;
                }
            }
        }

        if (!foundQueryParameterName && this.value !== undefined)
        {
            queryParameters.set(this.queryParameterNames[0], this.value);
            changedQueryParameters = true;
        }

        if (changedQueryParameters)
        {
            QueryParameterProperty.updateBrowserURL(browserURL);
        }
    }

    private static getBrowserURL(): URL
    {
        return new URL(window.location.toString());
    }

    private static updateBrowserURL(url: string | URL): void
    {
        // This updates the URL without page reload
        window.history.replaceState({}, '', url);
    }
}
