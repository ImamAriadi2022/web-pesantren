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

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
    exit;
}

$stmt = $pdo->prepare("UPDATE kelas SET kode_kelas=?, nama_kelas=?, keterangan=? WHERE id=?");
$success = $stmt->execute([
    $data['kode_kelas'],
    $data['nama_kelas'],
    $data['keterangan'] ?? '',
    $data['id']
]);

echo json_encode(['success' => $success]);