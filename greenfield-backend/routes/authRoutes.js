// ============================================
// AUTHENTICATION ROUTES
// Define all auth-related API endpoints
// ============================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

/**
 * POST /api/auth/signup
 * Register new user
 * Body: { name, email, password, phone }
 */
router.post('/signup', 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty()
  ],
  authController.signup
);

/**
 * POST /api/auth/login
 * Login user
 * Body: { email, password }
 */
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.login
);

/**
 * POST /api/auth/forgot-password
 * Request password reset
 * Body: { email }
 */
router.post('/forgot-password',
  [
    body('email').isEmail().normalizeEmail()
  ],
  authController.forgotPassword
);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 * Body: { token, newPassword }
 */
router.post('/reset-password',
  [
    body('token').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  authController.resetPassword
);

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', authController.logout);

module.exports = router;