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

try {
    $currentYear = date('Y') . '/' . (date('Y') + 1);
    $semester = date('n') >= 7 ? 'Ganjil' : 'Genap';
    
    if ($kelas_id) {
        // Get students not in the specific class
        $stmt = $pdo->prepare("
            SELECT s.id, s.nama, s.nis, s.status
            FROM santri s
            WHERE s.status = 'Aktif'
            AND s.id NOT IN (
                SELECT sk.santri_id 
                FROM santri_kelas sk 
                WHERE sk.kelas_id = ? 
                AND sk.tahun_ajaran = ? 
                AND sk.semester = ? 
                AND sk.status = 'Aktif'
            )
            ORDER BY s.nama ASC
        ");
        $stmt->execute([$kelas_id, $currentYear, $semester]);
    } else {
        // Get all active students
        $stmt = $pdo->prepare("
            SELECT s.id, s.nama, s.nis, s.status
            FROM santri s
            WHERE s.status = 'Aktif'
            ORDER BY s.nama ASC
        ");
        $stmt->execute();
    }
    
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $students,
        'total' => count($students)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}