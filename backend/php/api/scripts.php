<?php
require_once '../config/database.php';

$db = new Database();

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        if (isset($_GET['action'])) {
            switch($_GET['action']) {
                case 'list':
                    getScripts($db, $_GET);
                    break;
                case 'get':
                    getScript($db, $_GET);
                    break;
                default:
                    handleError('Invalid action', 400);
            }
        } else {
            handleError('Action required', 400);
        }
        break;
        
    case 'POST':
        if (isset($_GET['action'])) {
            switch($_GET['action']) {
                case 'create':
                    createScript($db, $input);
                    break;
                default:
                    handleError('Invalid action', 400);
            }
        } else {
            handleError('Action required', 400);
        }
        break;
        
    case 'PUT':
        if (isset($_GET['action'])) {
            switch($_GET['action']) {
                case 'update':
                    updateScript($db, $input, $_GET);
                    break;
                default:
                    handleError('Invalid action', 400);
            }
        } else {
            handleError('Action required', 400);
        }
        break;
        
    case 'DELETE':
        if (isset($_GET['action'])) {
            switch($_GET['action']) {
                case 'delete':
                    deleteScript($db, $_GET);
                    break;
                default:
                    handleError('Invalid action', 400);
            }
        } else {
            handleError('Action required', 400);
        }
        break;
        
    default:
        handleError('Method not allowed', 405);
}

function getScripts($db, $params) {
    try {
        $userId = $params['user_id'] ?? null;
        if (!$userId) {
            handleError('User ID required', 400);
        }
        
        $page = isset($params['page']) ? (int)$params['page'] : 1;
        $limit = isset($params['limit']) ? (int)$params['limit'] : 10;
        $offset = ($page - 1) * $limit;
        
        $whereClause = 'WHERE (s.user_id = ? OR c.user_id = ?)';
        $queryParams = [$userId, $userId];
        
        if (isset($params['search']) && $params['search']) {
            $whereClause .= ' AND (s.title LIKE ? OR s.content LIKE ?)';
            $search = '%' . $params['search'] . '%';
            $queryParams[] = $search;
            $queryParams[] = $search;
        }
        
        if (isset($params['category']) && $params['category']) {
            $whereClause .= ' AND s.category = ?';
            $queryParams[] = $params['category'];
        }
        
        if (isset($params['status']) && $params['status']) {
            $whereClause .= ' AND s.status = ?';
            $queryParams[] = $params['status'];
        }
        
        $sql = "SELECT DISTINCT s.id, s.title, s.category, s.status, s.privacy, s.tags, 
                s.pages, s.word_count, s.created_at, s.updated_at, s.last_modified,
                u.name as owner_name, u.email as owner_email,
                CASE WHEN s.user_id = ? THEN 'owner' ELSE COALESCE(c.role, 'viewer') END as user_role
                FROM scripts s
                LEFT JOIN users u ON s.user_id = u.id
                LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
                $whereClause
                ORDER BY s.last_modified DESC
                LIMIT ? OFFSET ?";
        
        $allParams = [$userId, $userId, ...$queryParams, $limit, $offset];
        $scripts = $db->fetchAll($sql, $allParams);
        
        // Get total count
        $countSql = "SELECT COUNT(DISTINCT s.id) as count
                     FROM scripts s
                     LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
                     $whereClause";
        
        $countParams = [$userId, ...$queryParams];
        $totalCount = $db->fetch($countSql, $countParams)['count'];
        
        sendResponse(true, [
            'scripts' => $scripts,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => (int)$totalCount,
                'pages' => ceil($totalCount / $limit)
            ]
        ]);
        
    } catch(Exception $e) {
        handleError('Failed to get scripts: ' . $e->getMessage());
    }
}

function getScript($db, $params) {
    try {
        $scriptId = $params['id'] ?? null;
        $userId = $params['user_id'] ?? null;
        
        if (!$scriptId || !$userId) {
            handleError('Script ID and User ID required', 400);
        }
        
        // Check access and get script
        $sql = "SELECT s.*, u.name as owner_name, u.email as owner_email,
                CASE 
                  WHEN s.user_id = ? THEN 'owner'
                  WHEN c.user_id = ? THEN c.role
                  ELSE NULL
                END as user_role
                FROM scripts s
                LEFT JOIN users u ON s.user_id = u.id
                LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
                WHERE s.id = ? AND (s.user_id = ? OR c.user_id = ?)";
        
        $script = $db->fetch($sql, [$userId, $userId, $userId, $scriptId, $userId, $userId]);
        
        if (!$script) {
            handleError('Script not found or access denied', 404);
        }
        
        // Get collaborators
        $collaborators = $db->fetchAll(
            "SELECT c.id, c.role, c.permissions, c.status, c.last_active, c.is_online,
             u.id as user_id, u.name, u.email, u.avatar_url
             FROM collaborators c
             JOIN users u ON c.user_id = u.id
             WHERE c.script_id = ?",
            [$scriptId]
        );
        
        $script['collaborators'] = $collaborators;
        
        sendResponse(true, ['script' => $script]);
        
    } catch(Exception $e) {
        handleError('Failed to get script: ' . $e->getMessage());
    }
}

