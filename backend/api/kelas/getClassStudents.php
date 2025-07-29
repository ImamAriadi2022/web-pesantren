<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$kelas_id = $_GET['kelas_id'] ?? null;

if (empty($kelas_id)) {
    echo json_encode(['success' => false, 'message' => 'ID kelas diperlukan']);
    exit;
}

try {
    // Get students in the class
    $stmt = $pdo->prepare("
        SELECT 
            sk.id as santri_kelas_id,
            s.id as santri_id,
            s.nama,
            s.nis,
            sk.tahun_ajaran,
            sk.semester,
            sk.tanggal_masuk,
            sk.tanggal_keluar,
            sk.status,
            k.nama_kelas,
            k.kode_kelas
        FROM santri_kelas sk
        JOIN santri s ON sk.santri_id = s.id
        JOIN kelas k ON sk.kelas_id = k.id
        WHERE sk.kelas_id = ? AND sk.status = 'Aktif'
        ORDER BY s.nama ASC
    ");
    
    $stmt->execute([$kelas_id]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get class info
    $classStmt = $pdo->prepare("SELECT * FROM kelas WHERE id = ?");
    $classStmt->execute([$kelas_id]);
    $classInfo = $classStmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'class_info' => $classInfo,
            'students' => $students,
            'total_students' => count($students)
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}