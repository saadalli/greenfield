// ============================================
// AXIOS BASE CONFIGURATION
// Centralized Axios setup for all API calls
// ============================================

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - Change this to your production URL
const API_BASE_URL = 'http://localhost:3000/api';
// For testing on physical device, use your computer's IP:
// const API_BASE_URL = 'http://192.168.1.100:3000/api';
// For production:
// const API_BASE_URL = 'https://yourdomain.com/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR
// Automatically add auth token to requests
// ============================================
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        // Add token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// Handle common response scenarios
// ============================================
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful response
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          console.log('Session expired, clearing token...');
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('userData');
          // You can also trigger navigation to login screen here
          break;
          
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 500:
          // Server error
          console.error('Server error');
          break;
      }
      
      // Return error data from server
      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        success: false,
        message: 'No response from server. Please check your internet connection.'
      });
    } else {
      // Something else happened
      return Promise.reject({
        success: false,
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Store auth token
 */
export const setAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    console.log('Auth token stored');
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

/**
 * Get auth token
 */
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Remove auth token (logout)
 */
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    console.log('Auth token removed');
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

/**
 * Store user data
 */
export const setUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    console.log('User data stored');
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Get user data
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export default axiosInstance;