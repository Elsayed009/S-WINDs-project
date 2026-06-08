const Trip = require('../models/Trip');

const {getRoute, sampleWaypoints} = require('../services/mapService');
const {getWeatherForLocationAndTime} = require('../services/weatherService');
const {calculateSafeSpeed, calculateRiskLevel} = require('../utils/geoUtils');

const planRoute = async (req, res, next) => {
    try{

        const {origin, destination, vehicleType, departureTime} = req.body;
        const departure = departureTime ? new Date(departureTime) : new Date();

        const route = await getRoute(
            origin.lat, origin.lng,
            destination.lat, destination.lng
        );

        const rawWaypoints = sampleWaypoints(
            route.coordinates,
            route.durationMin,
            departure
        );

        const waypointsWithWeather = await Promise.all(
            rawWaypoints.map(async(wp)=> {
                const weather = await getWeatherForLocationAndTime(wp.lat, wp.lng, wp.eta);
                const safeSpeed = calculateSafeSpeed(weather, vehicleType|| 'car');
                const riskLevel = calculateRiskLevel(weather, vehicleType || 'car');

                return {
                    location: {lat: wp.lat, lng: wp.lng},
                    eta: wp.eta,
                    distanceFromStart: wp.distanceFromStart,
                    weather: {...weather, riskLevel},
                    safeSpeed,
                };
            })
        );
        const riskLevels = waypointsWithWeather.map((wp)=> wp.weather.riskLevel);
        const overallRisk = riskLevels.includes('high')
        ? 'high'
        : riskLevels.includes('medium')
        ? 'medium'
        : 'low';

        const trip = await Trip.create({
            userId: req.user._id,
            origin,
            destination,
            vehicleType: vehicleType || 'car',
            departureTime: departure,
            totalDistanceKm: route.distanceKm, 
            totalDurationMin: route.durationMin,
            waypoints: waypointsWithWeather, 
            overallRiskLevel: overallRisk,
        });
    res.status(200).json({
        success: true,
        trip: {
            id: trip._id,
            totalDistanceKm: route.distanceKm,
            totalDurationMin: route.durationMin,
            overallRiskLevel: overallRisk,
            waypoints: waypointsWithWeather,
        },
    });
    }catch (err){
        next(err);
    }
};


const getTripHistory = async (req, res, next) => {
    try{
        const trips = await Trip.find({userId: req.user._id})
        .sort({createdAt: -1})
        .limit(10)
        .select('-waypoints');

        res.status(200).json({success: true, trips});

    }catch(err) {
        next(err);
    };

}
module.exports = {planRoute, getTripHistory};