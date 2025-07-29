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

if (empty($data['kelas_id']) || empty($data['santri_id'])) {
    echo json_encode(['success' => false, 'message' => 'ID kelas dan ID santri diperlukan']);
    exit;
}

try {
    // Check if student is already in the class for current academic year
    $currentYear = date('Y') . '/' . (date('Y') + 1);
    $semester = date('n') >= 7 ? 'Ganjil' : 'Genap'; // July onwards = Ganjil semester
    
    $checkStmt = $pdo->prepare("
        SELECT id FROM santri_kelas 
        WHERE santri_id = ? AND kelas_id = ? AND tahun_ajaran = ? AND semester = ? AND status = 'Aktif'
    ");
    $checkStmt->execute([$data['santri_id'], $data['kelas_id'], $currentYear, $semester]);
    
    if ($checkStmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Santri sudah terdaftar di kelas ini']);
        exit;
    }
    
    // Check if santri exists
    $santriStmt = $pdo->prepare("SELECT id, nama FROM santri WHERE id = ?");
    $santriStmt->execute([$data['santri_id']]);
    $santri = $santriStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$santri) {
        echo json_encode(['success' => false, 'message' => 'Santri tidak ditemukan']);
        exit;
    }
    
    // Check if class exists
    $kelasStmt = $pdo->prepare("SELECT id, nama_kelas, kapasitas FROM kelas WHERE id = ?");
    $kelasStmt->execute([$data['kelas_id']]);
    $kelas = $kelasStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$kelas) {
        echo json_encode(['success' => false, 'message' => 'Kelas tidak ditemukan']);
        exit;
    }
    
    // Check class capacity
    $countStmt = $pdo->prepare("
        SELECT COUNT(*) as total 
        FROM santri_kelas 
        WHERE kelas_id = ? AND tahun_ajaran = ? AND semester = ? AND status = 'Aktif'
    ");
    $countStmt->execute([$data['kelas_id'], $currentYear, $semester]);
    $currentCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    if ($kelas['kapasitas'] && $currentCount >= $kelas['kapasitas']) {
        echo json_encode(['success' => false, 'message' => 'Kapasitas kelas sudah penuh']);
        exit;
    }
    
    // Add student to class
    $insertStmt = $pdo->prepare("
        INSERT INTO santri_kelas (santri_id, kelas_id, tahun_ajaran, semester, tanggal_masuk, status) 
        VALUES (?, ?, ?, ?, CURDATE(), 'Aktif')
    ");
    
    $success = $insertStmt->execute([$data['santri_id'], $data['kelas_id'], $currentYear, $semester]);
    
    if ($success) {
        echo json_encode([
            'success' => true, 
            'message' => "Santri {$santri['nama']} berhasil ditambahkan ke kelas {$kelas['nama_kelas']}"
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menambahkan santri ke kelas']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}