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
    
    // Get santri profile data
    $query = "
        SELECT 
            s.*,
            u.email,
            k.nama_kelas as kelas,
            ust.nama as wali_kelas,
            a.nama_asrama as asrama,
            sa.nomor_kamar,
            sk.tahun_ajaran,
            sk.semester
        FROM santri s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN santri_kelas sk ON s.id = sk.santri_id AND sk.status = 'Aktif'
        LEFT JOIN kelas k ON sk.kelas_id = k.id
        LEFT JOIN ustadz ust ON k.wali_kelas_id = ust.id
        LEFT JOIN santri_asrama sa ON s.id = sa.santri_id AND sa.status = 'Aktif'
        LEFT JOIN asrama a ON sa.asrama_id = a.id
        WHERE s.id = ?
        LIMIT 1
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$santri_id]);
    $santri = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$santri) {
        // Fallback query without joins if no class assignment
        $fallback_query = "
            SELECT 
                s.*,
                u.email
            FROM santri s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        ";
        $fallback_stmt = $pdo->prepare($fallback_query);
        $fallback_stmt->execute([$santri_id]);
        $santri = $fallback_stmt->fetch(PDO::FETCH_ASSOC);
        
        // Add default values
        if ($santri) {
            $santri['kelas'] = null;
            $santri['wali_kelas'] = null;
            $santri['asrama'] = null;
            $santri['nomor_kamar'] = null;
            $santri['tahun_ajaran'] = null;
            $santri['semester'] = null;
        }
    }
    
    if ($santri) {
        echo json_encode([
            'status' => 'success',
            'data' => $santri
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Santri tidak ditemukan'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
