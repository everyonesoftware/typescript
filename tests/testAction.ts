import { JavascriptIterable } from "../sources/javascript";
import { List } from "../sources/list";
import { PreCondition } from "../sources/preCondition";
import { join } from "../sources/strings";

export class TestAction
{
    private readonly parent: TestAction | undefined;
    private readonly name: string;
    private readonly action: () => void;

    private constructor(parent: TestAction | undefined, name: string, action: () => void)
    {
        PreCondition.assertNotUndefinedAndNotNull(name, "name");
        PreCondition.assertNotUndefinedAndNotNull(action, "action");

        this.parent = parent;
        this.name = name;
        this.action = action;
    }

    public static create(parent: TestAction | undefined, name: string, action: () => void): TestAction
    {
        return new TestAction(parent, name, action);
    }

    public getParent(): TestAction | undefined
    {
        return this.parent;
    }

    public getName(): string
    {
        return this.name;
    }

    public getFullNameParts(): JavascriptIterable<string>
    {
        const result: List<string> = List.create();
        if (this.parent)
        {
            result.addAll(this.parent.getFullNameParts());
        }
        result.add(this.getName());
        return result;
    }

    public getFullName(): string
    {
        return join(" ", this.getFullNameParts());
    }

    public getAction(): () => void
    {
        return this.action;
    }
    
    public run(): void
    {
        return this.action();
    }
}