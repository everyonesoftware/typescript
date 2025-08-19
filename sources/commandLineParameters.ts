import { Indexable } from "./indexable";

/**
 * A class that can be used to define and interact with an application's command line interface.
 */
export class CommandLineParameters
{
    private readonly args: Indexable<string>;

    private constructor(argv: Indexable<string>)
    {
        this.args = argv
    }

    public static create(args: Indexable<string>): CommandLineParameters
    {
        return new CommandLineParameters(args)
    }

    
}