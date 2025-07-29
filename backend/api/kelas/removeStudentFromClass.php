<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['santri_kelas_id'])) {
    echo json_encode(['success' => false, 'message' => 'ID santri_kelas diperlukan']);
    exit;
}

try {
    // Get student and class info before removing
    $infoStmt = $pdo->prepare("
        SELECT 
            sk.id,
            s.nama as santri_nama,
            k.nama_kelas
        FROM santri_kelas sk
        JOIN santri s ON sk.santri_id = s.id
        JOIN kelas k ON sk.kelas_id = k.id
        WHERE sk.id = ?
    ");
    $infoStmt->execute([$data['santri_kelas_id']]);
    $info = $infoStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$info) {
        echo json_encode(['success' => false, 'message' => 'Data santri di kelas tidak ditemukan']);
        exit;
    }
    
    // Remove student from class (soft delete by updating status)
    $updateStmt = $pdo->prepare("
        UPDATE santri_kelas 
        SET status = 'Pindah', tanggal_keluar = CURDATE() 
        WHERE id = ?
    ");
    
    $success = $updateStmt->execute([$data['santri_kelas_id']]);
    
    if ($success) {
        echo json_encode([
            'success' => true, 
            'message' => "Santri {$info['santri_nama']} berhasil dipindahkan dari kelas {$info['nama_kelas']}"
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal memindahkan santri dari kelas']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}