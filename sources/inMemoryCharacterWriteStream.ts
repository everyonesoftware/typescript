import { CharacterWriteStream } from "./characterWriteStream";
import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { getLength } from "./strings";

export class InMemoryCharacterWriteStream extends CharacterWriteStream
{
    private writtenText: string;
    private newlineSequence: string;

    private constructor()
    {
        super();

        this.writtenText = "";
        this.newlineSequence = "\n";
    }

    public static create(): InMemoryCharacterWriteStream
    {
        return new InMemoryCharacterWriteStream();
    }

    public getNewlineSequence(): string
    {
        return this.newlineSequence;
    }

    public setNewlineSequence(newlineSequence: string): this
    {
        PreCondition.assertNotUndefinedAndNotNull(newlineSequence, "newlineSequence");

        this.newlineSequence = newlineSequence;

        return this;
    }

    public getWrittenText(): string
    {
        return this.writtenText;
    }

    public clearWrittenText(): this
    {
        this.writtenText = "";

        return this;
    }

    public writeString(text: string): Result<number>
    {
        return Result.create(() =>
        {
            if (text)
            {
                this.writtenText += text;
            }
            return getLength(text);
        });
    }

    public override writeLine(text?: string): Result<number>
    {
        return Result.create(() =>
        {
            let result: number = 0;
            if (text)
            {
                result += this.writeString(text).await();
            }
            if (this.newlineSequence)
            {
                result += this.writeString(this.newlineSequence).await();
            }
            return result;
        });
    }
}