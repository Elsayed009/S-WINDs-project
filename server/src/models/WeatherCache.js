const mongoose = require('mongoose');

const weatherCacheSchema = new mongoose.Schema({
    geohash: {
        type: String,
        required: true,
    },
    forecastTime: {
        type: Date,
        required: true,
    },
   weatherData: {
        // Core temperature metrics
        temperature: Number,          // Actual temperature
        feelsLike: Number,            // Apparent (feels like) temperature
        
        // Wind & Precipitation
        windSpeed: Number,            // Wind speed
        windDirection: Number,        // Wind direction in degrees
        windGust: Number,             // Sudden wind gusts
        precipitation: Number,        // Precipitation amount (mm)
        pop: Number,                  // Probability of Precipitation (%)
        
        // Atmosphere & Visibility
        humidity: Number,             // Humidity percentage %
        pressure: Number,             // Atmospheric pressure (hPa)
        visibility: Number,           // Visibility range (meters or km)
        clouds: Number,               // Cloudiness percentage %
        uvIndex: Number,              // UV Index
        dewPoint: Number,             // Dew point
        
        // Descriptions & Assets
        condition: String,            // Main weather group (e.g., Rain, Clear, Clouds)
        description: String,          // Detailed weather description
        icon: String,                 // Icon code from the API provider for frontend rendering

        // System risk assessment
        // weatherData: mongoose.Schema.Types.Mixed, flix data apis
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high']
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800,
    },
});

weatherCacheSchema.index({geohash: 1, forecastTime:1}, {unique: true});

const WeatherCache =  mongoose.model('WeatherCache', weatherCacheSchema);
module.exports = WeatherCache;
