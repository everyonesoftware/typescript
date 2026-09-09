import { BaseError } from "./BaseError.js";
import { ConditionErrorData, conditionErrorDataToMessage } from "./ConditionError.js";

/**
 * An {@link Error} that is thrown when a pre-condition fails.
 */
export class PreConditionError extends BaseError
{
    public constructor(data: ConditionErrorData)
    {
        super(conditionErrorDataToMessage(data));
    }
}