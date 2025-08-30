import { executeQuery } from '../config/database';

export default async function handler(req, res) {
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
}