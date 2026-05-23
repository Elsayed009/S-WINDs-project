const joi = require('joi');

const registerSchema = joi.object({
    name: joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    role: joi.string().valid('user', 'fleet_manager').default('user'),
    vehicleType: joi.string().valid('car', 'motorcycle', 'truck').default('car')
});

const loginSchema = joi.object({
    email:joi.string().email().required(),
    password: joi.string.required(),
});


const planRouteSchema = Joi.object({
  origin: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    address: Joi.string().optional(),
  }).required(),
  destination: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    address: Joi.string().optional(),
  }).required(),
  vehicleType: Joi.string().valid('car', 'motorcycle', 'truck').default('car'),
  departureTime: Joi.date().iso().optional(),
});

module.exports = { registerSchema, loginSchema, planRouteSchema };