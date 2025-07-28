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
    // Total Santri
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM santri WHERE status = 'Aktif'");
    $stmt->execute();
    $totalSantri = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Total Pengajar (Ustadz)
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM ustadz WHERE status = 'Aktif'");
    $stmt->execute();
    $totalPengajar = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Total Asrama
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM asrama WHERE status = 'Aktif'");
    $stmt->execute();
    $totalAsrama = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Format data sesuai yang diharapkan frontend
    $data = [
        [
            'id' => 1,
            'title' => 'Total Santri',
            'value' => (int)$totalSantri,
            'alt' => 'Total Santri Logo'
        ],
        [
            'id' => 2,
            'title' => 'Total Pengajar',
            'value' => (int)$totalPengajar,
            'alt' => 'Total Pengajar Logo'
        ],
        [
            'id' => 3,
            'title' => 'Total Asrama',
            'value' => (int)$totalAsrama,
            'alt' => 'Total Asrama Logo'
        ]
    ];

    $response = [
        'success' => true,
        'data' => $data
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
