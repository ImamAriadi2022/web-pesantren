<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    $stmt = $pdo->prepare("
        SELECT n.*, s.nama as nama_santri, s.nis, mp.nama_mapel, k.nama_kelas
        FROM nilai n
        LEFT JOIN santri s ON n.santri_id = s.id
        LEFT JOIN mata_pelajaran mp ON n.mapel_id = mp.id
        LEFT JOIN kelas k ON s.kelas_id = k.id
        ORDER BY n.created_at DESC
    ");
    $stmt->execute();
    $nilai = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $nilai
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
