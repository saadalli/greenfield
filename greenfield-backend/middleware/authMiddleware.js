// ============================================
// AUTHENTICATION MIDDLEWARE
// JWT token verification for protected routes
// ============================================

const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token from request headers
 * Usage: Add this middleware to protected routes
 * Example: router.get('/profile', authenticateToken, controller.getProfile)
 */
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  // Expected format: "Bearer YOUR_TOKEN_HERE"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "

  // If no token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    // Verify token using JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request object for use in route handlers
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };
    
    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

/**
 * Optional authentication - doesn't fail if token is missing
 * Useful for routes that work both with and without authentication
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      };
    } catch (error) {
      // Token invalid but we don't return error
      console.log('Optional auth: Invalid token, continuing as guest');
    }
  }
  
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};