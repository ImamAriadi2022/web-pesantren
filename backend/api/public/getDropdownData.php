<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    // Get santri data
    $santriStmt = $pdo->query("SELECT id, nama, nis FROM santri WHERE status = 'Aktif' ORDER BY nama ASC");
    $santri = $santriStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get mapel data
    $mapelStmt = $pdo->query("SELECT id, nama_mapel, kode_mapel, kkm FROM mata_pelajaran WHERE status = 'Aktif' ORDER BY nama_mapel ASC");
    $mapel = $mapelStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get kelas data
    $kelasStmt = $pdo->query("SELECT id, nama_kelas, kode_kelas FROM kelas WHERE status = 'Aktif' ORDER BY nama_kelas ASC");
    $kelas = $kelasStmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'santri' => $santri,
            'mapel' => $mapel,
            'kelas' => $kelas
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
