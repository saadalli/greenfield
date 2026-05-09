// ============================================
// LOCATION API
// All location management API calls
// ============================================

import axiosInstance from './axiosConfig';

/**
 * ADD LOCATION - Add new user location
 * @param {Object} locationData - Location details
 * @returns {Promise} Created location
 * 
 * Usage:
 * const response = await addLocation({
 *   city: 'Islamabad',
 *   area: 'DHA',
 *   sector: 'Phase 2',
 *   streetNumber: '5',
 *   propertyType: 'house',
 *   houseNumber: '123'
 * });
 */
export const addLocation = async (locationData) => {
  try {
    const response = await axiosInstance.post('/location/add', locationData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * GET LOCATIONS - Fetch all user locations
 * @returns {Promise} List of locations
 * 
 * Usage:
 * const response = await getLocations();
 * console.log(response.data.locations);
 */
export const getLocations = async () => {
  try {
    const response = await axiosInstance.get('/location/list');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * GET DEFAULT LOCATION - Fetch user's default location
 * @returns {Promise} Default location
 * 
 * Usage:
 * const response = await getDefaultLocation();
 * console.log(response.data.location);
 */
export const getDefaultLocation = async () => {
  try {
    const response = await axiosInstance.get('/location/default');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * SET DEFAULT LOCATION - Set a location as default
 * @param {number} locationId - Location ID
 * @returns {Promise} Updated location
 * 
 * Usage:
 * const response = await setDefaultLocation(5);
 */
export const setDefaultLocation = async (locationId) => {
  try {
    const response = await axiosInstance.put(`/location/set-default/${locationId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * UPDATE LOCATION - Update existing location
 * @param {number} locationId - Location ID
 * @param {Object} locationData - Updated location data
 * @returns {Promise} Updated location
 * 
 * Usage:
 * const response = await updateLocation(5, {
 *   city: 'Islamabad',
 *   area: 'DHA',
 *   sector: 'Phase 3',
 *   streetNumber: '10',
 *   propertyType: 'apartment',
 *   houseNumber: '456'
 * });
 */
export const updateLocation = async (locationId, locationData) => {
  try {
    const response = await axiosInstance.put(`/location/update/${locationId}`, locationData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * DELETE LOCATION - Delete a location
 * @param {number} locationId - Location ID
 * @returns {Promise} API response
 * 
 * Usage:
 * const response = await deleteLocation(5);
 */
export const deleteLocation = async (locationId) => {
  try {
    const response = await axiosInstance.delete(`/location/delete/${locationId}`);
    return response;
  } catch (error) {
    throw error;
  }
};