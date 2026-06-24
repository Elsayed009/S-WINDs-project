const express = require('express');
const {planRoute, getTripHistory, getTripById}= require('../controllers/routeController');
const {protect}= require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMIddleware');
const {planRouteSchema} = require('../utils/validators');

const router = express.Router();

router.post('/plan', protect, validate(planRouteSchema), planRoute);
router.get('/history', protect, getTripHistory);
router.get('/:tripId', protect, getTripById);

module.exports = router;