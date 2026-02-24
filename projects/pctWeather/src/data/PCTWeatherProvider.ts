import { type Direction, type Forecast, type ForecastProvider } from "./ForecastProvider";

export class PCTWeatherProvider implements ForecastProvider
{
    public async getForecast(mileNumber: number, direction: Direction): Promise<Forecast>
    {
        const forecastRequestURL: string = `https://api.pctweather.com/forecast?m=${mileNumber}&d=${direction[0].toLowerCase()}`;
        const getForecastResponse: Response = await fetch(forecastRequestURL);
        if (!getForecastResponse.ok)
        {
            throw new Error(await getForecastResponse.text());
        }

        const result: Forecast = await getForecastResponse.json();
        return result;
    }

    public async getTrailcast(mileNumber: number, direction: Direction, startDay: string, milesPerDay: number): Promise<Forecast[]>
    {
        const trailcastRequestURL: string = `https://api.pctweather.com/trailcast?m=${mileNumber}&d=${direction[0].toLowerCase()}&s=${startDay}&mpd=${milesPerDay}`;
        const getTrailcastResponse: Response = await fetch(trailcastRequestURL);
        if (!getTrailcastResponse.ok)
        {
            throw new Error(await getTrailcastResponse.text());
        }

        const result: Forecast[] = await getTrailcastResponse.json();
        return result;
    }
}