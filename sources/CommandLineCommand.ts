import { AsyncResult } from "./asyncResult.js";
import { CharacterWriteStream } from "./characterWriteStream.js";
import { CommandLineParameter, CommandLineParameterDefaultValues as CommandLineParameterDefaultValue, CommandLineParameterOptions, CommandLineParameterParent } from "./commandLineParameter.js";
import { Iterable } from "./iterable.js";
import { JavascriptIterable } from "./javascript.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";
import { join } from "./strings.js";
import { StringTable } from "./StringTable.js";
import { asIterable, isString, isUndefinedNullOrEmpty, isUndefinedOrNull } from "./types.js";

/**
 * An object that contains {@link CommandLineCommand}s.
 */
export abstract class CommandLineCommandParent
{
    /**
     * Get whether any of the provided command name and aliases already exist in this
     * {@link CommandLineCommandParent}.
     * @param commandNameAndAliases The command name and aliases to check.
     */
    public abstract doCommandNameOrAliasesExist(commandNameAndAliases: JavascriptIterable<string>): boolean;

    /**
     * Get the command line arguments that have been provided.
     */
    public abstract getArguments(): JavascriptIterable<string> | undefined;
}

export interface CommandLineCommandOptions
{
    /**
     * The name of the {@link CommandLineCommand}.
     */
    readonly name: string;
    /**
     * Aliases that can be used to refer to the {@link CommandLineCommand} without using its full
     * name.
     */
    readonly aliases?: JavascriptIterable<string>;
    /**
     * A description of the {@link CommandLineCommand}.
     */
    readonly description?: string;
}

export interface CommandLineCommandProperties extends CommandLineCommandOptions
{
    /**
     * The parent of the new {@link CommandLineCommand}. This object will be used to ensure that
     * each command's name and aliases are unique.
     */
    readonly parent?: CommandLineCommandParent;
    /**
     * The command line arguments that were passed to the application.
     */
    readonly arguments?: JavascriptIterable<string>;
}

export class CommandLineCommand implements CommandLineCommandParent, CommandLineParameterParent
{
    private readonly name: string;
    private readonly aliases?: JavascriptIterable<string>;
    private readonly description?: string;
    private readonly parent?: CommandLineCommandParent;
    private readonly arguments?: JavascriptIterable<string>;

    private subCommands?: List<CommandLineCommand>;
    private readonly parameters: List<CommandLineParameter>;

    private constructor(properties: CommandLineCommandProperties)
    {
        PreCondition.assertNotUndefinedAndNotNull(properties, "properties");
        PreCondition.assertNotEmpty(properties.name, "name");
        PreCondition.assertFalse(properties.parent?.doCommandNameOrAliasesExist([properties.name, ...(properties.aliases ?? [])]) === true, "parent?.doAnyCommandNameOrAliasesExist([name, ...aliases]) === true");

        this.name = properties.name;
        this.aliases = properties.aliases;
        this.description = properties.description;
        this.parent = properties.parent;
        this.arguments = properties.arguments;

        this.parameters = List.create();
        this.addParameter({
            name: "help",
            aliases: ["?"],
            description: "Show the command's help menu.",
            defaultValue: {
                notFound: "false",
                valueNotFound: "true",
            },
        });
    }

    public static create(properties: CommandLineCommandProperties): CommandLineCommand;
    public static create(name: string, aliases?: JavascriptIterable<string>, description?: string): CommandLineCommand;
    static create(propertiesOrName: CommandLineCommandProperties | string, aliases?: JavascriptIterable<string>, description?: string): CommandLineCommand
    {
        if (isUndefinedOrNull(propertiesOrName) || isString(propertiesOrName))
        {
            propertiesOrName = {
                name: propertiesOrName,
                aliases,
                description,
            };
        }
        return new CommandLineCommand(propertiesOrName);
    }

    public doCommandNameOrAliasesExist(nameAndAliases: JavascriptIterable<string>): boolean
    {
        const lowerNameAndAliases: Iterable<string> = asIterable(nameAndAliases)
            .map(value => value.toLowerCase());
        const lowerSubCommandNamesAndAliases: Iterable<string> = (this.subCommands ?? Iterable.create())
            .flatMap(subCommand => subCommand.getNameAndAliases())
            .map(value => value.toLowerCase());

        return lowerNameAndAliases.containsAny(lowerSubCommandNamesAndAliases).await();
    }

