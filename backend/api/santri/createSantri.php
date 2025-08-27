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

// Validasi data wajib sesuai schema_clean.sql
if (
    empty($data['nama']) || empty($data['nis']) || empty($data['jenis_kelamin'])
) {
    echo json_encode(['success' => false, 'message' => 'Nama, NIS, dan Jenis Kelamin wajib diisi']);
    exit;
}

try {
    $pdo->beginTransaction();
    
    // 1. Cek apakah NIS sudah ada
    $checkNis = $pdo->prepare("SELECT id FROM santri WHERE nis = ?");
    $checkNis->execute([$data['nis']]);
    if ($checkNis->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'NIS sudah terdaftar']);
        exit;
    }
    
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

    // 3. Insert santri berdasarkan schema_clean.sql
    $stmt = $pdo->prepare("
        INSERT INTO santri (
            nis, 
            nama, 
            kelas_id, 
            tempat_lahir,
            tanggal_lahir, 
            jenis_kelamin, 
            alamat, 
            no_hp,
            nama_wali, 
            no_hp_wali, 
            foto, 
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Aktif')
    ");
    
    $success = $stmt->execute([
        $data['nis'],
        $data['nama'],
        $data['kelas_id'] ?? null,
        $data['tempat_lahir'] ?? $data['asal_sekolah'] ?? '',
        $data['tanggal_lahir'] ?? null,
        $data['jenis_kelamin'],
        $data['alamat'] ?? '',
        $data['no_hp'] ?? $data['telepon'] ?? '',
        $data['nama_wali'] ?? '',
        $data['no_hp_wali'] ?? '',
        $fotoPath
    ]);

    if (!$success) {
        $pdo->rollBack();
        $errorInfo = $stmt->errorInfo();
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $errorInfo[2]]);
        exit;
    }

    // 4. Buat user account untuk santri jika ada email/password
    if (!empty($data['email']) && !empty($data['password'])) {
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
        $stmtUser = $pdo->prepare("
            INSERT INTO users (username, password, nama, role, status) 
            VALUES (?, ?, ?, 'Santri', 'Aktif')
        ");
        $stmtUser->execute([
            $data['nis'], // username menggunakan NIS
            $hashedPassword,
            $data['nama']
        ]);
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Data santri berhasil ditambahkan']);
    
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("Error create santri: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Gagal menambah santri: ' . $e->getMessage()]);
}