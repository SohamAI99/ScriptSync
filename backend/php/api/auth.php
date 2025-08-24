<?php
require_once '../config/database.php';

$db = new Database();

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'POST':
        if (isset($_GET['action'])) {
            switch($_GET['action']) {
                case 'register':
                    register($db, $input);
                    break;
                case 'login':
                    login($db, $input);
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

function register($db, $data) {
    try {
        // Validate input
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
            handleError('Name, email and password are required', 400);
        }
        
        $name = trim($data['name']);
        $email = trim(strtolower($data['email']));
        $password = $data['password'];
        $role = isset($data['role']) ? $data['role'] : 'writer';
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            handleError('Invalid email format', 400);
        }
        
        // Check if user already exists
        $existingUser = $db->fetch('SELECT id FROM users WHERE email = ?', [$email]);
        if ($existingUser) {
            handleError('User already exists with this email', 400);
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Create user
        $sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        $db->query($sql, [$name, $email, $hashedPassword, $role]);
        
        $userId = $db->lastInsertId();
        
        // Get created user
        $user = $db->fetch('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [$userId]);
        
        // Log activity
        $db->query(
            'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [$userId, 'register', json_encode(['email' => $email, 'role' => $role]), $_SERVER['REMOTE_ADDR']]
        );
        
        sendResponse(true, ['user' => $user], 'User registered successfully', 201);
        
    } catch(Exception $e) {
        handleError('Registration failed: ' . $e->getMessage());
    }
}

function login($db, $data) {
    try {
        // Validate input
        if (!isset($data['email']) || !isset($data['password'])) {
            handleError('Email and password are required', 400);
        }
        
        $email = trim(strtolower($data['email']));
        $password = $data['password'];
        
        // Get user from database
        $user = $db->fetch('SELECT id, name, email, password, role, is_active FROM users WHERE email = ?', [$email]);
        
        if (!$user) {
            handleError('Invalid email or password', 401);
        }
        
        if (!$user['is_active']) {
            handleError('Account is deactivated', 401);
        }
        
        // Verify password
        if (!password_verify($password, $user['password'])) {
            handleError('Invalid email or password', 401);
        }
        
        // Update last login
        $db->query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [$user['id']]);
        
        // Remove password from response
        unset($user['password']);
        
        // Log activity
        $db->query(
            'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [$user['id'], 'login', json_encode(['email' => $email]), $_SERVER['REMOTE_ADDR']]
        );
        
        sendResponse(true, ['user' => $user], 'Login successful');
        
    } catch(Exception $e) {
        handleError('Login failed: ' . $e->getMessage());
    }
}
?>