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
    // Get kelas_id from query parameter
    $kelas_id = isset($_GET['kelas_id']) ? (int)$_GET['kelas_id'] : 0;
    
    if ($kelas_id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID Kelas tidak valid'
        ]);
        exit();
    }
    
    // Get class information first
    $classQuery = "SELECT id, nama_kelas, kode_kelas, kapasitas, status FROM kelas WHERE id = :kelas_id";
    $classStmt = $pdo->prepare($classQuery);
    $classStmt->bindParam(':kelas_id', $kelas_id, PDO::PARAM_INT);
    $classStmt->execute();
    $classInfo = $classStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$classInfo) {
        echo json_encode([
            'success' => false,
            'message' => 'Kelas tidak ditemukan'
        ]);
        exit();
    }
    
    // Get students in this class - using schema_clean.sql structure
    $query = "SELECT s.id, s.nis, s.nama, s.jenis_kelamin, s.tempat_lahir, 
                     s.tanggal_lahir, s.alamat, s.no_hp, s.nama_wali, s.no_hp_wali, s.status
              FROM santri s 
              WHERE s.kelas_id = :kelas_id 
              AND s.status = 'Aktif'
              ORDER BY s.nama ASC";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':kelas_id', $kelas_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Count total students
    $total = count($students);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'class_info' => $classInfo,
            'students' => $students,
            'total_students' => $total
        ],
        'message' => 'Data santri berhasil diambil'
    ]);
    
} catch(PDOException $e) {
    error_log("Database Error in getClassStudents.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan database: ' . $e->getMessage()
    ]);
} catch(Exception $e) {
    error_log("General Error in getClassStudents.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}
?>