/**
 * An individual parameter from a {@link CommandLineParameters} object.
 */
export class CommandLineParameter<T>
{
    /**
     * The full name of this {@link CommandLineParameter}.
     */
    private readonly name: string;
    /**
     * The description for this {@link CommandLineParameter}.
     */
    private readonly description: string;
    /**
     * The function that can be invoked to get this {@link CommandLineParameter}'s value.
     */
    private readonly valueGetter: () => T;

    private constructor(name: string, description: string, valueGetter: () => T)
    {
        this.name = name;
        this.description = description;
        this.valueGetter = valueGetter;
    }

    /**
     * Create a new {@link CommandLineParameter}.
     * @param name The full name of the {@link CommandLineParameter}.
     * @param description The description for the {@link CommandLineParameter}.
     * @param valueGetter The function that will be used to get the returned
     * {@link CommandLineParameter}'s value.
     */
    public static create<T>(name: string, description: string, valueGetter: () => T)
    {
        return new CommandLineParameter<T>(name, description, valueGetter);
    }

    /**
     * Get the value for this {@link CommandLineParameter}.
     */
    public getValue(): T
    {
        return this.valueGetter();
    }
}