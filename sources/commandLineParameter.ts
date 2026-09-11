import { Booleans } from "./Booleans.js";
import { orList } from "./english.js";
import { Iterable } from "./iterable.js";
import { JavascriptIterable } from "./javascript.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";
import { SyncResult } from "./syncResult.js";
import { isString, isUndefinedNullOrEmpty, isUndefinedOrNull } from "./types.js";

/**
 * An object that can contain {@link CommandLineParameter}s.
 */
export abstract class CommandLineParameterParent
{
    /**
     * Get whether this {@link CommandLineParameterParent} already contains any of the provided
     * parameter name or aliases.
     * @param nameAndAliases The name and aliases to look for.
     */
    public abstract doParameterNameOrAliasesExist(nameAndAliases: JavascriptIterable<string>): boolean;

    /**
     * Get the command line arguments that can be used to determine a {@link CommandLineParameter}'s
     * value.
     */
    public abstract getArguments(): JavascriptIterable<string> | undefined;
}

/**
 * The default value of the {@link CommandLineParameter} if the parameter isn't found in the
 * arguments or if it is defined but isn't provided a value.
 */
export type CommandLineParameterDefaultValues = string | {
    /**
     * The default value of the {@link CommandLineParameter} if the parameter isn't found in the
     * arguments.
     */
    readonly notFound?: string;
    /**
     * The default value of the {@link CommandLineParameter} if the parameter is found in the
     * arguments but doesn't have a specified value.
     */
    readonly valueNotFound?: string;
};

/**
 * Options that can be provided when creating a new {@link CommandLineParameter}.
 */
export interface CommandLineParameterOptions
{
    /**
     * The name of the {@link CommandLineParameter}.
     */
    readonly name: string;
    /**
     * Aliases that can be used to refer to the {@link CommandLineParameter} without using its full
     * name.
     */
    readonly aliases?: JavascriptIterable<string>;
    /**
     * A description of the {@link CommandLineParameter}.
     */
    readonly description?: string;
    /**
     * The default value of the {@link CommandLineParameter} if the parameter isn't found in the
     * arguments or if it is defined but isn't provided a value.
     */
    readonly defaultValue?: CommandLineParameterDefaultValues;
}

export interface CommandLineParameterProperties extends CommandLineParameterOptions
{
    readonly parent?: CommandLineParameterParent;
    readonly arguments?: JavascriptIterable<string>;
}

export class CommandLineParameter
{
    private readonly parent?: CommandLineParameterParent;
    private readonly name: string;
    private readonly aliases?: JavascriptIterable<string>;
    private readonly description?: string;
    private readonly defaultValue?: CommandLineParameterDefaultValues;
    private readonly arguments?: JavascriptIterable<string>;

    protected constructor(properties: CommandLineParameterProperties)
    {
        PreCondition.assertNotUndefinedAndNotNull(properties, "properties");
        PreCondition.assertNotEmpty(properties.name, "name");
        PreCondition.assertFalse(properties.parent?.doParameterNameOrAliasesExist([properties.name, ...(properties.aliases ?? [])]) === true, "parent?.doParameterNameOrAliasesExist([name, ...aliases]) === true");

        this.parent = properties.parent;
        this.name = properties.name;
        this.aliases = properties.aliases;
        this.description = properties.description;
        this.arguments = properties.arguments;
        this.defaultValue = properties.defaultValue;
    }

    public static create(properties: CommandLineParameterProperties): CommandLineParameter;
    public static create(name: string, aliases?: Iterable<string>, description?: string, defaultValue?: CommandLineParameterDefaultValues): CommandLineParameter;
    static create(propertiesOrName: CommandLineParameterProperties | string, aliases?: JavascriptIterable<string>, description?: string, defaultValue?: CommandLineParameterDefaultValues): CommandLineParameter
    {
        if (isUndefinedOrNull(propertiesOrName) || isString(propertiesOrName))
        {
            propertiesOrName = {
                name: propertiesOrName,
                aliases,
                description,
                defaultValue,
            };
        }

        return new CommandLineParameter(propertiesOrName);
    }

    public getStringValue(args?: JavascriptIterable<string>): SyncResult<string>
    {
        return SyncResult.create(() =>
        {
            args ??= this.arguments ?? this.parent?.getArguments() ?? [];

            let foundArgumentName: string | undefined;
            let result: string | undefined;

            const nameAndAliases: Iterable<string> = this.getNameAndAliases();
            for (const argument of args)
            {
                if (foundArgumentName === undefined)
                {
                    if (!isUndefinedNullOrEmpty(argument))
                    {
                        let argumentNameStartIndex: number | undefined;
                        if (argument[0] === "/")
                        {
                            argumentNameStartIndex = 1;
                        }
                        else if (argument[0] === "-")
                        {
                            argumentNameStartIndex = 1;
                            if (argument.length > 1 && argument[1] === "-")
                            {
                                argumentNameStartIndex = 2;
                            }
                        }

                        if (argumentNameStartIndex !== undefined)
                        {
                            let argumentNameEndIndex: number = argument.indexOf("=", argumentNameStartIndex);
                            if (argumentNameEndIndex === -1)
                            {
                                argumentNameEndIndex = argument.length;
                            }

                            const argumentName: string = argument.substring(argumentNameStartIndex, argumentNameEndIndex);
                            if (nameAndAliases.contains(argumentName).await())
                            {
                                foundArgumentName = argumentName;
                                if (argumentNameEndIndex !== argument.length)
                                {
                                    result = argument.substring(argumentNameEndIndex + 1);
                                    break;
                                }
                            }
                        }
                    }
                }
                else
                {
                    result = argument;
                    break;
                }
            }

            if (foundArgumentName === undefined)
            {
                result = isString(this.defaultValue) ? this.defaultValue : this.defaultValue?.notFound;
                if (isUndefinedOrNull(result))
                {
                    throw new NotFoundError(`No argument found that matches ${orList(nameAndAliases.map(escapeAndQuote))}.`);
                }
            }
            else if (result === undefined)
            {
                result = isString(this.defaultValue) ? this.defaultValue : this.defaultValue?.valueNotFound;
                if (isUndefinedOrNull(result))
                {
                    throw new NotFoundError(`No argument value found for ${escapeAndQuote(foundArgumentName)}.`);
                }
            }

            return result;
        })
    }

    public getBooleanValue(args?: JavascriptIterable<string>): SyncResult<boolean>
    {
        return this.getStringValue(args)
            .then((value: string) => Booleans.parse(value).await());
    }

    /**
     * Get the name of this {@link CommandLineParameter}.
     */
    public getName(): string
    {
        return this.name;
    }

    public getAliases(): JavascriptIterable<string>
    {
        return this.aliases ?? [];
    }

    public getNameAndAliases(): Iterable<string>
    {
        return Iterable.create([this.getName(), ...this.getAliases()]);
    }

    public getDescription(): string
    {
        return this.description ?? "";
    }
}