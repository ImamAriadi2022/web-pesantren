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
    $stmt = $pdo->prepare("
        SELECT u.id, u.nama, u.nik, u.bidang_keahlian as mataPelajaran,
               YEAR(CURDATE()) - YEAR(u.tanggal_lahir) as umur,
               u.alamat, u.jenis_kelamin
        FROM ustadz u
        WHERE u.status = 'Aktif'
        ORDER BY u.nama ASC
    ");
    $stmt->execute();
    $ustadz = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data untuk frontend
    $formattedData = array_map(function($item) {
        return [
            'id' => $item['id'],
            'name' => $item['nama'],
            'nik' => $item['nik'],
            'mataPelajaran' => $item['mataPelajaran'] ?? 'Belum Ada Bidang',
            'umur' => $item['umur'] ?? 0,
            'alamat' => $item['alamat'] ?? 'Alamat tidak diisi',
            'jenis_kelamin' => $item['jenis_kelamin']
        ];
    }, $ustadz);
    
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
