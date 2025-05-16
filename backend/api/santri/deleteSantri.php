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

if (empty($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
    exit;
}

// Ambil user_id dari santri
$stmt = $pdo->prepare("SELECT user_id FROM santri WHERE id=?");
$stmt->execute([$data['id']]);
$user = $stmt->fetch();
if ($user) {
    // Hapus user (otomatis hapus santri karena ON DELETE CASCADE)
    $stmtDel = $pdo->prepare("DELETE FROM users WHERE id=?");
    $success = $stmtDel->execute([$user['user_id']]);
    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false, 'message' => 'Santri tidak ditemukan']);
}