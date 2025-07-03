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
    $query = "
        SELECT 
            u.*,
            us.email
        FROM ustadz u
        LEFT JOIN users us ON u.user_id = us.id
        WHERE u.status = 'Aktif'
        ORDER BY u.nama
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $ustadz = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $ustadz
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
