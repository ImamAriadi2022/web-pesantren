<?php
require_once '../../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    // Get ustadz data based on schema_clean.sql
    $stmt = $pdo->query("
        SELECT 
            id,
            nip,
            nama,
            tempat_lahir,
            tanggal_lahir,
            jenis_kelamin,
            alamat,
            no_hp,
            pendidikan_terakhir,
            mata_pelajaran,
            foto,
            status,
            created_at
        FROM ustadz 
        ORDER BY nama ASC
    ");
    $ustadz = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data for frontend compatibility
    foreach ($ustadz as &$u) {
        $u['nomor_identitas'] = $u['nip']; // Map nip to nomor_identitas for frontend
        $u['nik'] = $u['nip']; // Map nip to nik for compatibility
        $u['nomor_hp'] = $u['no_hp']; // Map no_hp to nomor_hp
        $u['email'] = $u['nip'] . '@pesantren.com'; // Generate email from NIP
        
        // Format tanggal_lahir
        if ($u['tanggal_lahir']) {
            $u['tanggal_lahir'] = date('Y-m-d', strtotime($u['tanggal_lahir']));
        }
        
        // Format created_at
        if ($u['created_at']) {
            $u['created_at'] = date('d/m/Y H:i', strtotime($u['created_at']));
        }
        
        // Set default values
        $u['status'] = $u['status'] ?? 'Aktif';
        $u['pendidikan_terakhir'] = $u['pendidikan_terakhir'] ?? '';
        $u['mata_pelajaran'] = $u['mata_pelajaran'] ?? '';
    }
    
    // Debug log
    error_log("Ustadz data found: " . count($ustadz));
    if (count($ustadz) > 0) {
        error_log("Sample ustadz data: " . json_encode($ustadz[0]));
    }
    
    echo json_encode([
        'success' => true,
        'data' => $ustadz,
        'message' => 'Data ustadz berhasil diambil'
    ]);
} catch (Exception $e) {
    error_log("Error in getUstadz.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
