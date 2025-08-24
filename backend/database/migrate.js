const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

const createDatabase = `CREATE DATABASE IF NOT EXISTS scriptsync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;

const createTables = `
USE scriptsync;

-- Users table
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
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
);

-- Scripts table
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
  INDEX idx_category (category),
  INDEX idx_privacy (privacy),
  INDEX idx_created_at (created_at),
  FULLTEXT idx_content (title, content)
);

-- Collaborators table
CREATE TABLE IF NOT EXISTS collaborators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  script_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('editor', 'viewer', 'commenter') DEFAULT 'viewer',
  permissions JSON,
  invited_by INT NOT NULL,
  status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  joined_at TIMESTAMP NULL,
  last_active TIMESTAMP NULL,
  cursor_position JSON,
  is_online BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (script_id) REFERENCES scripts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_script_user (script_id, user_id),
  INDEX idx_script_id (script_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  script_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  line_number INT,
  position_start INT,
  position_end INT,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by INT NULL,
  resolved_at TIMESTAMP NULL,
  parent_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (script_id) REFERENCES scripts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
  INDEX idx_script_id (script_id),
  INDEX idx_user_id (user_id),
  INDEX idx_parent_id (parent_id),
  INDEX idx_line_number (line_number),
  INDEX idx_created_at (created_at)
);

-- Script versions/commits table
CREATE TABLE IF NOT EXISTS script_versions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  script_id INT NOT NULL,
  user_id INT NOT NULL,
  version_number INT NOT NULL,
  content LONGTEXT NOT NULL,
  commit_message VARCHAR(500),
  changes_summary JSON,
  hash VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (script_id) REFERENCES scripts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_script_version (script_id, version_number),
  INDEX idx_script_id (script_id),
  INDEX idx_user_id (user_id),
  INDEX idx_hash (hash),
  INDEX idx_created_at (created_at)
);

-- Share links table
CREATE TABLE IF NOT EXISTS share_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  script_id INT NOT NULL,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  permission ENUM('view', 'comment', 'edit') DEFAULT 'view',
  password_hash VARCHAR(255) NULL,
  expires_at TIMESTAMP NULL,
  view_count INT DEFAULT 0,
  download_count INT DEFAULT 0,
  last_accessed TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (script_id) REFERENCES scripts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_script_id (script_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
);

-- Activity logs table
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
  INDEX idx_script_id (script_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSON,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- Sessions table (for real-time collaboration)
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  script_id INT NULL,
  socket_id VARCHAR(255),
  data JSON,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (script_id) REFERENCES scripts(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_script_id (script_id),
  INDEX idx_expires_at (expires_at)
);
`;

const seedData = `
USE scriptsync;

-- Insert demo users (passwords are hashed versions of 'password123')
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Alex Johnson', 'writer@scriptsync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'writer'),
('Sarah Monitor', 'monitor@scriptsync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'monitor');
`;

async function runMigrations() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Connect to MySQL server (without specifying database)
    const connection = await mysql.createConnection(dbConfig);
    
    // Create database
    console.log('📋 Creating database...');
    await connection.execute(createDatabase);
    console.log('✅ Database created/verified');
    
    // Create tables
    console.log('📋 Creating tables...');
    await connection.execute(createTables);
    console.log('✅ Tables created/verified');
    
    // Seed initial data
    console.log('📋 Seeding initial data...');
    await connection.execute(seedData);
    console.log('✅ Initial data seeded');
    
    await connection.end();
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };