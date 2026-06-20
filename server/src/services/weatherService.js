const axios = require('axios');
const weatherCache = require('../models/WeatherCache');
const { encodeGeohash, roundToNearest30Min } = require('../utils/geoUtils');

const fetchWeatherFromAPI = async (lat, lng, targetTime) => {
    // const response = await axios.get('https://api.tomorrow.io/v4/weather/forecast',{
    const response = await axios.get('https://api.tomorrow.io/v4/timelines',{
     params: {
        location: `${lat},${lng}`, // how tomorrow.io see the location data
        apikey: process.env.TOMORROW_API_KEY,
        timesteps: '1h', // tomorrow.io package limitatin for free '1m', '1h' like enum
        startTime: targetTime.toISOString(), //convert time to golbal string time format (iso string) so all servers can understand it
        endTime: new Date(targetTime.getTime() + 60 * 60 * 1000).toISOString(),
        fields: [
            'temperature',
            'windSpeed',
            'windDirection',
            'precipitationIntensity',
            'visibility',
            'humidity',
            'weatherCode',
        ].join(','),
     },
    });

    // const interval = response.data?.timelines?.hourly?.[0]?.values;
    const interval = response.data?.data?.timelines?.[0]?.intervals?.[0]?.values;
    if(!interval)throw new Error('no weather data returned from API');

    
    // const getCondition = (code) =>{
    //     if( [2000,2100].includes(code)) return 'fog';
    //     if( code >= 4000 && code <= 4201) return 'rain';
    //     if( code >= 5000 && code <= 5101) return 'snow';
    //     if( code === 7102 || code === 7000) return 'sandstorm';
    //     return 'clear';
    // };



    const getCondition = (code) => {
  const weatherCodesMap = {
    // 1- clear and cloudy conditions
    1000: 'clear',           // sunny and completely clear
    1100: 'mostly_clear',    // mostly clear
    1101: 'partly_cloudy',   // partly cloudy
    1102: 'mostly_cloudy',   // mostly cloudy
    1001: 'cloudy',          // completely cloudy

    // 2- fog and mist conditions
    2000: 'fog',             // standard fog
    2100: 'light_fog',       // light fog

    // 3- rain conditions and intensities
    4000: 'drizzle',         // very light drizzle
    4001: 'rain',            // standard rain
    4200: 'light_rain',      // light rain
    4201: 'heavy_rain',      // heavy rain or storm

    // 4- freezing rain and hazardous ice conditions
    6000: 'freezing_drizzle',// freezing drizzle
    6001: 'freezing_rain',   // freezing rain
    6200: 'light_freezing_rain',
    6201: 'heavy_freezing_rain',
    7000: 'ice_pellets',     // small ice pellets
    7101: 'light_ice_pellets',
    7102: 'heavy_ice_pellets',

    // 5- snow conditions
    5000: 'snow',            // standard snow
    5001: 'flurries',        // light snow flurries
    5100: 'light_snow',      // light snow
    5101: 'heavy_snow',      // heavy snow

    // 6- wind and dust storm conditions
    3000: 'light_wind',      // light wind
    3001: 'wind',            // moderate wind
    3002: 'strong_wind',     // strong wind
    7103: 'sandstorm',       // sandstorm
    7107: 'duststorm',       // duststorm

    // 7- convective storm conditions
    8000: 'thunderstorm',    // thunderstorm
  };

  // lookup the condition in the map, fallback to unknown if not found
  return weatherCodesMap[code] || 'unknown';
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
    const cached = await weatherCache.findOne({geohash, forecastTime: roundedTime});
    if (cached) {
        console.log(`cache HII is here: ${geohash} @ ${roundedTime}`);
        return cached.weatherData;
    }

    // if cach is empty get data from apis 
    console.log(`cache i miss: ${geohash} @ ${roundedTime} - calling API`);
    const weatherData = await fetchWeatherFromAPI(lat, lng, roundedTime);

    try {
        // await weatherCache.create({geohash, forecastTime: roundedTime, weatherData});
        await weatherCache.findOneAndUpdate(
            {geohash, forecastTime: roundedTime},
            {geohash, forecastTime: roundedTime, weatherData},
            {upsert: true, new: true}
        );
    }catch(err){
        if (err.code !== 11000) throw err
    }
    //store api getted data in cach 

    return weatherData;
};

module.exports = {getWeatherForLocationAndTime};



