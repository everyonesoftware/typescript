import { CharacterWriteStream } from "./characterWriteStream";
import { CommandLineParameters } from "./commandLineParameters";
import { JavascriptIterable } from "./javascript";
import { NodeJSCharacterWriteStream } from "./nodeJSCharacterWriteStream";
import { PreCondition } from "./preCondition";

/**
 * An object that provides all of the resources that are available to the current process.
 */
export class CurrentProcess
{
    private args: JavascriptIterable<string> | undefined
    private parameters: CommandLineParameters | undefined;
    private outputWriteStream: CharacterWriteStream | undefined;

    private constructor()
    {
    }

    public static create(): CurrentProcess
    {
        return new CurrentProcess();
    }

    public getArguments(): JavascriptIterable<string>
    {
        if (!this.args)
        {
            this.args = process.argv;
        }
        return this.args;
    }

    public setArguments(args: JavascriptIterable<string>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(args, "args");
        PreCondition.assertUndefined(this.parameters, "this.parameters");

        this.args = args;
        return this;
    }

    public getParameters(): CommandLineParameters
    {
        if (!this.parameters)
        {
            this.parameters = CommandLineParameters.create(this.getArguments());
        }
        return this.parameters;
    }

    public getOutputWriteStream(): CharacterWriteStream
    {
        if (!this.outputWriteStream)
        {
            this.outputWriteStream = NodeJSCharacterWriteStream.create(process.stdout);
        }
        return this.outputWriteStream;
    }

    public setOutputWriteStream(outputWriteStream: CharacterWriteStream): this
    {
        PreCondition.assertNotUndefinedAndNotNull(outputWriteStream, "outputWriteStream");

        this.outputWriteStream = outputWriteStream;

        return this;
    }
}