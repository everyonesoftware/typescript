import type { Direction, Forecast, ForecastProvider } from "./ForecastProvider";

export class FakeForecastProvider implements ForecastProvider
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getForecast(_mileNumber: number, _direction: Direction): Promise<Forecast>
    {
        return Promise.resolve({
            "mileNumber": 77,
            "latitude": 33.0963732000001,
            "longitude": -116.4725938,
            "direction": "Northbound",
            "elevationFeet": 2270,
            "forecastPeriods": [
                {
                    "timePeriod": "Tonight",
                    "startTime": "2025-06-22T19:00:00-07:00",
                    "endTime": "2025-06-23T06:00:00-07:00",
                    "forecastText": "Mostly clear, with a low around 59. West wind 10 to 20 mph, with gusts as high as 30 mph.",
                    "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                },
                {
                    "timePeriod": "Monday",
                    "startTime": "2025-06-23T06:00:00-07:00",
                    "endTime": "2025-06-23T18:00:00-07:00",
                    "forecastText": "Sunny, with a high near 87. Northwest wind 0 to 15 mph, with gusts as high as 30 mph.",
                    "icon": "https://api.weather.gov/icons/land/day/few?size=small"
                },
                {
                    "timePeriod": "Monday Night",
                    "startTime": "2025-06-23T18:00:00-07:00",
                    "endTime": "2025-06-24T06:00:00-07:00",
                    "forecastText": "Mostly clear, with a low around 59. West wind 10 to 15 mph, with gusts as high as 30 mph.",
                    "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                },
                {
                    "timePeriod": "Tuesday",
                    "startTime": "2025-06-24T06:00:00-07:00",
                    "endTime": "2025-06-24T18:00:00-07:00",
                    "forecastText": "Sunny, with a high near 88. Northwest wind 0 to 15 mph, with gusts as high as 25 mph.",
                    "icon": "https://api.weather.gov/icons/land/day/few?size=small"
                },
                {
                    "timePeriod": "Tuesday Night",
                    "startTime": "2025-06-24T18:00:00-07:00",
                    "endTime": "2025-06-25T06:00:00-07:00",
                    "forecastText": "Mostly clear, with a low around 63. West wind 5 to 15 mph, with gusts as high as 25 mph.",
                    "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                },
                {
                    "timePeriod": "Wednesday",
                    "startTime": "2025-06-25T06:00:00-07:00",
                    "endTime": "2025-06-25T18:00:00-07:00",
                    "forecastText": "Sunny, with a high near 94.",
                    "icon": "https://api.weather.gov/icons/land/day/skc?size=small"
                },
                {
                    "timePeriod": "Wednesday Night",
                    "startTime": "2025-06-25T18:00:00-07:00",
                    "endTime": "2025-06-26T06:00:00-07:00",
                    "forecastText": "Mostly clear, with a low around 68.",
                    "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                },
                {
                    "timePeriod": "Thursday",
                    "startTime": "2025-06-26T06:00:00-07:00",
                    "endTime": "2025-06-26T18:00:00-07:00",
                    "forecastText": "Sunny, with a high near 97.",
                    "icon": "https://api.weather.gov/icons/land/day/skc?size=small"
                },
                {
                    "timePeriod": "Thursday Night",
                    "startTime": "2025-06-26T18:00:00-07:00",
                    "endTime": "2025-06-27T06:00:00-07:00",
                    "forecastText": "Clear, with a low around 69.",
                    "icon": "https://api.weather.gov/icons/land/night/skc?size=small"
                },
                {
                    "timePeriod": "Friday",
                    "startTime": "2025-06-27T06:00:00-07:00",
                    "endTime": "2025-06-27T18:00:00-07:00",
                    "forecastText": "Sunny, with a high near 98.",
                    "icon": "https://api.weather.gov/icons/land/day/skc?size=small"
                },
                {
                    "timePeriod": "Friday Night",
                    "startTime": "2025-06-27T18:00:00-07:00",
                    "endTime": "2025-06-28T06:00:00-07:00",
                    "forecastText": "Mostly clear, with a low around 69.",
                    "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                },
                {
                    "timePeriod": "Saturday",
                    "startTime": "2025-06-28T06:00:00-07:00",
                    "endTime": "2025-06-28T18:00:00-07:00",
                    "forecastText": "Sunny, with a high near 98.",
                    "icon": "https://api.weather.gov/icons/land/day/few?size=small"
                },
                {
                    "timePeriod": "Saturday Night",
                    "startTime": "2025-06-28T18:00:00-07:00",
                    "endTime": "2025-06-29T06:00:00-07:00",
                    "forecastText": "Mostly clear, with a low around 70.",
                    "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                },
                {
                    "timePeriod": "Sunday",
                    "startTime": "2025-06-29T06:00:00-07:00",
                    "endTime": "2025-06-29T18:00:00-07:00",
                    "forecastText": "Sunny, with a high near 100.",
                    "icon": "https://api.weather.gov/icons/land/day/skc?size=small"
                }
            ]
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getTrailcast(_mileNumber: number, _direction: Direction, _startDay: string, _milesPerDay: number): Promise<Forecast[]>
    {
        return Promise.resolve(
            [
                {
                    "mileNumber": 751,
                    "latitude": 36.4478741,
                    "longitude": -118.2179073,
                    "direction": "Northbound",
                    "elevationFeet": 11077,
                    "forecastPeriods": [
                        {
                            "timePeriod": "Monday",
                            "startTime": "2025-06-23T06:00:00-07:00",
                            "endTime": "2025-06-23T18:00:00-07:00",
                            "forecastText": "Mostly sunny. High near 48, with temperatures falling to around 46 in the afternoon. East southeast wind 7 to 16 mph, with gusts as high as 24 mph.",
                            "icon": "https://api.weather.gov/icons/land/day/sct?size=small"
                        },
                        {
                            "timePeriod": "Monday Night",
                            "startTime": "2025-06-23T18:00:00-07:00",
                            "endTime": "2025-06-24T06:00:00-07:00",
                            "forecastText": "Mostly clear, with a low around 34. West wind around 13 mph, with gusts as high as 18 mph.",
                            "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                        }
                    ]
                },
                {
                    "mileNumber": 763,
                    "latitude": 36.5073573,
                    "longitude": -118.3433997,
                    "direction": "Northbound",
                    "elevationFeet": 10360,
                    "forecastPeriods": [
                        {
                            "timePeriod": "Tuesday",
                            "startTime": "2025-06-24T06:00:00-07:00",
                            "endTime": "2025-06-24T18:00:00-07:00",
                            "forecastText": "Mostly sunny, with a high near 61. Southeast wind 5 to 10 mph.",
                            "icon": "https://api.weather.gov/icons/land/day/sct?size=small"
                        },
                        {
                            "timePeriod": "Tuesday Night",
                            "startTime": "2025-06-24T18:00:00-07:00",
                            "endTime": "2025-06-25T06:00:00-07:00",
                            "forecastText": "Mostly clear, with a low around 38. West southwest wind 5 to 10 mph.",
                            "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                        }
                    ]
                },
                {
                    "mileNumber": 775,
                    "latitude": 43.373403373,
                    "longitude": -122.043737147,
                    "direction": "Northbound",
                    "elevationFeet": 11115,
                    "forecastPeriods": [
                        {
                            "timePeriod": "Wednesday",
                            "startTime": "2025-06-25T06:00:00-07:00",
                            "endTime": "2025-06-25T18:00:00-07:00",
                            "forecastText": "Sunny, with a high near 59. South wind 5 to 15 mph.",
                            "icon": "https://api.weather.gov/icons/land/day/skc?size=small"
                        },
                        {
                            "timePeriod": "Wednesday Night",
                            "startTime": "2025-06-25T18:00:00-07:00",
                            "endTime": "2025-06-26T06:00:00-07:00",
                            "forecastText": "Clear, with a low around 37. West southwest wind 10 to 15 mph.",
                            "icon": "https://api.weather.gov/icons/land/night/skc?size=small"
                        }
                    ]
                },
                {
                    "mileNumber": 787,
                    "latitude": 36.7509594580001,
                    "longitude": -118.389405345,
                    "direction": "Northbound",
                    "elevationFeet": 10027,
                    "forecastPeriods": [
                        {
                            "timePeriod": "Thursday",
                            "startTime": "2025-06-26T06:00:00-07:00",
                            "endTime": "2025-06-26T18:00:00-07:00",
                            "forecastText": "Sunny, with a high near 64. West southwest wind 5 to 20 mph.",
                            "icon": "https://api.weather.gov/icons/land/day/skc?size=small"
                        },
                        {
                            "timePeriod": "Thursday Night",
                            "startTime": "2025-06-26T18:00:00-07:00",
                            "endTime": "2025-06-27T06:00:00-07:00",
                            "forecastText": "Clear, with a low around 40. West southwest wind 5 to 20 mph.",
                            "icon": "https://api.weather.gov/icons/land/night/skc?size=small"
                        }
                    ]
                },
                {
                    "mileNumber": 799,
                    "latitude": 36.8553710950001,
                    "longitude": -118.418473246,
                    "direction": "Northbound",
                    "elevationFeet": 9314,
                    "forecastPeriods": [
                        {
                            "timePeriod": "Friday",
                            "startTime": "2025-06-27T06:00:00-07:00",
                            "endTime": "2025-06-27T18:00:00-07:00",
                            "forecastText": "Sunny, with a high near 67. Southwest wind 5 to 15 mph, with gusts as high as 25 mph.",
                            "icon": "https://api.weather.gov/icons/land/day/skc?size=small"
                        },
                        {
                            "timePeriod": "Friday Night",
                            "startTime": "2025-06-27T18:00:00-07:00",
                            "endTime": "2025-06-28T06:00:00-07:00",
                            "forecastText": "Mostly clear, with a low around 45. West southwest wind 5 to 15 mph, with gusts as high as 25 mph.",
                            "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                        }
                    ]
                },
                {
                    "mileNumber": 811,
                    "latitude": 36.9578467910001,
                    "longitude": -118.436660944,
                    "direction": "Northbound",
                    "elevationFeet": 10874,
                    "forecastPeriods": [
                        {
                            "timePeriod": "Saturday",
                            "startTime": "2025-06-28T06:00:00-07:00",
                            "endTime": "2025-06-28T18:00:00-07:00",
                            "forecastText": "Sunny, with a high near 64. South southwest wind 5 to 10 mph, with gusts as high as 20 mph.",
                            "icon": "https://api.weather.gov/icons/land/day/skc?size=small"
                        },
                        {
                            "timePeriod": "Saturday Night",
                            "startTime": "2025-06-28T18:00:00-07:00",
                            "endTime": "2025-06-29T06:00:00-07:00",
                            "forecastText": "Mostly clear, with a low around 43. West southwest wind 5 to 10 mph, with gusts as high as 20 mph.",
                            "icon": "https://api.weather.gov/icons/land/night/few?size=small"
                        }
                    ]
                }
            ]
        );
    }
}