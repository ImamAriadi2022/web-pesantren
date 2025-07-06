<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Total Santri
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM santri WHERE status = 'Aktif'");
    $stmt->execute();
    $totalSantri = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Total Pengajar
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM ustadz WHERE status = 'Aktif'");
    $stmt->execute();
    $totalPengajar = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Total Asrama
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM asrama WHERE status = 'Aktif'");
    $stmt->execute();
    $totalAsrama = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $data = [
        [
            'id' => 1,
            'title' => 'Total Santri',
            'value' => (int)$totalSantri,
            'logo' => 'path/to/logo1.png',
            'alt' => 'Total Santri Logo'
        ],
        [
            'id' => 2,
            'title' => 'Total Pengajar',
            'value' => (int)$totalPengajar,
            'logo' => 'path/to/logo2.png',
            'alt' => 'Total Pengajar Logo'
        ],
        [
            'id' => 3,
            'title' => 'Total Asrama',
            'value' => (int)$totalAsrama,
            'logo' => 'path/to/logo3.png',
            'alt' => 'Total Asrama Logo'
        ]
    ];
    
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
