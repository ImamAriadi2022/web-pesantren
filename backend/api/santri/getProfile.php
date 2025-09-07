<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';
require_once '../../config/session_helper.php';

try {
    // Get santri_id from session or fallback to GET parameter for testing
    $santri_id = $_GET['santri_id'] ?? null;
    
    // If no santri_id in URL, try to get from session
    if (!$santri_id) {
        $santri_id = requireSantriSession();
    }
    
    // Get santri profile data
    $query = "
        SELECT 
            s.*,
            k.nama_kelas as kelas,
            k.kode_kelas
        FROM santri s
        LEFT JOIN kelas k ON s.kelas_id = k.id
        WHERE s.id = ?
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$santri_id]);
    $santri = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$santri) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Santri tidak ditemukan'
        ]);
        exit;
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $santri
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
