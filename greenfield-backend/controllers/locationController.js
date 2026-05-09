// ============================================
// LOCATION CONTROLLER
// MySQL-compatible version with user validation
// ============================================

const { query, pool } = require('../config/database');

/**
 * ADD LOCATION - Add new user location
 * POST /api/location/add
 * Body: { city, area, sector, streetNumber, propertyType, houseNumber }
 * Headers: Authorization: Bearer TOKEN
 */
exports.addLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { city, area, sector, streetNumber, propertyType, houseNumber } = req.body;

    console.log('🔍 Adding location for user_id:', userId);

    // Check if user exists
    const userCheck = await query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    console.log('👤 User exists:', userCheck.length > 0);

    if (userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please login again to get a new token.'
      });
    }

    // Validation
    if (!city || !area) {
      return res.status(400).json({
        success: false,
        message: 'City and area are required'
      });
    }

    // Build full address string
    const addressParts = [city, area];
    if (sector) addressParts.push(sector);
    if (streetNumber) addressParts.push(`Street ${streetNumber}`);
    
    if (propertyType === 'house' && houseNumber) {
      addressParts.push(`House ${houseNumber}`);
    } else if (propertyType === 'apartment' && houseNumber) {
      addressParts.push(`Apartment ${houseNumber}`);
    }
    
    const fullAddress = addressParts.filter(Boolean).join(', ');

    // Check if user has any locations
    const existingLocations = await query(
      'SELECT id FROM user_locations WHERE user_id = ?',
      [userId]
    );

    // If this is the first location, make it default
    const isDefault = existingLocations.length === 0 ? 1 : 0;

    // Insert new location
    const result = await query(
      `INSERT INTO user_locations 
       (user_id, city, area, sector, street_number, property_type, house_number, full_address, is_default) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, city, area, sector || null, streetNumber || null, propertyType || null, houseNumber || null, fullAddress, isDefault]
    );

    console.log('✅ Location created with ID:', result.insertId);

    // Get the inserted location
    const locations = await query(
      'SELECT * FROM user_locations WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Location added successfully',
      data: {
        location: locations[0]
      }
    });
  } catch (error) {
    console.error('❌ Add location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * GET LOCATIONS - Get all user locations
 * GET /api/location/list
 * Headers: Authorization: Bearer TOKEN
 */
exports.getLocations = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('📋 Getting locations for user_id:', userId);

    const locations = await query(
      'SELECT * FROM user_locations WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );

    console.log('✅ Found', locations.length, 'locations');

    res.json({
      success: true,
      data: {
        locations
      }
    });
  } catch (error) {
    console.error('❌ Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * GET DEFAULT LOCATION - Get user's default location
 * GET /api/location/default
 * Headers: Authorization: Bearer TOKEN
 */
exports.getDefaultLocation = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('🏠 Getting default location for user_id:', userId);

    const locations = await query(
      'SELECT * FROM user_locations WHERE user_id = ? AND is_default = 1 LIMIT 1',
      [userId]
    );

    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No default location found'
      });
    }

    console.log('✅ Default location found:', locations[0].id);

    res.json({
      success: true,
      data: {
        location: locations[0]
      }
    });
  } catch (error) {
    console.error('❌ Get default location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * SET DEFAULT LOCATION - Set a location as default
 * PUT /api/location/set-default/:locationId
 * Headers: Authorization: Bearer TOKEN
 */
exports.setDefaultLocation = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const userId = req.user.id;
    const locationId = req.params.locationId;

    console.log('🔄 Setting default location:', locationId, 'for user:', userId);

    await connection.beginTransaction();

    // Verify location belongs to user
    const [locationCheck] = await connection.execute(
      'SELECT id FROM user_locations WHERE id = ? AND user_id = ?',
      [locationId, userId]
    );

    if (locationCheck.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Location not found or does not belong to you'
      });
    }

    // Remove default from all user locations
    await connection.execute(
      'UPDATE user_locations SET is_default = 0 WHERE user_id = ?',
      [userId]
    );

    // Set new default location
    await connection.execute(
      'UPDATE user_locations SET is_default = 1 WHERE id = ?',
      [locationId]
    );

    await connection.commit();

    console.log('✅ Default location updated successfully');

    // Get updated location
    const locations = await query(
      'SELECT * FROM user_locations WHERE id = ?',
      [locationId]
    );

    res.json({
      success: true,
      message: 'Default location updated',
      data: {
        location: locations[0]
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Set default location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * UPDATE LOCATION - Update existing location
 * PUT /api/location/update/:locationId
 * Body: { city, area, sector, streetNumber, propertyType, houseNumber }
 * Headers: Authorization: Bearer TOKEN
 */
exports.updateLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const locationId = req.params.locationId;
    const { city, area, sector, streetNumber, propertyType, houseNumber } = req.body;

    console.log('✏️ Updating location:', locationId, 'for user:', userId);

    // Verify location belongs to user
    const locationCheck = await query(
      'SELECT id FROM user_locations WHERE id = ? AND user_id = ?',
      [locationId, userId]
    );

    if (locationCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found or does not belong to you'
      });
    }

    // Build full address string
    const addressParts = [city, area];
    if (sector) addressParts.push(sector);
    if (streetNumber) addressParts.push(`Street ${streetNumber}`);
    
    if (propertyType === 'house' && houseNumber) {
      addressParts.push(`House ${houseNumber}`);
    } else if (propertyType === 'apartment' && houseNumber) {
      addressParts.push(`Apartment ${houseNumber}`);
    }
    
    const fullAddress = addressParts.filter(Boolean).join(', ');

    // Update location
    await query(
      `UPDATE user_locations 
       SET city = ?, area = ?, sector = ?, street_number = ?, 
           property_type = ?, house_number = ?, full_address = ?
       WHERE id = ? AND user_id = ?`,
      [city, area, sector || null, streetNumber || null, propertyType || null, houseNumber || null, fullAddress, locationId, userId]
    );

    console.log('✅ Location updated successfully');

    // Get updated location
    const locations = await query(
      'SELECT * FROM user_locations WHERE id = ?',
      [locationId]
    );

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        location: locations[0]
      }
    });
  } catch (error) {
    console.error('❌ Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * DELETE LOCATION - Delete a location
 * DELETE /api/location/delete/:locationId
 * Headers: Authorization: Bearer TOKEN
 */
exports.deleteLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const locationId = req.params.locationId;

    console.log('🗑️ Deleting location:', locationId, 'for user:', userId);

    // Check if location exists and belongs to user
    const locationCheck = await query(
      'SELECT is_default FROM user_locations WHERE id = ? AND user_id = ?',
      [locationId, userId]
    );

    if (locationCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found or does not belong to you'
      });
    }

    const wasDefault = locationCheck[0].is_default;

    // Delete location
    await query(
      'DELETE FROM user_locations WHERE id = ? AND user_id = ?',
      [locationId, userId]
    );

    console.log('✅ Location deleted');

    // If deleted location was default, set another location as default
    if (wasDefault) {
      const remainingLocations = await query(
        'SELECT id FROM user_locations WHERE user_id = ? LIMIT 1',
        [userId]
      );

      if (remainingLocations.length > 0) {
        await query(
          'UPDATE user_locations SET is_default = 1 WHERE id = ?',
          [remainingLocations[0].id]
        );
        console.log('✅ New default location set:', remainingLocations[0].id);
      }
    }

    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};