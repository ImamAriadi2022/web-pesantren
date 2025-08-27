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
    // Get kelas data based on schema_clean.sql
    $stmt = $pdo->query("
        SELECT 
            id, 
            nama_kelas, 
            kode_kelas, 
            kapasitas,
            status,
            created_at
        FROM kelas 
        WHERE status = 'Aktif'
        ORDER BY nama_kelas ASC
    ");
    $kelas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data
    foreach ($kelas as &$k) {
        $k['kapasitas'] = $k['kapasitas'] ?? 30;
        $k['status'] = $k['status'] ?? 'Aktif';
        if ($k['created_at']) {
            $k['created_at'] = date('d/m/Y H:i', strtotime($k['created_at']));
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $kelas,
        'total' => count($kelas),
        'message' => 'Data kelas berhasil diambil'
    ]);
} catch (Exception $e) {
    error_log("Error in getAllClass.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>