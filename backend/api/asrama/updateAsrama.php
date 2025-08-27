<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        throw new Exception('Method not allowed');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validasi input
    $required_fields = ['id', 'nama_asrama', 'kode_asrama', 'kapasitas', 'jenis'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field {$field} tidak boleh kosong");
        }
    }
    
    // Cek apakah asrama exists
    $check_query = "SELECT id FROM asrama WHERE id = ?";
    $check_stmt = $pdo->prepare($check_query);
    $check_stmt->execute([$input['id']]);
    
    if ($check_stmt->rowCount() === 0) {
        throw new Exception('Data asrama tidak ditemukan');
    }
    
    // Cek apakah kode asrama sudah digunakan oleh asrama lain
    $check_code_query = "SELECT id FROM asrama WHERE kode_asrama = ? AND id != ?";
    $check_code_stmt = $pdo->prepare($check_code_query);
    $check_code_stmt->execute([$input['kode_asrama'], $input['id']]);
    
    if ($check_code_stmt->rowCount() > 0) {
        throw new Exception('Kode asrama sudah digunakan');
    }
    
    // Update data asrama
    $query = "UPDATE asrama SET 
        nama_asrama = ?, 
        kode_asrama = ?, 
        kapasitas = ?, 
        lokasi = ?, 
        jenis = ?, 
        penanggung_jawab = ?, 
        fasilitas = ?, 
        status = ?,
        updated_at = NOW()
    WHERE id = ?";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        $input['nama_asrama'],
        $input['kode_asrama'],
        (int)$input['kapasitas'],
        $input['lokasi'] ?? '',
        $input['jenis'],
        $input['penanggung_jawab'] ?? '',
        $input['fasilitas'] ?? '',
        $input['status'] ?? 'aktif',
        $input['id']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Data asrama berhasil diperbarui',
        'data' => [
            'id' => $input['id'],
            'nama_asrama' => $input['nama_asrama'],
            'kode_asrama' => $input['kode_asrama']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Database Error in updateAsrama.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan database: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General Error in updateAsrama.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
