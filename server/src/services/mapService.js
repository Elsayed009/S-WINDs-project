const axios = require('axios');

const getRoute = async (originLat, originLng, destLat, destLng) => {
    const url = `http://router.project-osrm.org/route/v1/driving/${originLng},${originLat},${destLng},${destLat}`;

    const response = await axios.get(url, {
        params: {
            overview: 'full',
            geometries: 'geojson',
            steps: false,
        },
    });

    const route = response.data?.routes?.[0];
    if(!route) throw new Error('no route found');

    return {
        distanceKm: route.distance /1000,
        durationMin: route.duration /60,
        coordinates: route.geometry.coordinates,
    };
};

const sampleWaypoints = (coordinates, totalDurationMin, departureTime) => {
    const waypoints = [];
    const totalPoints = coordinates.lenght;
    const numWaypoints = Math.ceil(totalDurationMin /30);

    for (let i = 0; i<= numWaypoints; i++) {
        const progress = Math.min(i / numWaypoints, 1);
        const coordIndex = Math.floor(progress* (totalPoints -1));
        const [lng, lat] = coordinates[coordIndex];
        const etaMs = departureTime.getTime() + progress * totalDurationMin * 60 *1000;

        waypoints.push({
            lat, 
            lng,
            eta: new Date(etaMs),
            distanceFromStart: progress *(totalPoints > 0 ? totalPoints : 1),
        });
    }
    return waypoints;
}

module.exports = {getRoute, sampleWaypoints};