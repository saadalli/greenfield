// ============================================
// LOCATION ROUTES
// Define all location management API endpoints
// ============================================

const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateToken);

/**
 * POST /api/location/add
 * Add new location
 * Body: { city, area, sector, streetNumber, propertyType, houseNumber }
 * Headers: Authorization: Bearer TOKEN
 */
router.post('/add', locationController.addLocation);

/**
 * GET /api/location/list
 * Get all user locations
 * Headers: Authorization: Bearer TOKEN
 */
router.get('/list', locationController.getLocations);

/**
 * GET /api/location/default
 * Get default location
 * Headers: Authorization: Bearer TOKEN
 */
router.get('/default', locationController.getDefaultLocation);

/**
 * PUT /api/location/set-default/:locationId
 * Set location as default
 * Headers: Authorization: Bearer TOKEN
 */
router.put('/set-default/:locationId', locationController.setDefaultLocation);

/**
 * PUT /api/location/update/:locationId
 * Update location
 * Body: { city, area, sector, streetNumber, propertyType, houseNumber }
 * Headers: Authorization: Bearer TOKEN
 */
router.put('/update/:locationId', locationController.updateLocation);

/**
 * DELETE /api/location/delete/:locationId
 * Delete location
 * Headers: Authorization: Bearer TOKEN
 */
router.delete('/delete/:locationId', locationController.deleteLocation);

module.exports = router;