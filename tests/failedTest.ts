import { JavascriptIterable } from "../sources/javascript";
import { PreCondition } from "../sources/preCondition";
import { join } from "../sources/strings";

export class FailedTest
{
    private readonly fullTestNameParts: JavascriptIterable<string>;
    private readonly error: unknown;

    private constructor(fullTestNameParts: JavascriptIterable<string>, error: unknown)
    {
        PreCondition.assertNotEmpty(fullTestNameParts, "fullTestName");
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        this.fullTestNameParts = fullTestNameParts;
        this.error = error;
    }

    public static create(fullTestNameParts: JavascriptIterable<string>, error: unknown): FailedTest
    {
        return new FailedTest(fullTestNameParts, error);
    }

    public getFullTestNameParts(): JavascriptIterable<string>
    {
        return this.fullTestNameParts;
    }

    public getFullTestName(): string
    {
        return join(" ", this.fullTestNameParts);
    }

    public getError(): unknown
    {
        return this.error;
    }

    public getErrorMessage(): string
    {
        return this.error instanceof Error && this.error.stack ? this.error.stack : `${this.error}`;
    }
}