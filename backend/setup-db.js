const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up ScriptSync database...');
    
    // First, try to connect without password for initial setup
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      // Try without password first
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS scriptsync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.log('✅ Database "scriptsync" created/verified');

    // Use the database
    await connection.execute('USE scriptsync;');

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('writer', 'monitor') DEFAULT 'writer',
        avatar_url VARCHAR(500),
        bio TEXT,
        phone VARCHAR(20),
        date_of_birth DATE,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        email_notifications BOOLEAN DEFAULT TRUE,
        push_notifications BOOLEAN DEFAULT FALSE,
        collaboration_alerts BOOLEAN DEFAULT TRUE,
        weekly_digest BOOLEAN DEFAULT TRUE,
        theme VARCHAR(20) DEFAULT 'dark',
        autosave_interval INT DEFAULT 30,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      );
    `);
    console.log('✅ Users table created');

    // Create scripts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS scripts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT,
        category ENUM('screenplay', 'stage-play', 'tv-episode', 'short-film', 'web-series', 'documentary', 'commercial', 'other') NOT NULL,
        status ENUM('draft', 'in-progress', 'review', 'completed', 'archived') DEFAULT 'draft',
        privacy ENUM('private', 'shared', 'public') DEFAULT 'private',
        tags JSON,
        settings JSON,
        user_id INT NOT NULL,
        pages INT DEFAULT 1,
        word_count INT DEFAULT 0,
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_category (category)
      );
    `);
    console.log('✅ Scripts table created');

    // Create activity_logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        script_id INT NULL,
        action VARCHAR(100) NOT NULL,
        details JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (script_id) REFERENCES scripts(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_action (action)
      );
    `);
    console.log('✅ Activity logs table created');

    await connection.end();
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. The API will be available at http://localhost:3001');
    console.log('3. Check the health endpoint: http://localhost:3001/health');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('');
    console.log('If you get authentication errors, please:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Update the DB_PASSWORD in .env file if your MySQL has a password');
    console.log('3. Or run: mysql -u root -p and then manually create the database');
  }
};

setupDatabase();