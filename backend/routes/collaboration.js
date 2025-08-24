const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Add collaborator to script
router.post('/invite', [
  body('script_id').isInt().withMessage('Valid script ID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').isIn(['editor', 'viewer', 'commenter']).withMessage('Invalid role')
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

    const { script_id, email, role = 'viewer' } = req.body;

    // Check if user is script owner or has admin permissions
    const script = await executeQuery(
      'SELECT user_id FROM scripts WHERE id = ? AND user_id = ?',
      [script_id, req.user.id]
    );

    if (script.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only script owner can invite collaborators.'
      });
    }

    // Find user by email
    const user = await executeQuery(
      'SELECT id, name FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    const userId = user[0].id;

    // Check if user is already a collaborator
    const existingCollaborator = await executeQuery(
      'SELECT id FROM collaborators WHERE script_id = ? AND user_id = ?',
      [script_id, userId]
    );

    if (existingCollaborator.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator on this script'
      });
    }

    // Add collaborator
    const result = await executeQuery(
      'INSERT INTO collaborators (script_id, user_id, role, invited_by, status) VALUES (?, ?, ?, ?, ?)',
      [script_id, userId, role, req.user.id, 'accepted'] // Auto-accept for now
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
      [req.user.id, script_id, 'collaborator_invite', JSON.stringify({ email, role })]
    );

    // Create notification for the invited user
    await executeQuery(
      'INSERT INTO notifications (user_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)',
      [userId, 'collaboration_invite', 'Script Collaboration Invite', 
       `You have been invited to collaborate on a script by ${req.user.name}`, 
       JSON.stringify({ script_id, inviter: req.user.name, role })]
    );

    res.status(201).json({
      success: true,
      message: 'Collaborator invited successfully',
      data: { collaborator_id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get collaborators for a script
router.get('/script/:id/collaborators', async (req, res) => {
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

    const collaborators = await executeQuery(
      `SELECT c.id, c.role, c.status, c.last_active, c.is_online, c.cursor_position,
       u.id as user_id, u.name, u.email, u.avatar_url
       FROM collaborators c
       JOIN users u ON c.user_id = u.id
       WHERE c.script_id = ?
       ORDER BY c.role, u.name`,
      [scriptId]
    );

    res.json({
      success: true,
      data: { collaborators }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update collaborator role
router.put('/collaborator/:id', [
  body('role').isIn(['editor', 'viewer', 'commenter']).withMessage('Invalid role')
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

    const collaboratorId = req.params.id;
    const { role } = req.body;

    // Check if user is script owner
    const collaborator = await executeQuery(
      `SELECT c.script_id, s.user_id as script_owner
       FROM collaborators c
       JOIN scripts s ON c.script_id = s.id
       WHERE c.id = ?`,
      [collaboratorId]
    );

    if (collaborator.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Collaborator not found'
      });
    }

    if (collaborator[0].script_owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only script owner can update collaborator roles.'
      });
    }

    await executeQuery(
      'UPDATE collaborators SET role = ? WHERE id = ?',
      [role, collaboratorId]
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
      [req.user.id, collaborator[0].script_id, 'collaborator_role_update', JSON.stringify({ collaboratorId, role })]
    );

    res.json({
      success: true,
      message: 'Collaborator role updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Remove collaborator
router.delete('/collaborator/:id', async (req, res) => {
  try {
    const collaboratorId = req.params.id;

    // Check if user is script owner or the collaborator themselves
    const collaborator = await executeQuery(
      `SELECT c.user_id, c.script_id, s.user_id as script_owner
       FROM collaborators c
       JOIN scripts s ON c.script_id = s.id
       WHERE c.id = ?`,
      [collaboratorId]
    );

    if (collaborator.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Collaborator not found'
      });
    }

    const isOwner = collaborator[0].script_owner === req.user.id;
    const isSelf = collaborator[0].user_id === req.user.id;

    if (!isOwner && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await executeQuery('DELETE FROM collaborators WHERE id = ?', [collaboratorId]);

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
      [req.user.id, collaborator[0].script_id, 'collaborator_remove', JSON.stringify({ collaboratorId })]
    );

    res.json({
      success: true,
      message: 'Collaborator removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add comment to script
router.post('/comment', [
  body('script_id').isInt().withMessage('Valid script ID is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Comment content is required'),
  body('line_number').optional().isInt().withMessage('Line number must be an integer'),
  body('position_start').optional().isInt().withMessage('Position start must be an integer'),
  body('position_end').optional().isInt().withMessage('Position end must be an integer'),
  body('parent_id').optional().isInt().withMessage('Parent ID must be an integer')
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

    const { script_id, content, line_number, position_start, position_end, parent_id } = req.body;

    // Check access
    const access = await executeQuery(
      `SELECT s.user_id, c.role
       FROM scripts s
       LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
       WHERE s.id = ? AND (s.user_id = ? OR c.role IN ('editor', 'commenter', 'viewer'))`,
      [req.user.id, script_id, req.user.id]
    );

    if (access.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const result = await executeQuery(
      'INSERT INTO comments (script_id, user_id, content, line_number, position_start, position_end, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [script_id, req.user.id, content, line_number || null, position_start || null, position_end || null, parent_id || null]
    );

    // Get the created comment with user info
    const comment = await executeQuery(
      `SELECT c.*, u.name as author_name, u.email as author_email, u.avatar_url as author_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
      [req.user.id, script_id, 'comment_add', JSON.stringify({ commentId: result.insertId })]
    );

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`script-${script_id}`).emit('new_comment', comment[0]);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: comment[0] }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get comments for script
router.get('/script/:id/comments', async (req, res) => {
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

    const comments = await executeQuery(
      `SELECT c.*, u.name as author_name, u.email as author_email, u.avatar_url as author_avatar,
       ru.name as resolved_by_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       LEFT JOIN users ru ON c.resolved_by = ru.id
       WHERE c.script_id = ?
       ORDER BY c.created_at ASC`,
      [scriptId]
    );

    // Organize comments in a tree structure
    const commentMap = {};
    const rootComments = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
      
      if (comment.parent_id) {
        if (commentMap[comment.parent_id]) {
          commentMap[comment.parent_id].replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    res.json({
      success: true,
      data: { comments: rootComments }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Resolve comment
router.put('/comment/:id/resolve', async (req, res) => {
  try {
    const commentId = req.params.id;

    // Check if comment exists and user has access
    const comment = await executeQuery(
      `SELECT c.script_id, s.user_id as script_owner, c.user_id as comment_author, c2.role
       FROM comments c
       JOIN scripts s ON c.script_id = s.id
       LEFT JOIN collaborators c2 ON s.id = c2.script_id AND c2.user_id = ? AND c2.status = 'accepted'
       WHERE c.id = ?`,
      [req.user.id, commentId]
    );

    if (comment.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const isOwner = comment[0].script_owner === req.user.id;
    const isAuthor = comment[0].comment_author === req.user.id;
    const canEdit = comment[0].role === 'editor';

    if (!isOwner && !isAuthor && !canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await executeQuery(
      'UPDATE comments SET is_resolved = TRUE, resolved_by = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?',
      [req.user.id, commentId]
    );

    // Log activity
    await executeQuery(
      'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
      [req.user.id, comment[0].script_id, 'comment_resolve', JSON.stringify({ commentId })]
    );

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`script-${comment[0].script_id}`).emit('comment_resolved', { commentId, resolvedBy: req.user.name });

    res.json({
      success: true,
      message: 'Comment resolved successfully'
    });
  } catch (error) {
    console.error('Resolve comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user presence (for real-time collaboration)
router.post('/presence', [
  body('script_id').isInt().withMessage('Valid script ID is required'),
  body('cursor_position').optional().isObject().withMessage('Cursor position must be an object'),
  body('is_online').isBoolean().withMessage('Online status is required')
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

    const { script_id, cursor_position, is_online } = req.body;

    // Update collaborator presence
    await executeQuery(
      `UPDATE collaborators 
       SET cursor_position = ?, is_online = ?, last_active = CURRENT_TIMESTAMP 
       WHERE script_id = ? AND user_id = ?`,
      [JSON.stringify(cursor_position || {}), is_online, script_id, req.user.id]
    );

    // Emit real-time presence update
    const io = req.app.get('io');
    io.to(`script-${script_id}`).emit('user_presence', {
      userId: req.user.id,
      userName: req.user.name,
      cursorPosition: cursor_position,
      isOnline: is_online
    });

    res.json({
      success: true,
      message: 'Presence updated successfully'
    });
  } catch (error) {
    console.error('Update presence error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;