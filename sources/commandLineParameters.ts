import { JavascriptIterable } from "./javascript";

/**
 * A class that can be used to define and interact with an application's command line interface.
 */
export class CommandLineParameters
{
    private readonly args: JavascriptIterable<string>;

    private constructor(argv: JavascriptIterable<string>)
    {
        this.args = argv
    }

    public static create(args: JavascriptIterable<string>): CommandLineParameters
    {
        return new CommandLineParameters(args)
    }

    
}