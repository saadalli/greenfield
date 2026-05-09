// ============================================
// USER ROUTES
// Define all user profile-related API endpoints
// ============================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/user/profile
 * Get current user profile
 * Headers: Authorization: Bearer TOKEN
 */
router.get('/profile', userController.getProfile);

/**
 * PUT /api/user/profile
 * Update user profile
 * Body: { name, phone }
 * Headers: Authorization: Bearer TOKEN
 */
router.put('/profile', userController.updateProfile);

/**
 * POST /api/user/change-password
 * Change user password
 * Body: { currentPassword, newPassword }
 * Headers: Authorization: Bearer TOKEN
 */
router.post('/change-password', userController.changePassword);

/**
 * DELETE /api/user/account
 * Delete user account (soft delete)
 * Headers: Authorization: Bearer TOKEN
 */
router.delete('/account', userController.deleteAccount);

module.exports = router;