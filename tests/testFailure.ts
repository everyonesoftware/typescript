import { PreCondition } from "../sources/preCondition";

export class TestFailure
{
    private readonly fullTestName: string;
    private readonly error: unknown;

    private constructor(fullTestName: string, error: unknown)
    {
        PreCondition.assertNotEmpty(fullTestName, "fullTestName");
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        this.fullTestName = fullTestName;
        this.error = error;
    }

    public static create(fullTestName: string, error: unknown): TestFailure
    {
        return new TestFailure(fullTestName, error);
    }

    public getFullTestName(): string
    {
        return this.fullTestName;
    }

    public getErrorMessage(): string
    {
        return this.error instanceof Error && this.error.stack ? this.error.stack : `${this.error}`;
    }
}