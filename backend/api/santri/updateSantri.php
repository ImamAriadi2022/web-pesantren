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

    // Update data santri
    $sql = "UPDATE santri SET nama=?, nis=?, jenis_kelamin=?, kelas_id=?, asal_sekolah=?, tanggal_lahir=?, nama_wali=?, no_hp_wali=?, pekerjaan_wali=?, alamat_wali=?, telepon_wali=?, alamat=?, telepon=?";
    $params = [
        $data['nama'], 
        $data['nis'], 
        $data['jenis_kelamin'],
        $data['kelas_id'] ?? null,
        $data['asal_sekolah'],
        $data['tanggal_lahir'] ?? null,
        $data['nama_wali'] ?? '',
        $data['no_hp_wali'] ?? '',
        $data['pekerjaan_wali'] ?? '',
        $data['alamat_wali'] ?? '',
        $data['telepon_wali'] ?? '',
        $data['alamat'] ?? '',
        $data['telepon'] ?? ''
    ];

    // Handle foto upload jika ada
    if (!empty($data['foto'])) {
        $sql .= ", foto=?";
        $params[] = $data['foto'];
    }

    $sql .= " WHERE id=?";
    $params[] = $data['id'];

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // Update password user jika ada
    if (!empty($data['password'])) {
        $userSql = "UPDATE users SET password=? WHERE id IN (SELECT user_id FROM santri WHERE id=?)";
        $userParams = [password_hash($data['password'], PASSWORD_BCRYPT), $data['id']];

        $userStmt = $pdo->prepare($userSql);
        $userStmt->execute($userParams);
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Data santri berhasil diupdate']);

} catch (PDOException $e) {
    $pdo->rollBack();
    // Log error
    file_put_contents(__DIR__ . '/debug_update_santri.log', date('Y-m-d H:i:s') . " | ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}