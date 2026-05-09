const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const crypto = require('crypto');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase(), hashedPassword, phone || null]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase(), name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: { 
          id: userId, 
          name, 
          email: email.toLowerCase(),
          phone: phone || null
        },
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const users = await query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const user = users[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          phone: user.phone || null
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login', 
      error: error.message 
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const users = await query(
      'SELECT id, email FROM users WHERE email = ?', 
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return res.json({ 
        success: true, 
        message: 'If account exists, reset link has been sent to your email' 
      });
    }

    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 86400000);

    await query(
      'DELETE FROM password_resets WHERE email = ?',
      [user.email]
    );

    await query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
      [user.email, resetToken, expiresAt]
    );

    console.log('✅ Reset token created:', {
      email: user.email,
      token: resetToken,
      expiresAt: expiresAt
    });

    res.json({
      success: true,
      message: 'If account exists, reset link has been sent to your email',
      ...(process.env.NODE_ENV === 'development' && { 
        data: { 
          token: resetToken,
          expiresAt: expiresAt,
          email: user.email
        } 
      })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    console.log('🔍 Attempting to reset password with token:', token);

    // Find token WITHOUT expiry check in SQL
    const tokens = await query(
      'SELECT * FROM password_resets WHERE token = ?',
      [token]
    );

    console.log('📊 Token lookup result:', tokens.length > 0 ? 'FOUND' : 'NOT FOUND');

    if (tokens.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid reset token. Token not found in database.' 
      });
    }

    const resetToken = tokens[0];
    
    // Check expiry manually in JavaScript
    const now = new Date();
    const expiresAt = new Date(resetToken.expires_at);
    
    console.log('⏰ Token expiry check:', {
      now: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isExpired: now > expiresAt
    });

    if (now > expiresAt) {
      await query('DELETE FROM password_resets WHERE token = ?', [token]);
      
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token has expired. Please request a new one.' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, resetToken.email]
    );

    await query(
      'DELETE FROM password_resets WHERE token = ?',
      [token]
    );

    console.log('✅ Password reset successful for:', resetToken.email);

    res.json({ 
      success: true, 
      message: 'Password reset successfully. You can now login with your new password.' 
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

exports.logout = async (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
};