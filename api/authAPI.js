// ============================================
// AUTHENTICATION API
// All auth-related API calls
// ============================================

import axiosInstance, { setAuthToken, setUserData, removeAuthToken } from './axiosConfig';

/**
 * SIGNUP - Register new user
 * @param {Object} userData - { name, email, password, phone }
 * @returns {Promise} API response
 * 
 * Usage:
 * const response = await signup({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'password123',
 *   phone: '+923001234567'
 * });
 */
export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    
    if (response.success && response.data.token) {
      // Store token and user data
      await setAuthToken(response.data.token);
      await setUserData(response.data.user);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * LOGIN - Authenticate user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} API response with token
 * 
 * Usage:
 * const response = await login('john@example.com', 'password123');
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password
    });
    
    if (response.success && response.data.token) {
      // Store token and user data
      await setAuthToken(response.data.token);
      await setUserData(response.data.user);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * FORGOT PASSWORD - Request password reset
 * @param {string} email - User email
 * @returns {Promise} API response
 * 
 * Usage:
 * const response = await forgotPassword('john@example.com');
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', {
      email
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * RESET PASSWORD - Reset password with token
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @returns {Promise} API response
 * 
 * Usage:
 * const response = await resetPassword('reset-token-123', 'newPassword123');
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * LOGOUT - Clear auth token
 * @returns {Promise} API response
 * 
 * Usage:
 * await logout();
 */
export const logout = async () => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    
    // Remove token and user data from storage
    await removeAuthToken();
    
    return response;
  } catch (error) {
    // Even if API call fails, remove local token
    await removeAuthToken();
    throw error;
  }
};

/**
 * CHECK AUTH STATUS - Verify if user is authenticated
 * @returns {boolean} True if token exists
 * 
 * Usage:
 * const isAuthenticated = await checkAuthStatus();
 */
export const checkAuthStatus = async () => {
  try {
    const { getAuthToken } = await import('./axiosConfig');
    const token = await getAuthToken();
    return !!token;
  } catch (error) {
    return false;
  }
};