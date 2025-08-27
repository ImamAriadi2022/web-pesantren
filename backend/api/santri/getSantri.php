<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

try {
    // Get all santri data with kelas information based on schema_clean.sql
    $stmt = $pdo->query("
        SELECT 
            s.id,
            s.nis,
            s.nama,
            s.kelas_id,
            s.tempat_lahir,
            s.tanggal_lahir,
            s.jenis_kelamin,
            s.alamat,
            s.no_hp,
            s.nama_wali,
            s.no_hp_wali,
            s.foto,
            s.status,
            k.nama_kelas,
            s.created_at
        FROM santri s
        LEFT JOIN kelas k ON s.kelas_id = k.id
        ORDER BY s.created_at DESC
    ");
    
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data for frontend
    foreach ($data as &$santri) {
        // Format tanggal_lahir
        if ($santri['tanggal_lahir']) {
            $santri['tanggal_lahir'] = date('Y-m-d', strtotime($santri['tanggal_lahir']));
        }
        
        // Add asal_sekolah field for backward compatibility (can be added later)
        $santri['asal_sekolah'] = $santri['tempat_lahir'] ?? '-';
        
        // Format created_at
        if ($santri['created_at']) {
            $santri['created_at'] = date('d/m/Y H:i', strtotime($santri['created_at']));
        }
    }
    
    // Debug log
    error_log("Santri data found: " . count($data));
    if (count($data) > 0) {
        error_log("Sample santri data: " . json_encode($data[0]));
    }
    
    echo json_encode([
        'success' => true, 
        'data' => $data,
        'message' => 'Data santri berhasil diambil'
    ]);
    
} catch (Exception $e) {
    error_log("Error in getSantri.php: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'data' => [],
        'message' => 'Gagal mengambil data santri: ' . $e->getMessage()
    ]);
}