const { executeQuery } = require('../../config/database');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // For demo purposes, we'll use a placeholder userId
  // In a real implementation, you would extract this from the JWT token
  const userId = 1; // Placeholder

  if (req.method === 'GET') {
    try {
      const users = await executeQuery(
        'SELECT id, name, email, role, avatar_url, bio, phone, date_of_birth FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user: users[0] }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, bio, phone, date_of_birth } = req.body;

      // Update user profile
      await executeQuery(
        'UPDATE users SET name = ?, bio = ?, phone = ?, date_of_birth = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, bio, phone, date_of_birth, userId]
      );

      // Get updated user data
      const users = await executeQuery(
        'SELECT id, name, email, role, avatar_url, bio, phone, date_of_birth FROM users WHERE id = ?',
        [userId]
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: users[0] }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
};