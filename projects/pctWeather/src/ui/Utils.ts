import type { Direction } from "../data/ForecastProvider";

/**
 * Get whether the provided value is an {@link Array}.
 * @param value The value to check.
 */
export function isArray<T>(value: unknown): value is T[]
{
    return Array.isArray(value);
}

/**
 * Ensure that the provided value is a {@link ReadonlyArray}. If it isn't a {@link ReadonlyArray},
 * wrap it in a new {@link ReadonlyArray}.
 * @param value The value to check.
 */
export function ensureReadonlyArray<T>(value: T | ReadonlyArray<T>): ReadonlyArray<T>
{
    return isArray<T>(value) ? value : [value] as ReadonlyArray<T>;
}

export function isObject(value: unknown): value is object
{
    return typeof value === "object" && value !== null;
}

/**
 * Get whether the provided value has a property with the provided key.
 * @param value The value to check.
 * @param propertyKey The key of the property to look for.
 */
export function hasProperty<TValue, TPropertyKey extends PropertyKey>(value: TValue, propertyKey: TPropertyKey): value is TValue & Record<TPropertyKey, unknown>
{
    return isObject(value) && propertyKey in value;
}

/**
 * Parse a {@link Direction} value from the provided text. Returns undefined if no {@link Direction}
 * can be parsed.
 * @param text The text to parse.
 */
export function parseDirection(text: string | undefined): Direction | undefined
{
    let result: Direction | undefined;
    if (text)
    {
        switch (text.toLowerCase())
        {
            case "n":
            case "north":
            case "nobo":
            case "northbound":
                result = "Northbound";
                break;
            case "s":
            case "south":
            case "sobo":
            case "southbound":
                result = "Southbound";
                break;
        }
    }
    return result;
}