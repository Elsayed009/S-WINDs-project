const axios = require('axios');
const weatherCache = require('../models/WeatherCache');
const { encodeGeohash, roundToNearest30Min } = require('../utils/geoUtils');

const fetchWeatherFromAPI = async (lat, lng, targetTime) => {
    const response = await axios.get('https://api.tomorrow.io/v4/wheather/forecast',{
     params: {
        location: `${lat},${lng}`, // how tomorrow.io see the location data
        apikey: process.env.TOMORROW_API_KEY,
        timesteps: '1h', // tomorrow.io package limitatin for free '1m', '1h' like enum
        startTime: targetTime.toISOString(), //convert time to golbal string time format (iso string) so all servers can understand it
        endTime: new Date(targetTime.getTime()+60+60+1000).toISOString(),
        fields: [
            'temperature',
            'windSpeed',
            'windDirection',
            'precipitationIntensity',
            'visibility',
            'humidity',
            'weatehrCode',
        ].join(','),
     },
    });

    const interval = response.data?.timelines?.hourly?.[0]?.values;
    if(!interval)throw new Error('no weather data returned from API');

    const getCondition = (code) =>{
        if( [2000,2100].includes(code)) return 'fog';
        if( code >= 4000 && code <= 4201) return 'rain';
        if( code >= 5000 && code <= 5101) return 'snow';
        if( code === 7102 || code === 7000) return 'sandstorm';
        return 'clear';
    };
    return {
        temperature: interval.temperature,
        windSpeed:interval.windSpeed,
        windDirection:interval.windDirection,
        precipitation: interval.precipitationIntensity,
        visibility:interval.visibility,
        humidity: interval.humidity,
        condition: getCondition(interval.weatherCode),
    };
};

const getWeatherForLocationAndTime = async (lat, lng, targetTime)=>{
    const geohash = encodeGeohash(lat, lng);
    const roundedTime = roundToNearest30Min(targetTime);

    //search in cach first
    const cached = await weatherCache.findOne({geohash, forcastTime: roundedTime});
    if (cached) {
        console.log(`cache HII is here: ${geohash} @ ${roundedTime}`);
        return cached.weatherData;
    }

    // if cach is empty get data from apis 
    console.log(`cache i miss: ${geohash} @ ${roundedTime} - calling API`);
    const weatherData = await fetchWeatherFromAPI(lat, lng, roundedTime);

    //store api getted data in cach 
    await weatherCache.create({geohash, forcastTime: roundedTime, weatherData});

    return weatherData;
};

module.exports = {getWeatherForLocationAndTime};



