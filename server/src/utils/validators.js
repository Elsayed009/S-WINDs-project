const joi = require('joi');

const registerSchema = joi.object({
    name: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
    role: joi.string().valid('user', 'fleet_manager').default('user'),
    vehicleType: joi.string().valid('car', 'motorcycle', 'truck').default('car')
});

const loginSchema = joi.object({
    email:joi.string().email().required(),
    password: joi.string().required(),
});


const planRouteSchema = joi.object({
  origin: joi.object({
    lat: joi.number().required(),
    lng: joi.number().required(),
    address: joi.string().optional(),
  }).required(),
  destination: joi.object({
    lat: joi.number().required(),
    lng: joi.number().required(),
    address: joi.string().optional(),
  }).required(),
  vehicleType: joi.string().valid('car', 'motorcycle', 'truck').default('car'),
  departureTime: joi.date().iso().optional(),
});

module.exports = { registerSchema, loginSchema, planRouteSchema };