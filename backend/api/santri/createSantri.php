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

// Validasi data
if (
    empty($data['email']) || empty($data['password']) ||
    empty($data['nama']) || empty($data['nis']) || empty($data['jenisKelamin'])
) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

// 1. Tambah user siswa
$hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
$stmtUser = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, 'siswa')");
$stmtUser->execute([$data['email'], $hashedPassword]);
$user_id = $pdo->lastInsertId();

// 2. Tambah data santri
$stmtSantri = $pdo->prepare("INSERT INTO santri (user_id, foto, nama, nis, jenis_kelamin, asal_sekolah) VALUES (?, ?, ?, ?, ?, ?)");
$success = $stmtSantri->execute([
    $user_id,
    $data['foto'] ?? '',
    $data['nama'],
    $data['nis'],
    $data['jenisKelamin'],
    $data['asalSekolah'] ?? ''
]);

echo json_encode(['success' => $success]);