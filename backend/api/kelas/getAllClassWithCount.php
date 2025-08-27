<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

try {
    // Get all classes with student count using schema_clean.sql structure
    $query = "SELECT 
                k.id,
                k.nama_kelas,
                k.kode_kelas,
                k.kapasitas,
                k.status,
                k.created_at,
                COUNT(s.id) as jumlah_santri
              FROM kelas k
              LEFT JOIN santri s ON k.id = s.kelas_id AND s.status = 'Aktif'
              GROUP BY k.id, k.nama_kelas, k.kode_kelas, k.kapasitas, k.status, k.created_at
              ORDER BY k.kode_kelas ASC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($result) {
        // Format the data
        $data = array_map(function($row) {
            return [
                'id' => (int)$row['id'],
                'nama_kelas' => $row['nama_kelas'],
                'kode_kelas' => $row['kode_kelas'],
                'kapasitas' => (int)$row['kapasitas'],
                'status' => $row['status'],
                'created_at' => date('d/m/Y H:i', strtotime($row['created_at'])),
                'jumlah_santri' => (int)$row['jumlah_santri']
            ];
        }, $result);
        
        echo json_encode([
            'success' => true,
            'data' => $data,
            'total' => count($data),
            'message' => 'Data kelas berhasil diambil'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => [],
            'total' => 0,
            'message' => 'Tidak ada data kelas'
        ]);
    }
    
} catch(PDOException $e) {
    error_log("Database Error in getAllClassWithCount.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan database: ' . $e->getMessage()
    ]);
} catch(Exception $e) {
    error_log("General Error in getAllClassWithCount.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}
?>
