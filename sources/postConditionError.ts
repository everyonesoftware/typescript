import { BaseError } from "./BaseError.js";
import { ConditionErrorData, conditionErrorDataToMessage } from "./ConditionError.js";

/**
 * An {@link Error} that is thrown when a post-condition fails.
 */
export class PostConditionError extends BaseError
{
    public constructor(data: ConditionErrorData)
    {
        super(conditionErrorDataToMessage(data));
    }
}