function createScript($db, $data) {
    try {
        // Validate input
        if (!isset($data['title']) || !isset($data['category']) || !isset($data['user_id'])) {
            handleError('Title, category and user_id are required', 400);
        }
        
        $title = trim($data['title']);
        $category = $data['category'];
        $userId = $data['user_id'];
        $privacy = $data['privacy'] ?? 'private';
        $tags = isset($data['tags']) ? json_encode($data['tags']) : '[]';
        $settings = isset($data['settings']) ? json_encode($data['settings']) : '{}';
        
        $sql = 'INSERT INTO scripts (title, category, privacy, tags, settings, user_id, content) 
                VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        $db->query($sql, [$title, $category, $privacy, $tags, $settings, $userId, '']);
        
        $scriptId = $db->lastInsertId();
        
        // Get created script
        $script = $db->fetch('SELECT * FROM scripts WHERE id = ?', [$scriptId]);
        
        // Log activity
        $db->query(
            'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
            [$userId, $scriptId, 'script_create', json_encode(['title' => $title, 'category' => $category])]
        );
        
        sendResponse(true, ['script' => $script], 'Script created successfully', 201);
        
    } catch(Exception $e) {
        handleError('Failed to create script: ' . $e->getMessage());
    }
}

function updateScript($db, $data, $params) {
    try {
        $scriptId = $params['id'] ?? null;
        $userId = $params['user_id'] ?? null;
        
        if (!$scriptId || !$userId) {
            handleError('Script ID and User ID required', 400);
        }
        
        // Check edit access
        $access = $db->fetch(
            "SELECT s.user_id, c.role
             FROM scripts s
             LEFT JOIN collaborators c ON s.id = c.script_id AND c.user_id = ? AND c.status = 'accepted'
             WHERE s.id = ? AND (s.user_id = ? OR c.role = 'editor')",
            [$userId, $scriptId, $userId]
        );
        
        if (!$access) {
            handleError('Access denied', 403);
        }
        
        $updateFields = [];
        $updateParams = [];
        
        if (isset($data['title'])) {
            $updateFields[] = 'title = ?';
            $updateParams[] = trim($data['title']);
        }
        
        if (isset($data['content'])) {
            $updateFields[] = 'content = ?';
            $updateParams[] = $data['content'];
            
            // Update word count
            $wordCount = str_word_count(strip_tags($data['content']));
            $updateFields[] = 'word_count = ?';
            $updateParams[] = $wordCount;
        }
        
        if (isset($data['category'])) {
            $updateFields[] = 'category = ?';
            $updateParams[] = $data['category'];
        }
        
        if (isset($data['status'])) {
            $updateFields[] = 'status = ?';
            $updateParams[] = $data['status'];
        }
        
        if (isset($data['privacy'])) {
            $updateFields[] = 'privacy = ?';
            $updateParams[] = $data['privacy'];
        }
        
        if (isset($data['tags'])) {
            $updateFields[] = 'tags = ?';
            $updateParams[] = json_encode($data['tags']);
        }
        
        if (isset($data['settings'])) {
            $updateFields[] = 'settings = ?';
            $updateParams[] = json_encode($data['settings']);
        }
        
        if (empty($updateFields)) {
            handleError('No valid fields to update', 400);
        }
        
        $updateFields[] = 'last_modified = CURRENT_TIMESTAMP';
        $updateParams[] = $scriptId;
        
        $sql = 'UPDATE scripts SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $db->query($sql, $updateParams);
        
        // Log activity
        $db->query(
            'INSERT INTO activity_logs (user_id, script_id, action, details) VALUES (?, ?, ?, ?)',
            [$userId, $scriptId, 'script_update', json_encode($data)]
        );
        
        sendResponse(true, null, 'Script updated successfully');
        
    } catch(Exception $e) {
        handleError('Failed to update script: ' . $e->getMessage());
    }
}

function deleteScript($db, $params) {
    try {
        $scriptId = $params['id'] ?? null;
        $userId = $params['user_id'] ?? null;
        
        if (!$scriptId || !$userId) {
            handleError('Script ID and User ID required', 400);
        }
        
        // Check if user is owner
        $script = $db->fetch('SELECT user_id FROM scripts WHERE id = ? AND user_id = ?', [$scriptId, $userId]);
        
        if (!$script) {
            handleError('Access denied. Only script owner can delete.', 403);
        }
        
        $db->query('DELETE FROM scripts WHERE id = ?', [$scriptId]);
        
        // Log activity
        $db->query(
            'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
            [$userId, 'script_delete', json_encode(['scriptId' => $scriptId])]
        );
        
        sendResponse(true, null, 'Script deleted successfully');
        
    } catch(Exception $e) {
        handleError('Failed to delete script: ' . $e->getMessage());
    }
}
?>