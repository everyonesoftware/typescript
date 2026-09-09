import { StringTable } from "./StringTable.js";
import { isUndefinedNullOrEmpty } from "./types.js";

export interface ConditionErrorData
{
    readonly message?: string;

    readonly expression?: string;

    readonly expected: string;
    readonly actual: string;
}

export function conditionErrorDataToMessage(data: ConditionErrorData): string
{
    const table: StringTable = StringTable.create();

    if (!isUndefinedNullOrEmpty(data.message))
    {
        table.addRow(["Message:", data.message]);
    }

    if (!isUndefinedNullOrEmpty(data.expression))
    {
        table.addRow(["Expression:", data.expression]);
    }

    table.addRow(["Expected:", data.expected]);
    table.addRow(["Actual:", data.actual]);

    return table.toString({
        betweenColumns: " ",
    });
}