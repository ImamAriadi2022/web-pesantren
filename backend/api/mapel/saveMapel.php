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
$kelas_id = $input['kelas_id'] ?? null;
$keterangan = $input['keterangan'] ?? '';
$status = $input['status'] ?? 'Aktif';

// Validasi input
if (empty($kode_mapel) || empty($nama_mapel)) {
    echo json_encode(['success' => false, 'message' => 'Kode mapel dan nama mapel harus diisi']);
    exit;
}

try {
    if ($id) {
        // Update existing mapel
        // Cek apakah kode mapel sudah ada (kecuali untuk record yang sedang diupdate)
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM mata_pelajaran WHERE kode_mapel = ? AND id != ?");
        $checkStmt->execute([$kode_mapel, $id]);
        
        if ($checkStmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Kode mata pelajaran sudah digunakan']);
            exit;
        }
        
        $stmt = $pdo->prepare("UPDATE mata_pelajaran SET kode_mapel = ?, nama_mapel = ?, kelas_id = ?, keterangan = ?, status = ? WHERE id = ?");
        $result = $stmt->execute([$kode_mapel, $nama_mapel, $kelas_id, $keterangan, $status, $id]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Mata pelajaran berhasil diperbarui'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui mata pelajaran']);
        }
    } else {
        // Create new mapel
        // Cek apakah kode mapel sudah ada
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM mata_pelajaran WHERE kode_mapel = ?");
        $checkStmt->execute([$kode_mapel]);
        
        if ($checkStmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Kode mata pelajaran sudah digunakan']);
            exit;
        }
        
        $stmt = $pdo->prepare("INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, kelas_id, keterangan, status) VALUES (?, ?, ?, ?, ?)");
        $result = $stmt->execute([$kode_mapel, $nama_mapel, $kelas_id, $keterangan, $status]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Mata pelajaran berhasil ditambahkan',
                'id' => $pdo->lastInsertId()
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal menambahkan mata pelajaran']);
        }
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
