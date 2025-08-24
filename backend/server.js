const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const scriptRoutes = require('./routes/scripts');
const collaborationRoutes = require('./routes/collaboration');

// Import middleware
const { authMiddleware } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// Import database connection
const db = require('./config/database');

// Import socket handlers
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:4028",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:4028",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/scripts', authMiddleware, scriptRoutes);
app.use('/api/collaboration', authMiddleware, collaborationRoutes);

// Socket.IO integration
socketHandler(io);

// Make io available to routes
app.set('io', io);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 3001;

// Test database connection before starting server
db.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
    
    server.listen(PORT, () => {
      console.log(`🚀 ScriptSync Backend Server running on port ${PORT}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:4028'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`✅ Database: Connected`);
      console.log(`⚡ Socket.IO: Real-time collaboration ready`);
      console.log(`📡 Socket CORS: ${process.env.SOCKET_CORS_ORIGIN || process.env.FRONTEND_URL}`);
      console.log(``);
      console.log(`🎯 Test URLs:`);
      console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:4028'}`);
      console.log(`   API Health: http://localhost:${PORT}/health`);
      console.log(`   phpMyAdmin: http://localhost/phpmyadmin`);
      console.log(``);
      console.log(`✅ Ready for real-time collaborative script editing!`);
    });
  })
  .catch(error => {
    console.log('⚠️  Database connection failed:', error.message);
    console.log('📋 Starting server without database for testing...');
    
    server.listen(PORT, () => {
      console.log(`🚀 ScriptSync Backend Server running on port ${PORT}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:4028'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`⚠️  Database: Not connected - some features may not work`);
      console.log('');
      console.log('To set up the database:');
      console.log('1. Install MySQL and start the service');
      console.log('2. Update DB_PASSWORD in .env if needed');
      console.log('3. Import scriptsync_schema.sql into phpMyAdmin');
    });
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Gracefully shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    db.end(() => {
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;