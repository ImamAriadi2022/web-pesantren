<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: false");

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
    
    // Get santri info (sesuai schema_clean.sql)
    $santri_query = "
        SELECT 
            s.nama,
            s.nis,
            k.nama_kelas as kelas,
            'Belum ditetapkan' as wali_kelas
        FROM santri s
        LEFT JOIN kelas k ON s.kelas_id = k.id
        WHERE s.id = ?
        LIMIT 1
    ";
    
    $stmt = $pdo->prepare($santri_query);
    $stmt->execute([$santri_id]);
    $santri_info = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$santri_info) {
        throw new Exception('Data santri tidak ditemukan');
    }
    
    // Get nilai data - menggunakan struktur yang sama dengan kelola nilai
    $query = "
        SELECT 
            mp.nama_mapel,
            n.jenis_nilai,
            n.nilai,
            n.semester
        FROM nilai n
        LEFT JOIN mata_pelajaran mp ON n.mapel_id = mp.id
        WHERE n.santri_id = ?
        ORDER BY mp.nama_mapel, n.jenis_nilai
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$santri_id]);
    $nilai_raw = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Organize nilai by mapel
    $nilai_by_mapel = [];
    foreach ($nilai_raw as $n) {
        $mapel = $n['nama_mapel'];
        if (!isset($nilai_by_mapel[$mapel])) {
            $nilai_by_mapel[$mapel] = [
                'nama_mapel' => $mapel,
                'uts' => null,
                'uas' => null
            ];
        }
        
        if ($n['jenis_nilai'] === 'UTS') {
            $nilai_by_mapel[$mapel]['uts'] = $n['nilai'];
        } elseif ($n['jenis_nilai'] === 'UAS') {
            $nilai_by_mapel[$mapel]['uas'] = $n['nilai'];
        }
    }
    
    // Convert to indexed array
    $nilai_final = array_values($nilai_by_mapel);
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'santri' => $santri_info,
            'nilai' => $nilai_final
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error in getNilai.php: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage(),
        'debug' => [
            'santri_id' => $santri_id ?? 'null',
            'file' => __FILE__,
            'line' => $e->getLine()
        ]
    ]);
}
?>
