const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG and GIF images are allowed'));
    }
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await executeQuery(
      'SELECT id, name, email, role, avatar_url, bio, phone, date_of_birth, ' +
      'two_factor_enabled, email_notifications, push_notifications, ' +
      'collaboration_alerts, weekly_digest, theme, autosave_interval, ' +
      'created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user: user[0] }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('phone').optional().trim().isMobilePhone().withMessage('Invalid phone number'),
  body('date_of_birth').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, bio, phone, date_of_birth } = req.body;
    const updates = {};
    const params = [];

    if (name !== undefined) {
      updates.name = name;
      params.push(name);
    }
    if (bio !== undefined) {
      updates.bio = bio;
      params.push(bio);
    }
    if (phone !== undefined) {
      updates.phone = phone;
      params.push(phone);
    }
    if (date_of_birth !== undefined) {
      updates.date_of_birth = date_of_birth;
      params.push(date_of_birth);
    }

    if (params.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    params.push(req.user.id);

    await executeQuery(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    // Get updated user data
    const user = await executeQuery(
      'SELECT id, name, email, role, avatar_url, bio, phone, date_of_birth FROM users WHERE id = ?',
      [req.user.id]
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'profile_update', JSON.stringify(updates)]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: user[0] }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user settings
router.put('/settings', [
  body('email_notifications').optional().isBoolean(),
  body('push_notifications').optional().isBoolean(),
  body('collaboration_alerts').optional().isBoolean(),
  body('weekly_digest').optional().isBoolean(),
  body('theme').optional().isIn(['light', 'dark', 'auto']),
  body('autosave_interval').optional().isInt({ min: 10, max: 300 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      email_notifications,
      push_notifications,
      collaboration_alerts,
      weekly_digest,
      theme,
      autosave_interval
    } = req.body;

    const updates = {};
    const params = [];

    if (email_notifications !== undefined) {
      updates.email_notifications = email_notifications;
      params.push(email_notifications);
    }
    if (push_notifications !== undefined) {
      updates.push_notifications = push_notifications;
      params.push(push_notifications);
    }
    if (collaboration_alerts !== undefined) {
      updates.collaboration_alerts = collaboration_alerts;
      params.push(collaboration_alerts);
    }
    if (weekly_digest !== undefined) {
      updates.weekly_digest = weekly_digest;
      params.push(weekly_digest);
    }
    if (theme !== undefined) {
      updates.theme = theme;
      params.push(theme);
    }
    if (autosave_interval !== undefined) {
      updates.autosave_interval = autosave_interval;
      params.push(autosave_interval);
    }

    if (params.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid settings to update'
      });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    params.push(req.user.id);

    await executeQuery(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'settings_update', JSON.stringify(updates)]
    );

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Upload avatar
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update user avatar URL
    await executeQuery(
      'UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [avatarUrl, req.user.id]
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'avatar_update', JSON.stringify({ filename: req.file.filename })]
    );

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatar_url: avatarUrl }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file upload'
    });
  }
});

// Change password
router.put('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const user = await executeQuery(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await executeQuery(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, req.user.id]
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [req.user.id, 'password_change', JSON.stringify({}), req.ip]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user activity logs
router.get('/activity', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const activities = await executeQuery(
      'SELECT action, details, ip_address, created_at FROM activity_logs ' +
      'WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.user.id, limit, offset]
    );

    const totalCount = await executeQuery(
      'SELECT COUNT(*) as count FROM activity_logs WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          pages: Math.ceil(totalCount[0].count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;