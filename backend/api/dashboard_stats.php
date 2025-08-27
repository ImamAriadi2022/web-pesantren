<?php
header("Access-Control-Allow-Origin: *"); // atau spesifik ke domain Anda
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

try {
    // Get total santri
    $santriQuery = "SELECT COUNT(*) as total FROM santri WHERE status = 'Aktif'";
    $stmt = $pdo->prepare($santriQuery);
    $stmt->execute();
    $totalSantri = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get total pengajar (ustadz)
    $pengajarQuery = "SELECT COUNT(*) as total FROM ustadz WHERE status = 'Aktif'";
    $stmt = $pdo->prepare($pengajarQuery);
    $stmt->execute();
    $totalPengajar = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get total asrama
    $asramaQuery = "SELECT COUNT(*) as total FROM asrama WHERE status = 'Aktif'";
    $stmt = $pdo->prepare($asramaQuery);
    $stmt->execute();
    $totalAsrama = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get total PSB
    $psbQuery = "SELECT COUNT(*) as total FROM psb WHERE status IN ('Dibuka', 'Ditutup')";
    $stmt = $pdo->prepare($psbQuery);
    $stmt->execute();
    $totalPSB = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get total kelas
    $kelasQuery = "SELECT COUNT(*) as total FROM kelas WHERE status = 'Aktif'";
    $stmt = $pdo->prepare($kelasQuery);
    $stmt->execute();
    $totalKelas = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'totalSantri' => $totalSantri,
            'totalPengajar' => $totalPengajar,
            'totalAsrama' => $totalAsrama,
            'totalPSB' => $totalPSB,
            'totalKelas' => $totalKelas
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
