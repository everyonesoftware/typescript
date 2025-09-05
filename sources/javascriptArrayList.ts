import { IndexableIterator } from "./indexableIterator";
import { JavascriptIterable } from "./javascript";
import { ListBase } from "./listBase";
import { PreCondition } from "./preCondition";

export class JavascriptArrayList<T> extends ListBase<T>
{
    private readonly array: T[];

    private constructor()
    {
        super();

        this.array = [];
    }

    public static create<T>(values?: JavascriptIterable<T>): JavascriptArrayList<T>
    {
        const result: JavascriptArrayList<T> = new JavascriptArrayList<T>();
        if (values)
        {
            result.addAll(values);
        }
        return result;
    }

    public override set(index: number, value: T): this
    {
        PreCondition.assertAccessIndex(index, this.getCount(), "index");

        this.array[index] = value;

        return this;
    }

    public override iterate(): IndexableIterator<T>
    {
        return IndexableIterator.create(this.array);
    }

    public override getCount(): number
    {
        return this.array.length;
    }

    public override get(index: number): T
    {
        PreCondition.assertAccessIndex(index, this.getCount(), "index");

        return this.array[index];
    }

    public override insert(index: number, value: T): this
    {
        PreCondition.assertInsertIndex(index, this.getCount(), "index");

        this.array.splice(index, 0, value);

        return this;
    }

    public override insertAll(index: number, values: JavascriptIterable<T>): this
    {
        PreCondition.assertInsertIndex(index, this.getCount() ,"index");
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        this.array.splice(index, 0, ...values);

        return this;
    }
}