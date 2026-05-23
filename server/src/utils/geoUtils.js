

const ngeohash = require('ngeohash');

const encodeGeohash = (lat, lng, precision = 5) => {
    return ngeohash.encode(lat, lng, precision);
}