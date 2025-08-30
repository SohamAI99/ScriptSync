module.exports = async function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'ScriptSync Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};