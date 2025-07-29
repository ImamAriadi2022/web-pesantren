<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id']) || empty($data['email']) || empty($data['role'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

try {
    // Prepare update SQL with status support
    $fields = ['email=?', 'role=?'];
    $params = [$data['email'], strtolower($data['role'])];
    
    // Add status if provided - use proper capitalization to match ENUM values
    if (isset($data['status'])) {
        $fields[] = 'status=?';
        // Convert to proper case for ENUM values
        $status = ucfirst(strtolower($data['status']));
        $params[] = $status;
    }
    
    // Add password if provided
    if (!empty($data['password'])) {
        $fields[] = 'password=?';
        $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
    }
    
    // Add ID parameter for WHERE clause
    $params[] = $data['id'];
    
    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id=?";
    
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute($params);
    
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update user']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}