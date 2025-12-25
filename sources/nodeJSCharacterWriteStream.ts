import { CharacterWriteStream } from "./characterWriteStream";
import { PostCondition } from "./postCondition";
import { PreCondition } from "./preCondition";
import { Result } from "./result";

export class NodeJSCharacterWriteStream extends CharacterWriteStream
{
    private readonly nodeJSWriteStream: NodeJS.WriteStream;

    private constructor(nodeJSWriteStream: NodeJS.WriteStream)
    {
        PreCondition.assertNotUndefinedAndNotNull(nodeJSWriteStream, "nodeJSWriteStream");

        super();

        this.nodeJSWriteStream = nodeJSWriteStream;
    }

    public static create(nodeJSWriteStream: NodeJS.WriteStream): NodeJSCharacterWriteStream
    {
        return new NodeJSCharacterWriteStream(nodeJSWriteStream);
    }

    public writeString(text: string): Result<number>
    {
        PreCondition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const writeResult: boolean = this.nodeJSWriteStream.write(text);
            PostCondition.assertTrue(writeResult, "writeResult", "Expected the return value from writing a string to always be true.");

            return text.length;
        });
    }
}