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
    $santri_id = $_GET['santri_id'] ?? 1; // Default untuk testing
    
    // Get tahfidz data for santri
    $query = "
        SELECT 
            t.*,
            u.nama as pembimbing_nama
        FROM tahfidz t
        LEFT JOIN ustadz u ON t.pembimbing_id = u.id
        WHERE t.santri_id = ?
        ORDER BY t.tanggal_mulai DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$santri_id]);
    $tahfidz = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get santri info
    $santriQuery = "SELECT nama, nis FROM santri WHERE id = ?";
    $stmt = $pdo->prepare($santriQuery);
    $stmt->execute([$santri_id]);
    $santriInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'santri' => $santriInfo,
            'tahfidz' => $tahfidz
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
