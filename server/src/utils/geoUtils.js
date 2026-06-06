

const ngeohash = require('ngeohash');

const encodeGeohash = (lat, lng, precision = 5) => { //best precision for is is = 9, cause it = 5meter in ground
    return ngeohash.encode(lat, lng, precision);
};

const roundToNearest30Min = (date)=> {
    const ms = 30 * 60 *1000;
    return new Date(Math.round(date.getTime()/ms)*ms);
};

const calculateSafeSpeed = (weatherData, vehicleType) => {
    const {condition, windSpeed, visibility, precipitation} = weatherData;

    const baseSpeed = { car:120, motorcycle: 100, truck: 90} [vehicleType] || 120;
    let speedLimit = baseSpeed;

    if (condition === 'fog' || visibility < 200) speedLimit = Math.min(speedLimit, 40);
    else if (visibility< 500) speedLimit = Math.min(speedLimit, 60);

    if (condition === 'sandstorm') speedLimit = Math.min(speedLimit, 30);
    if (precipitation>10) speedLimit = Math.min(speedLimit, 60);
    else if (precipitation >2) speedLimit = Math.min(speedLimit, 80);

    if (vehicleType === 'motorcycle' && windSpeed >40) speedLimit = Math.min(speedLimit, 60);
    if (vehicleType === 'truck' && windSpeed >50) speedLimit = Math.min(speedLimit, 70);
return speedLimit;
};

const calculateRiskLevel = (weatherData, vehicleType) => {
    const safeSpeed = calculateSafeSpeed(weatherData, vehicleType);
    const {condition} = weatherData;

        if (condition === 'sandstorm' || safeSpeed <= 40) return 'high';
        if (condition === 'fog' || safeSpeed <= 70) return 'medium';
        return 'low';
};

module.exports = {
    encodeGeohash,
    roundToNearest30Min,
    calculateRiskLevel,
    calculateSafeSpeed,
};