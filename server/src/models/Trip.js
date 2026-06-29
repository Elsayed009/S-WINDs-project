const mongoose = require('mongoose');

const waypointSchema = new mongoose.Schema({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  eta: { type: Date, required: true },
  distanceFromStart: { type: Number },
  weather: {
    temperature: Number,
    feelslike: Number,
    windSpeed: Number,
    windDirection: Number,
    windGust: Number,
    precipitation: Number,
    pop: Number,
    humidity: Number,
    pressure: Number,
    visibility: Number,
    clouds: Number,
    uvIndex: Number,
    dewPoint: Number,
    condition: String,
    description: String,
    icon: String,
    riskLevel: String,
  },
  maxSafeSpeed: { type: Number },
}, { _id: false });

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    origin: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: String,
    },
    destination: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: String,
    },
    vehicleType: {
      type: String,
      enum: ['car', 'motorcycle', 'truck'],
      default: 'car',
    },
    departureTime: {
      type: Date,
      default: Date.now,
    },
    totalDistanceKm: Number,
    totalDurationMin: Number,
    waypoints: [waypointSchema],
    routePolyline: [[Number]],
    overallRiskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    status: {
      type: String,
      enum: ['planned', 'active', 'completed'],
      default: 'planned',
    },
  },
  { timestamps: true }
);

tripSchema.index({ userId: 1, createdAt: -1 });

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;