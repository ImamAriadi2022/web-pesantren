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
        SELECT jp.*, k.nama_kelas, mp.nama_mapel, u.nama as nama_ustadz,
               CONCAT(jp.jam_mulai, ' - ', jp.jam_selesai) as jam
        FROM jadwal_pelajaran jp
        LEFT JOIN kelas k ON jp.kelas_id = k.id
        LEFT JOIN mata_pelajaran mp ON jp.mapel_id = mp.id  
        LEFT JOIN ustadz u ON jp.ustadz_id = u.id
        ORDER BY jp.hari, jp.jam_mulai
    ");
    $stmt->execute();
    $jadwal = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $jadwal
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
