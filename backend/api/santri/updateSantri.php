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

// Tambahkan debug log
file_put_contents(__DIR__ . '/debug_update_user.log', date('Y-m-d H:i:s') . " | DATA: " . print_r($data, true) . "\n", FILE_APPEND);

if (empty($data['id']) || empty($data['email']) || empty($data['role'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

$params = [$data['email'], strtolower($data['role']), $data['id']];
$sql = "UPDATE users SET email=?, role=?";

if (!empty($data['password'])) {
    $sql = "UPDATE users SET email=?, role=?, password=? WHERE user_id=?";
    $params = [$data['email'], strtolower($data['role']), password_hash($data['password'], PASSWORD_BCRYPT), $data['id']];
} else {
    $sql .= " WHERE user_id=?";
}

// Tambahkan debug log untuk query dan params
file_put_contents(__DIR__ . '/debug_update_user.log', date('Y-m-d H:i:s') . " | SQL: $sql | PARAMS: " . print_r($params, true) . "\n", FILE_APPEND);

try {
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute($params);
    echo json_encode(['success' => $success]);
} catch (PDOException $e) {
    // Log error
    file_put_contents(__DIR__ . '/debug_update_user.log', date('Y-m-d H:i:s') . " | ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}