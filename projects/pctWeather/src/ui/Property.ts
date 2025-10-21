import React from "react";
import { hasProperty } from "./Utils";

/**
 * Parameters that can be passed to {@link Property.create()}.
 */
export interface PropertyCreateParameters<T>
{
    /**
     * The value that the {@link Property} will be initialized with.
     */
    readonly initialValue: T;

    /**
     * The function that will be used to create the React property. Defaults to
     * {@link React.useState()}.
     */
    readonly valueSetterCreator?: () => [T, React.Dispatch<React.SetStateAction<T>>];
}

/**
 * Get whether the provided {@link value} is a {@link PropertyCreateParameters} object.
 * @param value The value to check.
 */
export function isPropertyCreateParameters<T>(value: unknown): value is PropertyCreateParameters<T>
{
    return hasProperty(value, "initialValue");
}

/**
 * A React value and setter combined into a single object.
 */
export class Property<T>
{
    /**
     * The value of this {@link Property}.
     */
    public readonly value: T;
    /**
     * The setter of this {@link Property}. Any changes made by this setter will not be reflected in
     * {@link value} until the next render.
     */
    public readonly set: React.Dispatch<React.SetStateAction<T>>

    protected constructor(value: T, setter: React.Dispatch<React.SetStateAction<T>>)
    {
        this.value = value;
        this.set = setter;
    }

    /**
     * Create a new {@link Property} with the provided initial value.
     * @param initialValue The initial value of the {@link Property}.
     */
    public static create<T>(initialValue: T): Property<T>;
    /**
     * Create a new {@link Property} using the provided {@link PropertyCreateParameters}.
     * @param parameters The parameters that define the {@link Property}.
     */
    public static create<T>(parameters: PropertyCreateParameters<T>): Property<T>;
    static create<T>(parametersOrInitialValue: T | PropertyCreateParameters<T>): Property<T>
    {
        const parameters: PropertyCreateParameters<T> = isPropertyCreateParameters<T>(parametersOrInitialValue)
            ? parametersOrInitialValue
            : { initialValue: parametersOrInitialValue };

        const valueSetterCreator: (initialValue: T) => [T, React.Dispatch<React.SetStateAction<T>>] = parameters.valueSetterCreator ?? React.useState;

        const [value, setter] = valueSetterCreator(parameters.initialValue);
        return new Property<T>(value, setter);
    }
}
