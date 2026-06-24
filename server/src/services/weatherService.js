const axios = require('axios');
const weatherCache = require('../models/WeatherCache');
const { encodeGeohash, roundToNearest30Min } = require('../utils/geoUtils');

// Open-Meteo for developement stage cause tommorw is 25req/h limitation

const fetchWeatherFromOpenMeteo = async (lat, lng, targetTime) => {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
            latitude: lat,
            longitude: lng,
            hourly: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,visibility,wind_speed_10m,wind_direction_10m',
            timezone: 'UTC' //    time zone
        }
    });

    const hourly = response.data.hourly;
    
    // (ETA)
    const targetHour = targetTime.toISOString().substring(0, 13) + ":00";
     //  "2026-06-21  fromat T15:00
    let index = hourly.time.findIndex(t => t === targetHour);
    if (index === -1) {
    console.warn(`no exact match for ${targetHour}, falling back to index 0`);
        index = 0; // first value for just check
    }
    // (WMO) convert code nums to words
    const getConditionFromWMO = (code) => {
        if (code === 0) return 'clear';
        if ([1, 2, 3].includes(code)) return 'partly_cloudy';
        if ([45, 48].includes(code)) return 'fog';
        if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
        if ([61, 63, 65, 66, 67].includes(code)) return 'rain';
        if ([71, 73, 75, 77].includes(code)) return 'snow';
        if ([80, 81, 82].includes(code)) return 'heavy_rain';
        if ([95, 96, 99].includes(code)) return 'thunderstorm';
        return 'unknown';
    };

    return {
        temperature: hourly.temperature_2m[index],
        windSpeed: hourly.wind_speed_10m[index],
        windDirection: hourly.wind_direction_10m[index],
        precipitation: hourly.precipitation[index],
        visibility: hourly.visibility[index] / 1000, // 1000 = 1 km
        humidity: hourly.relative_humidity_2m[index],
        condition: getConditionFromWMO(hourly.weather_code[index]),
    };
};

/* 
//  Tomorrow.io code for production

const fetchWeatherFromTomorrowIO = async (lat, lng, targetTime) => {
    const response = await axios.get('https://api.tomorrow.io/v4/timelines', {
        params: {
            location: `${lat},${lng}`,
            apikey: process.env.TOMORROW_API_KEY,
            timesteps: '1h',
            startTime: targetTime.toISOString(),
            endTime: new Date(targetTime.getTime() + 60 * 60 * 1000).toISOString(),
            fields: 'temperature,windSpeed,windDirection,precipitationIntensity,visibility,humidity,weatherCode'
        },
    });

    const interval = response.data?.data?.timelines?.[0]?.intervals?.[0]?.values;
    if (!interval) throw new Error('no weather data returned from API');

    // ...    getCondition    ...

    return {
        temperature: interval.temperature,
        // ...  
    };
};
*/

const getWeatherForLocationAndTime = async (lat, lng, targetTime) => {
    const geohash = encodeGeohash(lat, lng);
    const roundedTime = roundToNearest30Min(targetTime);

    // search in cach first
    const cached = await weatherCache.findOne({ geohash, forecastTime: roundedTime });
    if (cached) {
        console.log(` Cache HIT: ${geohash} @ ${roundedTime}`);
        return cached.weatherData;
    }

    // if cach is empyt then Open-Meteo
    console.log(` API Call (Open-Meteo): ${geohash} @ ${roundedTime}`);
    const weatherData = await fetchWeatherFromOpenMeteo(lat, lng, roundedTime);

    // save data in cach
    try {
        await weatherCache.findOneAndUpdate(
            { geohash, forecastTime: roundedTime },
            { geohash, forecastTime: roundedTime, weatherData },
            { upsert: true, new: true }
        );
    } catch (err) {
        if (err.code !== 11000) throw err;
    }

    return weatherData;
};

module.exports = { getWeatherForLocationAndTime };