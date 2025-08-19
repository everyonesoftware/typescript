import { CommandLineParameters } from "./commandLineParameters";
import { Indexable } from "./indexable";
import { Result } from "./result";
import { isArray } from "./types";

/**
 * An object that provides all of the resources that are available to the current process.
 */
export class CurrentProcess
{
    private readonly args: Indexable<string>
    private readonly parameters: Result<CommandLineParameters>;

    private constructor(args: Indexable<string>)
    {
        this.args = args;
        this.parameters = Result.create(() => CommandLineParameters.create(this.args));
    }

    public static create(argv: string[] | Indexable<string>): CurrentProcess
    {
        if (isArray(argv))
        {
            argv = Indexable.create(argv)
        }
        return new CurrentProcess(argv);
    }

    public getArguments(): Indexable<string>
    {
        return this.args;
    }

    public getParameters(): Result<CommandLineParameters>
    {
        return this.parameters;
    }
}