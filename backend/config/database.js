const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration - updated for Vercel compatibility
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'scriptsync',
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  // Vercel-specific settings
  connectionLimit: 1,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// For Vercel serverless functions, we'll create a new connection for each request
// rather than using a connection pool
const createConnection = async () => {
  return await mysql.createConnection(dbConfig);
};

// Execute query with error handling - creates a new connection for each query
const executeQuery = async (query, params = []) => {
  let connection;
  try {
    connection = await createConnection();
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Test connection function
const testConnection = async () => {
  let connection;
  try {
    connection = await createConnection();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  createConnection,
  testConnection,
  executeQuery
};