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

// Proses update foto jika base64
$fotoPath = $data['foto'] ?? '';
if (!empty($data['foto']) && preg_match('/^data:image\/(\w+);base64,/', $data['foto'])) {
    $fotoData = substr($data['foto'], strpos($data['foto'], ',') + 1);
    $type = strtolower(explode('/', explode(';', $data['foto'])[0])[1]);
    $fotoData = base64_decode($fotoData);
    $fileName = 'foto_' . time() . '_' . uniqid() . '.' . $type;
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    $filePath = $uploadDir . $fileName;
    file_put_contents($filePath, $fotoData);
    $fotoPath = 'uploads/' . $fileName;
}

$stmt = $pdo->prepare("UPDATE santri SET foto=?, nama=?, nis=?, jenis_kelamin=?, asal_sekolah=? WHERE id=?");
$success = $stmt->execute([
    $fotoPath,
    $data['nama'],
    $data['nis'],
    $data['jenis_kelamin'],
    $data['asal_sekolah'] ?? '',
    $data['id']
]);

echo json_encode(['success' => $success]);