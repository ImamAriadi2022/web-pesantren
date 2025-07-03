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
    
    // Get absensi data
    $query = "
        SELECT 
            tanggal,
            status,
            keterangan
        FROM absensi 
        WHERE santri_id = ?
        ORDER BY tanggal DESC
        LIMIT 30
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$santri_id]);
    $absensi = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get summary
    $summaryQuery = "
        SELECT 
            COUNT(*) as total_hari,
            SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) as total_hadir,
            SUM(CASE WHEN status = 'Izin' THEN 1 ELSE 0 END) as total_izin,
            SUM(CASE WHEN status = 'Sakit' THEN 1 ELSE 0 END) as total_sakit,
            SUM(CASE WHEN status = 'Alpha' THEN 1 ELSE 0 END) as total_alpha
        FROM absensi 
        WHERE santri_id = ?
        AND tanggal >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    ";
    
    $summaryStmt = $pdo->prepare($summaryQuery);
    $summaryStmt->execute([$santri_id]);
    $summary = $summaryStmt->fetch(PDO::FETCH_ASSOC);
    
    $persentase_hadir = $summary['total_hari'] > 0 ? 
        round(($summary['total_hadir'] / $summary['total_hari']) * 100, 2) : 0;
    
    echo json_encode([
        'success' => true,
        'data' => [
            'absensi' => $absensi,
            'summary' => [
                'total_hari' => $summary['total_hari'],
                'total_hadir' => $summary['total_hadir'],
                'total_izin' => $summary['total_izin'],
                'total_sakit' => $summary['total_sakit'],
                'total_alpha' => $summary['total_alpha'],
                'persentase_hadir' => $persentase_hadir
            ]
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
