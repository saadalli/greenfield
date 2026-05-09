// ============================================
// USER CONTROLLER
// MySQL-compatible version
// ============================================

const { query } = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * GET PROFILE - Get current user profile
 * GET /api/user/profile
 * Headers: Authorization: Bearer TOKEN
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user data
    const users = await query(
      'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Get user's default location if user_locations table exists
    let location = null;
    try {
      const locations = await query(
        'SELECT * FROM user_locations WHERE user_id = ? AND is_default = 1 LIMIT 1',
        [userId]
      );
      location = locations.length > 0 ? locations[0] : null;
    } catch (err) {
      // Table might not exist yet
      console.log('user_locations table not found');
    }

    res.json({
      success: true,
      data: {
        user,
        location
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * UPDATE PROFILE - Update user profile
 * PUT /api/user/profile
 * Body: { name, phone }
 * Headers: Authorization: Bearer TOKEN
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }

    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(userId); // Add userId as last parameter

    // Update user
    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated user data
    const users = await query(
      'SELECT id, name, email, phone FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: users[0]
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * CHANGE PASSWORD - Update user password
 * POST /api/user/change-password
 * Body: { currentPassword, newPassword }
 * Headers: Authorization: Bearer TOKEN
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user's current password
    const users = await query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, users[0].password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * DELETE ACCOUNT - Delete user account
 * DELETE /api/user/account
 * Headers: Authorization: Bearer TOKEN
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user (or you can soft delete by adding a deleted_at column)
    await query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};