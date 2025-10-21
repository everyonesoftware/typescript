import React from 'react';
import './App.css';
import type { Direction, Forecast, ForecastPeriod, ForecastProvider } from '../data/ForecastProvider';
import { PCTWeatherProvider } from '../data/PCTWeatherProvider';
import { Property } from './Property';
import { QueryParameterProperty } from './QueryParameterProperty';
import { parseDirection } from './Utils';
import { ComboButton } from './ComboButton';

export function App(): React.ReactElement
{
  const mileNumber = QueryParameterProperty.create(["m", "mile", "mileNumber"]);
  const startDay = QueryParameterProperty.create(["s", "sd", "start", "startDay"]);
  const milesPerDay = QueryParameterProperty.create(["mpd", "milesPerDay"]);
  const direction = QueryParameterProperty.create(["d", "dir", "direction"]);
  const forecastMessage = Property.create<string>("");
  const forecasts = Property.create<Forecast[] | undefined>(undefined);

  function getLocationURL(mileNumber: number, latitude: number, longitude: number): string
  {
    return `https://maps.google.com?q=${latitude},${longitude}(${encodeURIComponent(`Mile ${mileNumber}`)})`;
  }

  function getDirection(): Direction
  {
    return parseDirection(direction.value) || "Northbound";
  }

  function loadForecast(): void
  {
    const directionValue: Direction = getDirection();
    const mileNumberValue: number | undefined = mileNumber.valueAsNumber;
    const startDayValue: string | undefined = startDay.value;
    const milesPerDayValue: number | undefined = milesPerDay.valueAsNumber;

    forecasts.set(undefined);
    if (mileNumberValue !== undefined && startDayValue !== undefined && milesPerDayValue !== undefined)
    {
      for (const property of [direction, mileNumber, startDay, milesPerDay])
      {
        property.updateBrowserURL();
      }

      forecastMessage.set("Loading forecast...");

      const forecastProvider: ForecastProvider = new PCTWeatherProvider();
      forecastProvider.getTrailcast(mileNumberValue, directionValue, startDayValue, milesPerDayValue)
        .then((trailcast: Forecast[]) =>
        {
          if (getDirection() === directionValue &&
              mileNumber.valueAsNumber === mileNumberValue &&
              startDay.value === startDayValue &&
              milesPerDay.valueAsNumber === milesPerDayValue)
          {
            forecastMessage.set("");
            forecasts.set(trailcast);
          }
        })
        .catch((error) =>
        {
          forecastMessage.set(error.message);
        });
    }
  }

  return <div className="max-w-xl min-h-screen p-4 mx-auto bg-gray-100">
    <h1 className="text-4xl font-bold text-center">PCT Weather</h1>
    <h2 className="text-center">Weather updates that follow your hike,<br />not just your start point.</h2>
    <div className="flex flex-col items-center w-full mt-4 space-y-2">

      <div className="flex items-center gap-2">
        <label className="text-lg font-medium w-30">Start at Mile:</label>
        <input
          name="m"
          value={mileNumber.value}
          onChange={e => mileNumber.set(e.target.value)}
          type="number"
          min={-10}
          max={2700}
          required
          className="p-2 text-center bg-white border rounded w-35"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-lg font-medium w-30">Miles Per Day:</label>
        <input
          name="mpd"
          value={milesPerDay.value}
          onChange={e => milesPerDay.set(e.target.value)}
          type="number"
          min={0}
          max={100}
          required
          className="p-2 text-center bg-white border rounded w-35"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-lg font-medium w-30">Start Date:</label>
        <input
          name="sd"
          value={startDay.value}
          onChange={e => startDay.set(e.target.value)}
          type="date"
          required
          className="p-2 text-center bg-white border rounded w-35"
        />
      </div>

      <ComboButton
        onClick={loadForecast}
        options={[
          { label: "Get NOBO Forecast", onSelected: () => direction.set("n") },
          { label: "Get SOBO Forecast", onSelected: () => direction.set("s") },
        ]}
      />
    </div>

    {forecastMessage.value && <div>
      <hr className="mt-5 mb-4" />
      <div className="text-center">
        {forecastMessage.value}
      </div>
    </div>}
    {(forecasts.value && forecasts.value.length > 0) && <div>
      <hr className="mt-5 mb-4" />

      <h2 className="text-xl font-bold text-center">Weather Along My Hike</h2>
      <h3 className="mb-4 text-center">Up to 7 day forecast, sourced from NOAA</h3>

      {/* <h3 className="text-xl text-center">See what weather's ahead based on where you'll be each day</h3> */}

      <div className="grid max-w-6xl gap-4 mx-auto">
        {
          forecasts.value.map((forecast: Forecast) =>
          {
            const dateString: string = forecast.forecastPeriods[0].startTime.toLowerCase().split("t")[0];
            const dateStringParts: string[] = dateString.split("-");
            const monthNumber: number = parseInt(dateStringParts[1]);
            const monthIndex: number = monthNumber - 1;
            const dayNumber: number = parseInt(dateStringParts[2]);
            // Use arbitrary year since we only care about month/day
            const date = new Date(2025, monthIndex, dayNumber);
            const dateText: string = date.toLocaleString(undefined, {
              month: "long",
              day: "numeric",
              year: 'numeric',
            });

            return (
              <div key={forecast.mileNumber} className="p-4 bg-white border border-gray-200 shadow-md rounded-2xl">
                <div className="flex justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {dateText}
                    </h2>
                  </div>

                  <div className="text-right">
                    <a className="text-lg font-bold text-blue-700 underline visited:text-purple-700"
                       href={getLocationURL(forecast.mileNumber, forecast.latitude, forecast.longitude)}
                       target="_blank"
                       rel="noopener noreferrer"
                    >
                      Mile {forecast.mileNumber}
                    </a>
                    <p className="text-sm text-gray-500">
                      Elevation: {forecast.elevationFeet.toLocaleString()} ft
                    </p>
                  </div>
                </div>


                <div className="space-y-4">
                  {
                    forecast.forecastPeriods.map((forecastPeriod: ForecastPeriod, index: number) =>
                    {
                      return <div key={index} className="flex items-start space-x-4">
                        <img
                          src={forecastPeriod.icon}
                          className="flex-shrink-0 w-20 h-20"
                        />
                        <div className="-mt-1">
                          <p className="font-medium text-gray-700">
                            {forecastPeriod.timePeriod}
                          </p>
                          <p className="text-gray-600">
                            {forecastPeriod.forecastText}
                          </p>
                        </div>
                      </div>;
                    })
                  }
                </div>
              </div>
            );
          })
        }
      </div>
    </div>}
  </div>;
}
