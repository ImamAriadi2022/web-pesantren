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
        SELECT u.id, u.nama, u.nip, u.mata_pelajaran,
               YEAR(CURDATE()) - YEAR(u.tanggal_lahir) as umur,
               u.alamat, u.jenis_kelamin, u.foto, u.pendidikan_terakhir
        FROM ustadz u
        WHERE u.status = 'Aktif'
        ORDER BY u.nama ASC
        LIMIT 50
    ");
    $stmt->execute();
    $ustadz = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data untuk frontend
    $formattedData = array_map(function($item) {
        return [
            'id' => $item['id'],
            'nama' => $item['nama'],
            'nip' => $item['nip'],
            'mata_pelajaran' => $item['mata_pelajaran'] ?? 'Belum Ada Bidang',
            'pendidikan_terakhir' => $item['pendidikan_terakhir'] ?? '',
            'umur' => $item['umur'] ?? 0,
            'alamat' => $item['alamat'] ?? '',
            'jenis_kelamin' => $item['jenis_kelamin'],
            'foto_url' => $item['foto'] ? 
                "http://localhost/web-pesantren/backend/api/ustadz/uploads/" . $item['foto'] : 
                "/images/default-avatar.png"
        ];
    }, $ustadz);
    
    echo json_encode([
        'success' => true,
        'data' => $formattedData,
        'total' => count($formattedData),
        'message' => 'Data ustadz berhasil diambil'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error mengambil data ustadz: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
