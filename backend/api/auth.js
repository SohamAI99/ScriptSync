const { executeQuery } = require('../config/database');

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

  // Health check endpoint
  if (req.method === 'GET' && req.url === '/api/health') {
    res.status(200).json({
      success: true,
      message: 'Backend API is running',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Simple test endpoint
  if (req.method === 'GET' && req.url === '/api/test') {
    try {
      // Test database connection
      const result = await executeQuery('SELECT 1 as test');
      res.status(200).json({
        success: true,
        message: 'Database connection successful',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message
      });
    }
    return;
  }

  // Default response for unmatched routes
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
};