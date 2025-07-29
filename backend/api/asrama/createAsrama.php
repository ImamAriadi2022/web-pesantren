<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validasi input
    $required_fields = ['nama_asrama', 'kode_asrama', 'kapasitas', 'jenis'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field {$field} tidak boleh kosong");
        }
    }
    
    // Cek apakah kode asrama sudah ada
    $check_query = "SELECT id FROM asrama WHERE kode_asrama = ?";
    $check_stmt = $pdo->prepare($check_query);
    $check_stmt->execute([$input['kode_asrama']]);
    
    if ($check_stmt->rowCount() > 0) {
        throw new Exception('Kode asrama sudah digunakan');
    }
    
    // Insert data asrama baru
    $query = "INSERT INTO asrama (
        nama_asrama, 
        kode_asrama, 
        kapasitas, 
        lokasi, 
        jenis, 
        penanggung_jawab, 
        fasilitas, 
        status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        $input['nama_asrama'],
        $input['kode_asrama'],
        (int)$input['kapasitas'],
        $input['lokasi'] ?? '',
        $input['jenis'],
        $input['penanggung_jawab'] ?? '',
        $input['fasilitas'] ?? '',
        $input['status'] ?? 'aktif'
    ]);
    
    $asrama_id = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Data asrama berhasil ditambahkan',
        'data' => [
            'id' => $asrama_id,
            'nama_asrama' => $input['nama_asrama'],
            'kode_asrama' => $input['kode_asrama']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Database Error in createAsrama.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan database: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General Error in createAsrama.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
