const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery, executeTransaction } = require('../config/database');
const crypto = require('crypto');

const router = express.Router();

// Get all scripts for user
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';

    let whereClause = 'WHERE (s.user_id = ? OR c.user_id = ?)';
    let params = [req.user.id, req.user.id];

    if (search) {
      whereClause += ' AND (s.title LIKE ? OR s.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      whereClause += ' AND s.category = ?';
      params.push(category);
    }

    if (status) {
      whereClause += ' AND s.status = ?';
      params.push(status);
    }

    const scripts = await executeQuery(
      `SELECT DISTINCT s.id, s.title, s.category, s.status, s.privacy, s.tags, 
       s.pages, s.word_count, s.created_at, s.updated_at, s.last_modified,
       u.name as owner_name, u.email as owner_email,
       CASE WHEN s.user_id = ? THEN 'owner' ELSE c.role END as user_role
       FROM scripts s
       LEFT JOIN users u ON s.user_id = u.id
       LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
       ${whereClause}
       ORDER BY s.last_modified DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, req.user.id, ...params, limit, offset]
    );

    const totalCount = await executeQuery(
      `SELECT COUNT(DISTINCT s.id) as count
       FROM scripts s
       LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
       ${whereClause}`,
      [req.user.id, ...params]
    );

    res.json({
      success: true,
      data: {
        scripts,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          pages: Math.ceil(totalCount[0].count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get scripts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single script
router.get('/:id', async (req, res) => {
  try {
    const scriptId = req.params.id;

    // Check if user has access to this script
    const access = await executeQuery(
      `SELECT s.*, u.name as owner_name, u.email as owner_email,
       CASE 
         WHEN s.user_id = ? THEN 'owner'
         WHEN c.user_id = ? THEN c.role
         ELSE NULL
       END as user_role
       FROM scripts s
       LEFT JOIN users u ON s.user_id = u.id
       LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
       WHERE s.id = ? AND (s.user_id = ? OR c.user_id = ?)`,
      [req.user.id, req.user.id, req.user.id, scriptId, req.user.id, req.user.id]
    );

    if (access.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Script not found or access denied'
      });
    }

    const script = access[0];

    // Get collaborators
    const collaborators = await executeQuery(
      `SELECT c.id, c.role, c.permissions, c.status, c.last_active, c.is_online,
       u.id as user_id, u.name, u.email, u.avatar_url
       FROM collaborators c
       JOIN users u ON c.user_id = u.id
       WHERE c.script_id = ?`,
      [scriptId]
    );

    script.collaborators = collaborators;

    res.json({
      success: true,
      data: { script }
    });
  } catch (error) {
    console.error('Get script error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new script
router.post('/', [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('category').isIn(['screenplay', 'stage-play', 'tv-episode', 'short-film', 'web-series', 'documentary', 'commercial', 'other']).withMessage('Invalid category'),
  body('privacy').optional().isIn(['private', 'shared', 'public']).withMessage('Invalid privacy setting'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('settings').optional().isObject().withMessage('Settings must be an object')
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

    const { title, category, privacy = 'private', tags = [], settings = {} } = req.body;

    const result = await executeQuery(
      'INSERT INTO scripts (title, category, privacy, tags, settings, user_id, content) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, category, privacy, JSON.stringify(tags), JSON.stringify(settings), req.user.id, '']
    );

    const scriptId = result.insertId;

    // Create initial version
    const hash = crypto.createHash('sha256').update(`${scriptId}-${Date.now()}`).digest('hex').substring(0, 8);
    await executeQuery(
      'INSERT INTO script_versions (script_id, user_id, version_number, content, commit_message, hash) VALUES (?, ?, ?, ?, ?, ?)',
      [scriptId, req.user.id, 1, '', 'Initial script creation', hash]
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
      [req.user.id, scriptId, 'script_create', JSON.stringify({ title, category })]
    );

    // Get created script
    const script = await executeQuery(
      'SELECT * FROM scripts WHERE id = ?',
      [scriptId]
    );

    res.status(201).json({
      success: true,
      message: 'Script created successfully',
      data: { script: script[0] }
    });
  } catch (error) {
    console.error('Create script error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update script
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Title cannot be empty'),
  body('content').optional().isString().withMessage('Content must be a string'),
  body('category').optional().isIn(['screenplay', 'stage-play', 'tv-episode', 'short-film', 'web-series', 'documentary', 'commercial', 'other']).withMessage('Invalid category'),
  body('status').optional().isIn(['draft', 'in-progress', 'review', 'completed', 'archived']).withMessage('Invalid status'),
  body('privacy').optional().isIn(['private', 'shared', 'public']).withMessage('Invalid privacy setting'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('settings').optional().isObject().withMessage('Settings must be an object')
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

    const scriptId = req.params.id;
    const { title, content, category, status, privacy, tags, settings } = req.body;

    // Check if user has edit access
    const access = await executeQuery(
      `SELECT s.user_id, c.role
       FROM scripts s
       LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
       WHERE s.id = ? AND (s.user_id = ? OR c.role IN ('editor'))`,
      [req.user.id, scriptId, req.user.id]
    );

    if (access.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updates = {};
    const params = [];

    if (title !== undefined) {
      updates.title = title;
      params.push(title);
    }
    if (content !== undefined) {
      updates.content = content;
      params.push(content);
      
      // Update word count
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      updates.word_count = wordCount;
      params.push(wordCount);
    }
    if (category !== undefined) {
      updates.category = category;
      params.push(category);
    }
    if (status !== undefined) {
      updates.status = status;
      params.push(status);
    }
    if (privacy !== undefined) {
      updates.privacy = privacy;
      params.push(privacy);
    }
    if (tags !== undefined) {
      updates.tags = JSON.stringify(tags);
      params.push(JSON.stringify(tags));
    }
    if (settings !== undefined) {
      updates.settings = JSON.stringify(settings);
      params.push(JSON.stringify(settings));
    }

    if (params.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    let setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    if (content !== undefined) {
      // Remove word_count from setClause since we're setting it separately
      setClause = setClause.replace(', word_count = ?', '');
      setClause += ', word_count = ?, last_modified = CURRENT_TIMESTAMP';
    } else {
      setClause += ', last_modified = CURRENT_TIMESTAMP';
    }
    
    params.push(scriptId);

    await executeQuery(
      `UPDATE scripts SET ${setClause} WHERE id = ?`,
      params
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
      [req.user.id, scriptId, 'script_update', JSON.stringify(updates)]
    );

    // Emit real-time update to collaborators
    const io = req.app.get('io');
    io.to(`script-${scriptId}`).emit('script_updated', {
      scriptId,
      updates,
      updatedBy: req.user.name
    });

    res.json({
      success: true,
      message: 'Script updated successfully'
    });
  } catch (error) {
    console.error('Update script error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete script
router.delete('/:id', async (req, res) => {
  try {
    const scriptId = req.params.id;

    // Check if user is the owner
    const script = await executeQuery(
      'SELECT user_id FROM scripts WHERE id = ? AND user_id = ?',
      [scriptId, req.user.id]
    );

    if (script.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only script owner can delete.'
      });
    }

    await executeQuery('DELETE FROM scripts WHERE id = ?', [scriptId]);

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'script_delete', JSON.stringify({ scriptId })]
    );

    res.json({
      success: true,
      message: 'Script deleted successfully'
    });
  } catch (error) {
    console.error('Delete script error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create script version/commit
router.post('/:id/versions', [
  body('commit_message').trim().isLength({ min: 1 }).withMessage('Commit message is required')
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

    const scriptId = req.params.id;
    const { commit_message } = req.body;

    // Check access
    const access = await executeQuery(
      `SELECT s.content, s.user_id, c.role
       FROM scripts s
       LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
       WHERE s.id = ? AND (s.user_id = ? OR c.role IN ('editor'))`,
      [req.user.id, scriptId, req.user.id]
    );

    if (access.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get next version number
    const lastVersion = await executeQuery(
      'SELECT MAX(version_number) as last_version FROM script_versions WHERE script_id = ?',
      [scriptId]
    );

    const nextVersion = (lastVersion[0].last_version || 0) + 1;
    const hash = crypto.createHash('sha256').update(`${scriptId}-${nextVersion}-${Date.now()}`).digest('hex').substring(0, 8);

    await executeQuery(
      'INSERT INTO script_versions (script_id, user_id, version_number, content, commit_message, hash) VALUES (?, ?, ?, ?, ?, ?)',
      [scriptId, req.user.id, nextVersion, access[0].content, commit_message, hash]
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
      [req.user.id, scriptId, 'script_commit', JSON.stringify({ version: nextVersion, message: commit_message })]
    );

    res.status(201).json({
      success: true,
      message: 'Version created successfully',
      data: { version: nextVersion, hash }
    });
  } catch (error) {
    console.error('Create version error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get script versions
router.get('/:id/versions', async (req, res) => {
  try {
    const scriptId = req.params.id;

    // Check access
    const access = await executeQuery(
      `SELECT s.user_id, c.role
       FROM scripts s
       LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
       WHERE s.id = ? AND (s.user_id = ? OR c.user_id = ?)`,
      [req.user.id, scriptId, req.user.id, req.user.id]
    );

    if (access.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const versions = await executeQuery(
      `SELECT sv.id, sv.version_number, sv.commit_message, sv.hash, sv.created_at,
       u.name as author_name, u.email as author_email
       FROM script_versions sv
       JOIN users u ON sv.user_id = u.id
       WHERE sv.script_id = ?
       ORDER BY sv.version_number DESC`,
      [scriptId]
    );

    res.json({
      success: true,
      data: { versions }
    });
  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;