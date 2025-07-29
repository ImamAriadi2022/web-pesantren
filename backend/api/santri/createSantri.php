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

// Logging untuk debug data yang masuk
file_put_contents(__DIR__ . '/debug_create_santri.log', print_r($data, true), FILE_APPEND);

// Validasi data
if (
    empty($data['email']) || empty($data['password']) ||
    empty($data['nama']) || empty($data['nis']) || empty($data['jenis_kelamin'])
) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

try {
    // 1. Tambah user santri
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmtUser = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, 'santri')");
    $stmtUser->execute([$data['email'], $hashedPassword]);
    $user_id = $pdo->lastInsertId();

    // 2. Proses simpan foto jika ada
    $fotoPath = '';
    if (!empty($data['foto'])) {
        $fotoData = $data['foto'];
        if (preg_match('/^data:image\/(\w+);base64,/', $fotoData, $type)) {
            $fotoData = substr($fotoData, strpos($fotoData, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, etc
            $fotoData = base64_decode($fotoData);
            $fileName = 'foto_' . time() . '_' . uniqid() . '.' . $type;
            $uploadDir = __DIR__ . '/uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $filePath = $uploadDir . $fileName;
            file_put_contents($filePath, $fotoData);
            $fotoPath = 'uploads/' . $fileName; // Simpan path relatif
        }
    }

    // 3. Tambah data santri
    $stmtSantri = $pdo->prepare("INSERT INTO santri (user_id, foto, nama, nis, jenis_kelamin, asal_sekolah, tanggal_lahir, nama_wali, no_hp_wali, pekerjaan_wali, alamat_wali, telepon_wali, alamat, telepon, tanggal_masuk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $success = $stmtSantri->execute([
        $user_id,
        $fotoPath,
        $data['nama'],
        $data['nis'],
        $data['jenis_kelamin'],
        $data['asal_sekolah'] ?? '',
        $data['tanggal_lahir'] ?? null,
        $data['nama_wali'] ?? '',
        $data['no_hp_wali'] ?? '',
        $data['pekerjaan_wali'] ?? '',
        $data['alamat_wali'] ?? '',
        $data['telepon_wali'] ?? '',
        $data['alamat'] ?? '',
        $data['telepon'] ?? '',
        $data['tanggal_masuk'] ?? date('Y-m-d')
    ]);

    if (!$success) {
        $errorInfo = $stmtSantri->errorInfo();
        echo json_encode(['success' => false, 'message' => $errorInfo[2]]);
        exit;
    }

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}