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
file_put_contents(__DIR__ . '/debug_update_santri.log', date('Y-m-d H:i:s') . " | DATA: " . print_r($data, true) . "\n", FILE_APPEND);

if (empty($data['id']) || empty($data['nama']) || empty($data['nis'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap: ID, nama, dan NIS wajib diisi']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Cek apakah NIS sudah digunakan oleh santri lain
    $checkNis = $pdo->prepare("SELECT id FROM santri WHERE nis = ? AND id != ?");
    $checkNis->execute([$data['nis'], $data['id']]);
    if ($checkNis->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'NIS sudah digunakan oleh santri lain']);
        exit;
    }

    // Proses foto jika ada
    $fotoPath = null;
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
            $fotoPath = 'uploads/' . $fileName;
        }
    }

    // Update data santri berdasarkan schema_clean.sql
    $sql = "UPDATE santri SET 
                nis = ?, 
                nama = ?, 
                kelas_id = ?, 
                tempat_lahir = ?,
                tanggal_lahir = ?, 
                jenis_kelamin = ?, 
                alamat = ?, 
                no_hp = ?,
                nama_wali = ?, 
                no_hp_wali = ?";
    
    $params = [
        $data['nis'],
        $data['nama'], 
        $data['kelas_id'] ?? null,
        $data['tempat_lahir'] ?? $data['asal_sekolah'] ?? '',
        $data['tanggal_lahir'] ?? null,
        $data['jenis_kelamin'],
        $data['alamat'] ?? '',
        $data['no_hp'] ?? $data['telepon'] ?? '',
        $data['nama_wali'] ?? '',
        $data['no_hp_wali'] ?? ''
    ];

    // Tambahkan foto jika ada update
    if ($fotoPath) {
        $sql .= ", foto = ?";
        $params[] = $fotoPath;
    }

    $sql .= " WHERE id = ?";
    $params[] = $data['id'];

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // Update user account jika ada (optional)
    if (!empty($data['password'])) {
        $userUpdateSql = "UPDATE users SET password = ?, nama = ? WHERE username = ?";
        $userParams = [
            password_hash($data['password'], PASSWORD_BCRYPT), 
            $data['nama'],
            $data['nis'] // username berdasarkan NIS
        ];
        $userStmt = $pdo->prepare($userUpdateSql);
        $userStmt->execute($userParams);
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Data santri berhasil diupdate']);

} catch (PDOException $e) {
    $pdo->rollBack();
    // Log error
    file_put_contents(__DIR__ . '/debug_update_santri.log', date('Y-m-d H:i:s') . " | ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Gagal update santri: ' . $e->getMessage()]);
}