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
        SELECT s.id, s.nama, s.nis, sk.tahun_ajaran, k.nama_kelas as kelas,
               YEAR(CURDATE()) - YEAR(s.tanggal_lahir) as umur,
               s.alamat, s.jenis_kelamin
        FROM santri s
        LEFT JOIN santri_kelas sk ON s.id = sk.santri_id AND sk.status = 'Aktif'
        LEFT JOIN kelas k ON sk.kelas_id = k.id
        WHERE s.status = 'Aktif'
        ORDER BY s.nama ASC
    ");
    $stmt->execute();
    $santri = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data untuk frontend
    $formattedData = array_map(function($item) {
        return [
            'id' => $item['id'],
            'name' => $item['nama'],
            'nis' => $item['nis'],
            'kelas' => $item['kelas'] ?? 'Belum Ada Kelas',
            'umur' => $item['umur'] ?? 0,
            'alamat' => $item['alamat'] ?? 'Alamat tidak diisi',
            'jenis_kelamin' => $item['jenis_kelamin']
        ];
    }, $santri);
    
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
