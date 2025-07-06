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
    $stmt = $db->prepare("
        SELECT a.nama_asrama as nama, a.kapasitas, a.lokasi, a.jenis, 
               a.fasilitas, a.status,
               u.nama as penanggungJawab
        FROM asrama a
        LEFT JOIN ustadz u ON a.penanggung_jawab_id = u.id
        WHERE a.status = 'Aktif'
        ORDER BY a.nama_asrama ASC
    ");
    $stmt->execute();
    $asrama = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data untuk frontend
    $formattedData = array_map(function($item) {
        return [
            'id' => $item['nama'],
            'nama' => $item['nama'],
            'kapasitas' => $item['kapasitas'],
            'lokasi' => $item['lokasi'] ?? 'Lokasi tidak diisi',
            'jenis' => $item['jenis'],
            'penanggungJawab' => $item['penanggungJawab'] ?? 'Belum ada',
            'fasilitas' => $item['fasilitas'] ?? 'Fasilitas tidak diisi',
            'status' => $item['status']
        ];
    }, $asrama);
    
    echo json_encode([
        'success' => true,
        'data' => $formattedData
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
