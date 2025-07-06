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

// Untuk sementara hardcode user_id = 2 (pengajar), 
// nanti bisa dari session atau parameter
$user_id = $_GET['user_id'] ?? 2;

try {
    $stmt = $db->prepare("
        SELECT u.*, usr.email
        FROM ustadz u
        LEFT JOIN users usr ON u.user_id = usr.id
        WHERE u.user_id = ?
    ");
    $stmt->execute([$user_id]);
    $pengajar = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($pengajar) {
        echo json_encode([
            'success' => true,
            'data' => $pengajar
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Data pengajar tidak ditemukan'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
