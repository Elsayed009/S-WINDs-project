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
        temprature: Number,
        windSpeed: Number,
        windDirection: Number,
        precipitation: Number,
        visibility: Number,
        condeition: String,
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

weatherCacheSchema.index({geohash: 1, forcastTime:1}, {unique: true});

const WeatherCache =  mongoose.model('WeatherCache', weatherCacheSchema);
module.exports = WeatherCache;
