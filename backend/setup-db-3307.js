const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    // Connect to MySQL server on port 3307 without password
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3307,
      user: 'root',
      // No password
      multipleStatements: true
    });

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS scriptsync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');

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

    // Create collaborators table
    await connection.execute(`
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
    `);

    // Create comments table
    await connection.execute(`
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
        INDEX idx_parent_id (parent_id)
      );
    `);

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

    await connection.end();
    
  } catch (error) {
    // Database setup failed
  }
};

setupDatabase();