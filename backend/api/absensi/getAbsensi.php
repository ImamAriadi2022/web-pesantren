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
    $sql = "
    SELECT 
        a.id,
        a.santri_id,
        a.tanggal,
        a.status,
        a.keterangan,
        s.nama as nama_santri,
        s.nis,
        k.nama_kelas
    FROM absensi a
    LEFT JOIN santri s ON a.santri_id = s.id
    LEFT JOIN santri_kelas sk ON s.id = sk.santri_id AND sk.status = 'Aktif'
    LEFT JOIN kelas k ON sk.kelas_id = k.id
    ORDER BY a.tanggal DESC, s.nama
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $absensi = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $absensi
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
