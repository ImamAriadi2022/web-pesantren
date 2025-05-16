<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\kelas\createClass.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['kode_kelas']) || !isset($data['nama_kelas'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO kelas (kode_kelas, nama_kelas, keterangan) VALUES (?, ?, ?)");
$success = $stmt->execute([
    $data['kode_kelas'],
    $data['nama_kelas'],
    $data['keterangan'] ?? ''
]);

echo json_encode(['success' => $success]);