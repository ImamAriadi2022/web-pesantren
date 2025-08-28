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
    
    // Get jadwal for specific santri based on their class
    $query = "
        SELECT 
            jp.hari,
            jp.jam_mulai,
            jp.jam_selesai,
            mp.nama_mapel,
            u.nama as nama_ustadz,
            jp.ruangan
        FROM jadwal_pelajaran jp
        JOIN mata_pelajaran mp ON jp.mapel_id = mp.id
        JOIN ustadz u ON jp.ustadz_id = u.id
        JOIN kelas k ON jp.kelas_id = k.id
        JOIN santri s ON s.kelas_id = k.id
        WHERE s.id = ?
        AND s.status = 'Aktif'
        ORDER BY 
            FIELD(jp.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'),
            jp.jam_mulai
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$santri_id]);
    $jadwal = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Organize jadwal by day
    $jadwal_by_day = [
        'Senin' => [],
        'Selasa' => [],
        'Rabu' => [],
        'Kamis' => [],
        'Jumat' => [],
        'Sabtu' => []
    ];
    
    foreach ($jadwal as $j) {
        $jadwal_by_day[$j['hari']][] = [
            'jam' => $j['jam_mulai'] . ' - ' . $j['jam_selesai'],
            'mapel' => $j['nama_mapel'],
            'ustadz' => $j['nama_ustadz'],
            'ruangan' => $j['ruangan']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $jadwal_by_day
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
