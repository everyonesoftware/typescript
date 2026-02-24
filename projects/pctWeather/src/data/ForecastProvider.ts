/**
 * The direction a hiker is going.
 */
export type Direction = "Northbound" | "Southbound";

/**
 * A forecast for a period of time.
 */
export interface ForecastPeriod
{
    /**
     * The time period that this forecast is for.
     * For example: "This Afternoon", "Tonight", "Wednesday"
     */
    readonly timePeriod: string;
    /**
     * A detailed textual forecast for the period.
     * For example: "Sunny, with a high near 79. Southwest wind 5 to 15 mph, with gusts as high as 25 mph."
     */
    readonly forecastText: string;
    /**
     * The URL to the icon that should be used to represent the weather conditions for the period.
     */
    readonly icon: string;

    readonly startTime: string;

    readonly endTime: string;
}

/**
 * A forecast for a specific location.
 */
export interface Forecast
{
    /**
     * The mile number of the forecast.
     */
    readonly mileNumber: number;
    /**
     * The latitude of the mile number.
     */
    readonly latitude: number;
    /**
     * The longitude of the mile number.
     */
    readonly longitude: number;
    /**
     * The direction the hiker is going.
     */
    readonly direction: Direction;
    /**
     * The elevation of the forecast location in feet.
     */
    readonly elevationFeet: number;
    /**
     * Forecasts for different periods of time.
     */
    readonly forecastPeriods: ForecastPeriod[];
}

/**
 * A type that can provide a forecast for a mile marker.
 */
export interface ForecastProvider
{
    /**
     * Get the weather forecast for the provided mile number if a hiker is going the provided
     * direction.
     * @param mileNumber The number of miles from the start of the trail.
     * @param direction The direction the hiker is going in.
     */
    getForecast(mileNumber: number, direction: Direction): Promise<Forecast>;

    /**
     * Get the trailcast for the provided mile number if a hiker is going the provided
     * direction.
     * @param mileNumber The number of miles from the start of the trail.
     * @param direction The direction the hiker is going in.
     * @param startDay The day that the trailcast should begin on. Should be in an ISO-8601 format.
     * @param milesPerDay The number of miles per day that the hiker is going.
     */
    getTrailcast(mileNumber: number, direction: Direction, startDay: string, milesPerDay: number): Promise<Forecast[]>;
}