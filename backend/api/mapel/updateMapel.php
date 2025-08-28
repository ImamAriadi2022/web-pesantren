<?php
require_once '../../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
    exit;
}

$id = $input['id'] ?? null;
$kode_mapel = $input['kode_mapel'] ?? '';
$nama_mapel = $input['nama_mapel'] ?? '';
$keterangan = $input['keterangan'] ?? '';
$status = $input['status'] ?? 'Aktif';

// Validasi input
if (empty($id) || empty($kode_mapel) || empty($nama_mapel)) {
    echo json_encode(['success' => false, 'message' => 'ID, kode mapel dan nama mapel harus diisi']);
    exit;
}

try {
    // Cek apakah kode mapel sudah ada (kecuali untuk record yang sedang diupdate)
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM mata_pelajaran WHERE kode_mapel = ? AND id != ?");
    $checkStmt->execute([$kode_mapel, $id]);
    
    if ($checkStmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Kode mata pelajaran sudah digunakan']);
        exit;
    }
    
    // Update mata pelajaran
    $stmt = $pdo->prepare("UPDATE mata_pelajaran SET kode_mapel = ?, nama_mapel = ?, keterangan = ?, status = ? WHERE id = ?");
    $result = $stmt->execute([$kode_mapel, $nama_mapel, $keterangan, $status, $id]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Mata pelajaran berhasil diperbarui'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal memperbarui mata pelajaran']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
