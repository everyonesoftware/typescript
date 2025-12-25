import { JavascriptIterable } from "../sources/javascript";
import { PreCondition } from "../sources/preCondition";
import { join } from "../sources/strings";
import { TestSkip } from "./testSkip";

export class SkippedTest
{
    private readonly skip: TestSkip;
    private readonly fullTestNameParts: JavascriptIterable<string>;

    private constructor(skip: TestSkip, fullTestNameParts: JavascriptIterable<string>)
    {
        PreCondition.assertNotUndefinedAndNotNull(skip, "skip");
        PreCondition.assertNotEmpty(fullTestNameParts, "fullTestNameParts");

        this.skip = skip;
        this.fullTestNameParts = fullTestNameParts;
    }

    public static create(skip: TestSkip, fullTestNameParts: JavascriptIterable<string>): SkippedTest
    {
        return new SkippedTest(skip, fullTestNameParts);
    }

    public getSkipMessage(): string
    {
        return this.skip.getMessage();
    }

    public getFullTestNameParts(): JavascriptIterable<string>
    {
        return this.fullTestNameParts;
    }

    public getFullTestName(): string
    {
        return join(" ", this.fullTestNameParts);
    }
}