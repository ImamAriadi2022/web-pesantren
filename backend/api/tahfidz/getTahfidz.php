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

try {
    $stmt = $db->prepare("
        SELECT t.*, s.nama as nama_santri, s.nis,
               CONCAT(t.ayat_mulai, ' - ', t.ayat_selesai) as ayat,
               t.tanggal_mulai as mulai, t.tanggal_selesai as selesai
        FROM tahfidz t
        LEFT JOIN santri s ON t.santri_id = s.id
        ORDER BY t.created_at DESC
    ");
    $stmt->execute();
    $tahfidz = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $tahfidz
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
