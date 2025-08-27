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

// Log input for debugging
error_log("updateClass input: " . json_encode($data));

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
    exit;
}

if (!isset($data['nama_kelas']) || empty($data['nama_kelas'])) {
    echo json_encode(['success' => false, 'message' => 'Nama kelas wajib diisi']);
    exit;
}

try {
    // Check if kode_kelas is unique (exclude current record)
    if (!empty($data['kode_kelas'])) {
        $stmt = $pdo->prepare("SELECT id FROM kelas WHERE kode_kelas = ? AND id != ?");
        $stmt->execute([$data['kode_kelas'], $data['id']]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Kode kelas sudah digunakan']);
            exit;
        }
    }

    // Update kelas berdasarkan schema_clean.sql
    $stmt = $pdo->prepare("
        UPDATE kelas SET 
            nama_kelas = ?, 
            kode_kelas = ?, 
            kapasitas = ?, 
            status = ? 
        WHERE id = ?
    ");
    
    $success = $stmt->execute([
        $data['nama_kelas'],
        $data['kode_kelas'],
        $data['kapasitas'] ?? 30,
        $data['status'] ?? 'Aktif',
        $data['id']
    ]);

    if ($success) {
        echo json_encode([
            'success' => true, 
            'message' => 'Kelas berhasil diperbarui'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal memperbarui kelas']);
    }
} catch (Exception $e) {
    error_log("Error in updateClass.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}