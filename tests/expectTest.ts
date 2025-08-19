import { expect } from "vitest";
import { Pre } from "../sources/pre";
import { Test } from "./test";
import { Type } from "../sources/types";

/**
 * A {@link Test} type that uses Vite's "expect()" functions to make assertions.
 */
export class ExpectTest implements Test
{
    protected constructor()
    {
    }

    /**
     * Create a new {@link ExpectTest} object.
     */
    public static create(): ExpectTest
    {
        return new ExpectTest();
    }

    public fail(message: string): never
    {
        Pre.condition.assertNotEmpty(message, "message");

        expect.fail(message);
    }

    public assertUndefined(value: unknown): asserts value is undefined
    {
        Test.assertUndefined(this, value);
    }

    public assertNotUndefined<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotUndefined(this, value);
    }

    public assertNull(value: unknown): asserts value is null
    {
        Test.assertNull(this, value);
    }

    public assertNotNull<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotNull(this, value);
    }

    public assertNotUndefinedAndNotNull<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotUndefinedAndNotNull(this, value);
    }

    public assertSame<T>(left: T, right: T): void
    {
        expect(left).toStrictEqual(right);
    }

    public assertNotSame<T>(left: T, right: T): void
    {
        expect(left).not.toBe(right);
    }

    public assertEqual<T>(left: T, right: T): void
    {
        expect(left).toStrictEqual(right);
    }

    public assertNotEqual<T>(left: T, right: T): void
    {
        expect(left).not.toStrictEqual(right);
    }

    public assertFalse(value: boolean): void
    {
        Test.assertFalse(this, value);
    }

    public assertTrue(value: boolean): void
    {
        Test.assertTrue(this, value);
    }

    public assertThrows(action: () => void, expectedError: Error): void
    {
        expect(action).toThrowError(expectedError);
    }

    public async assertThrowsAsync(action: () => Promise<unknown>, expectedError: Error): Promise<void>
    {
        await expect(action).rejects.toThrowError(expectedError);
    }

    public assertInstanceOf<T>(value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T): asserts value is T
    {
        if (typeCheck)
        {
            expect(typeCheck(value)).toBe(true);
        }
        else
        {
            expect(value).toBeInstanceOf(type);
        }
    }
}