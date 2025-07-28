<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    // Get semua data untuk dropdown
    $data = [];
    
    // Get Santri
    $stmt = $pdo->prepare("SELECT id, nama, nis FROM santri WHERE status = 'Aktif' ORDER BY nama ASC");
    $stmt->execute();
    $data['santri'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get Ustadz
    $stmt = $pdo->prepare("SELECT id, nama, nik FROM ustadz WHERE status = 'Aktif' ORDER BY nama ASC");
    $stmt->execute();
    $data['ustadz'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get Kelas
    $stmt = $pdo->prepare("SELECT id, kode_kelas, nama_kelas FROM kelas WHERE status = 'Aktif' ORDER BY nama_kelas ASC");
    $stmt->execute();
    $data['kelas'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get Mata Pelajaran
    $stmt = $pdo->prepare("SELECT id, kode_mapel, nama_mapel FROM mata_pelajaran WHERE status = 'Aktif' ORDER BY nama_mapel ASC");
    $stmt->execute();
    $data['mapel'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get Asrama
    $stmt = $pdo->prepare("SELECT id, nama_asrama, jenis FROM asrama WHERE status = 'Aktif' ORDER BY nama_asrama ASC");
    $stmt->execute();
    $data['asrama'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
