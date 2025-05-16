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

// Update data santri
$stmt = $pdo->prepare("UPDATE santri SET foto=?, nama=?, nis=?, jenis_kelamin=?, asal_sekolah=? WHERE id=?");
$success = $stmt->execute([
    $data['foto'] ?? '',
    $data['nama'],
    $data['nis'],
    $data['jenisKelamin'],
    $data['asalSekolah'] ?? '',
    $data['id']
]);

echo json_encode(['success' => $success]);