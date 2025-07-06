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
        SELECT k.*, s.nama as nama_santri, s.nis
        FROM keuangan k
        LEFT JOIN santri s ON k.santri_id = s.id
        ORDER BY k.tanggal_transaksi DESC, k.created_at DESC
    ");
    $stmt->execute();
    $keuangan = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $keuangan
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
