<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->prepare("
        SELECT n.*, s.nama as nama_santri, s.nis, mp.nama_mapel, mp.kkm as mapel_kkm, k.nama_kelas,
               COALESCE(n.kkm, mp.kkm, 75) as kkm,
               CASE WHEN n.nilai >= COALESCE(n.kkm, mp.kkm, 75) THEN 'Tuntas' ELSE 'Belum Tuntas' END as status_kelulusan
        FROM nilai n
        LEFT JOIN santri s ON n.santri_id = s.id
        LEFT JOIN mata_pelajaran mp ON n.mapel_id = mp.id
        LEFT JOIN santri_kelas sk ON s.id = sk.santri_id AND sk.status = 'Aktif'
        LEFT JOIN kelas k ON sk.kelas_id = k.id
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
