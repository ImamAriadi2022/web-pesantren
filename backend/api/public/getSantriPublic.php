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
    // Get data santri untuk public display dengan struktur database baru
    $stmt = $pdo->prepare("
        SELECT s.id, s.nama, s.nis, k.nama_kelas as kelas,
               YEAR(CURDATE()) - YEAR(s.tanggal_lahir) as umur,
               s.alamat, s.jenis_kelamin, s.foto
        FROM santri s
        LEFT JOIN kelas k ON s.kelas_id = k.id
        WHERE s.status = 'Aktif'
        ORDER BY s.nama ASC
        LIMIT 50
    ");
    $stmt->execute();
    $santri = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data untuk frontend
    $formattedData = array_map(function($item) {
        return [
            'id' => $item['id'],
            'nama' => $item['nama'],
            'nis' => $item['nis'],
            'kelas' => $item['kelas'] ?? 'Belum Ada Kelas',
            'umur' => $item['umur'] ?? 0,
            'alamat' => $item['alamat'] ?? '',
            'jenis_kelamin' => $item['jenis_kelamin'],
            'foto_url' => $item['foto'] ? 
                "http://localhost/web-pesantren/backend/api/santri/uploads/" . $item['foto'] : 
                "/images/default-avatar.png"
        ];
    }, $santri);
    
    echo json_encode([
        'success' => true,
        'data' => $formattedData,
        'total' => count($formattedData),
        'message' => 'Data santri berhasil diambil'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error mengambil data santri: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>
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
