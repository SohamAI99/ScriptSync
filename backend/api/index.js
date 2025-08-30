import { executeQuery } from '../config/database';

// Simple health check endpoint
export default async function handler(req, res) {
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
  if (req.url === '/' || req.url === '/api/health') {
    res.status(200).json({
      success: true,
      message: 'ScriptSync Backend API is running on Vercel',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    return;
  }
  
  // Database test endpoint
  if (req.url === '/api/test-db') {
    try {
      // Test database connection with a simple query
      const result = await executeQuery('SELECT 1 as connection_test');
      
      res.status(200).json({
        success: true,
        message: 'Database connection successful',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
    return;
  }
  
  // Default response for unmatched routes
  res.status(404).json({
    success: false,
    message: 'Endpoint not found. Please check the API documentation.'
  });
}