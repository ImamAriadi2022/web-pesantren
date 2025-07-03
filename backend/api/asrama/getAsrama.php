<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    $query = "
        SELECT 
            a.*,
            u.nama as penanggung_jawab_nama,
            COUNT(sa.id) as jumlah_penghuni
        FROM asrama a
        LEFT JOIN ustadz u ON a.penanggung_jawab_id = u.id
        LEFT JOIN santri_asrama sa ON a.id = sa.asrama_id AND sa.status = 'Aktif'
        GROUP BY a.id
        ORDER BY a.nama_asrama
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $asrama = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $asrama
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
