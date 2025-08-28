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
    // First check if kelas_id column exists
    $checkColumn = $pdo->query("SHOW COLUMNS FROM mata_pelajaran LIKE 'kelas_id'");
    $hasKelasColumn = $checkColumn->rowCount() > 0;
    
    if ($hasKelasColumn) {
        // If kelas_id exists, use JOIN with kelas table
        $stmt = $pdo->query("
            SELECT mp.*, k.nama_kelas, k.kode_kelas 
            FROM mata_pelajaran mp 
            LEFT JOIN kelas k ON mp.kelas_id = k.id 
            ORDER BY mp.nama_mapel ASC
        ");
    } else {
        // If kelas_id doesn't exist, just get mata_pelajaran data
        $stmt = $pdo->query("
            SELECT * 
            FROM mata_pelajaran 
            ORDER BY nama_mapel ASC
        ");
    }
    
    $mapel = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $mapel,
        'has_kelas_column' => $hasKelasColumn
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
