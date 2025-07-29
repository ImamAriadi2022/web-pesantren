<?php
require_once '../../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    $stmt = $pdo->query("
        SELECT 
            id, 
            nama_kelas, 
            kode_kelas, 
            tingkat, 
            kapasitas,
            keterangan,
            wali_kelas_id,
            status 
        FROM kelas 
        ORDER BY nama_kelas ASC
    ");
    $kelas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Add default values for missing fields
    foreach ($kelas as &$k) {
        $k['keterangan'] = $k['keterangan'] ?? '';
        $k['status'] = $k['status'] ?? 'Aktif';
        $k['kapasitas'] = $k['kapasitas'] ?? 30;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $kelas,
        'total' => count($kelas)
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>