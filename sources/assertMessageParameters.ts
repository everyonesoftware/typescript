/**
 * A collection of parameters that can be passed to an assert error message function.
 */
export interface AssertMessageParameters
{
    /**
     * The expected state.
     */
    expected: string,
    /**
     * The actual state.
     */
    actual: string,
    /**
     * A string representation of the expression that produced the actual state.
     */
    expression?: string,
    /**
     * A message that describes the failure.
     */
    message?: string,
}