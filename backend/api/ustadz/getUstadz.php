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
            us.email,
            us.role,
            us.created_at as user_created_at
        FROM ustadz u
        LEFT JOIN users us ON u.user_id = us.id
        ORDER BY u.nama
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $ustadzData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data for frontend
    foreach ($ustadzData as &$ustadz) {
        $ustadz['nomor_identitas'] = $ustadz['nik'];
        $ustadz['nomor_hp'] = $ustadz['telepon'];
        $ustadz['jenis_kelamin'] = $ustadz['jenis_kelamin'] ?? '';
        $ustadz['user_status'] = $ustadz['role'] ?? 'pengajar';
        // Ensure status field exists and has default value
        $ustadz['status'] = $ustadz['status'] ?? 'Aktif';
    }
    
    echo json_encode([
        'success' => true,
        'data' => $ustadzData
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
