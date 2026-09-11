import { ParseError } from "./ParseError.js";
import { escapeAndQuote } from "./strings.js";
import { SyncResult } from "./syncResult.js";
import { isUndefinedNullOrEmpty } from "./types.js";

export abstract class Booleans
{
    public static parse(text: string): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            let result: boolean | undefined;
            if (!isUndefinedNullOrEmpty(text))
            {
                switch (text.toLowerCase())
                {
                    case "0":
                    case "f":
                    case "false":
                        result = false;
                        break;

                    case "1":
                    case "t":
                    case "true":
                        result = true;
                        break;
                }
            }
            if (result === undefined)
            {
                throw new ParseError(`Could not parse ${escapeAndQuote(text)} into a boolean value.`);
            }
            return result;
        });
    }
}