    public doParameterNameOrAliasesExist(nameAndAliases: JavascriptIterable<string>): boolean
    {
        const lowerNameAndAliases: Iterable<string> = asIterable(nameAndAliases)
            .map(value => value.toLowerCase());
        const lowerParameterNamesAndAliases: Iterable<string> = (this.parameters ?? Iterable.create())
            .flatMap(parameter => parameter.getNameAndAliases())
            .map(value => value.toLowerCase());

        return lowerNameAndAliases.containsAny(lowerParameterNamesAndAliases).await();
    }

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
        return CommandLineCommand.getNameAndAliases(this);
    }

    public static getNameAndAliases(command: CommandLineCommand): Iterable<string>
    {
        return Iterable.create<string>([command.getName(), ...command.getAliases()]);
    }

    public getDescription(): string
    {
        return this.description ?? "";
    }

    public addParameter(options: CommandLineParameterOptions): CommandLineParameter;
    public addParameter(name: string, aliases?: JavascriptIterable<string>, description?: string, defaultValue?: CommandLineParameterDefaultValue): CommandLineParameter;
    addParameter(optionsOrName: string | CommandLineParameterOptions, aliases?: JavascriptIterable<string>, description?: string, defaultValue?: CommandLineParameterDefaultValue): CommandLineParameter
    {
        if (isString(optionsOrName))
        {
            optionsOrName = {
                name: optionsOrName,
                aliases,
                description,
                defaultValue,
            };
        }
        const parameter: CommandLineParameter = CommandLineParameter.create({
            ...optionsOrName,
            parent: this,
        });
        const parametersCount: number = this.parameters.getCount().await();
        this.parameters.insert(parametersCount === 0 ? 0 : parametersCount - 1, parameter);

        return parameter;
    }

    public getParameters(): Iterable<CommandLineParameter>
    {
        return this.parameters ?? Iterable.create();
    }

    public getArguments(): JavascriptIterable<string> | undefined
    {
        return this.arguments ?? this.parent?.getArguments();
    }

    /**
     * If the help parameter's value is true, then write the command's help message to the provided
     * writeStream and return true. If the help parameter's value is false, then do nothing and
     * return false.
     * @param writeStream The {@link CharacterWriteStream} to write the help messages to.
     * @param args The command line arguments to use to determine the help parameter's value.
     */
    public showHelp(writeStream: CharacterWriteStream, args?: JavascriptIterable<string>): AsyncResult<boolean>
    {
        PreCondition.assertNotUndefinedAndNotNull(writeStream, "writeStream");

        return AsyncResult.create(async () =>
        {
            args ??= this.getArguments() ?? [];

            const parameters: Iterable<CommandLineParameter> = this.getParameters();
            const helpParameter: CommandLineParameter = parameters.last().await();

            const helpValue: boolean = helpParameter.getBooleanValue(args).await();
            if (helpValue)
            {
                const topTable: StringTable = StringTable.create()

                let commandString: string = this.getName();
                const aliases: Iterable<string> = asIterable(this.getAliases());
                if (aliases.any().await())
                {
                    commandString += ` [${join(",", aliases)}]`;
                }
                topTable.addRow(["Command:", commandString]);

                const description: string = this.getDescription();
                if (!isUndefinedNullOrEmpty(description))
                {
                    topTable.addRow(["Description:", description]);
                }
                await topTable.writeTo(writeStream, { betweenColumns: " " });

                if (parameters.any().await())
                {
                    await writeStream.writeLine();
                    await writeStream.writeLine("Parameters:");
                    const parameterTable: StringTable = StringTable.create();
                    for (const parameter of parameters)
                    {
                        parameterTable.addRow([
                            `--${parameter.getName()} [${join(",", asIterable(parameter.getAliases()).map(alias => `-${alias}`))}]:`,
                            parameter.getDescription(),
                        ]);
                    }
                    await parameterTable.writeTo(writeStream, { betweenColumns: " " });
                    await writeStream.writeLine();
                }
            }

            return helpValue;
        });
    }
}