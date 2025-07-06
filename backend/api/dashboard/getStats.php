<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';

try {
    // Count total santri
    $querySantri = "SELECT COUNT(*) as total FROM santri WHERE status = 'Aktif'";
    $stmtSantri = $pdo->prepare($querySantri);
    $stmtSantri->execute();
    $totalSantri = $stmtSantri->fetch(PDO::FETCH_ASSOC)['total'];

    // Count total pengajar/ustadz
    $queryUstadz = "SELECT COUNT(*) as total FROM ustadz WHERE status = 'Aktif'";
    $stmtUstadz = $pdo->prepare($queryUstadz);
    $stmtUstadz->execute();
    $totalPengajar = $stmtUstadz->fetch(PDO::FETCH_ASSOC)['total'];

    // Count total asrama
    $queryAsrama = "SELECT COUNT(*) as total FROM asrama WHERE status = 'Aktif'";
    $stmtAsrama = $pdo->prepare($queryAsrama);
    $stmtAsrama->execute();
    $totalAsrama = $stmtAsrama->fetch(PDO::FETCH_ASSOC)['total'];

    // Count total PSB
    $queryPSB = "SELECT COUNT(*) as total FROM psb WHERE status = 'Aktif'";
    $stmtPSB = $pdo->prepare($queryPSB);
    $stmtPSB->execute();
    $totalPSB = $stmtPSB->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        'success' => true,
        'data' => [
            'totalSantri' => (int)$totalSantri,
            'totalPengajar' => (int)$totalPengajar,
            'totalAsrama' => (int)$totalAsrama,
            'totalPSB' => (int)$totalPSB
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
