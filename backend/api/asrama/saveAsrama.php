<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        if (isset($input['id']) && $input['id']) {
            // Update
            $query = "UPDATE asrama SET 
                nama_asrama = ?, 
                kode_asrama = ?, 
                kapasitas = ?, 
                lokasi = ?, 
                jenis = ?, 
                fasilitas = ?, 
                status = ?
            WHERE id = ?";
            
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute([
                $input['namaAsrama'],
                $input['kodeAsrama'] ?? strtoupper(substr($input['namaAsrama'], 0, 3)),
                $input['kapasitas'],
                $input['lokasi'],
                $input['jenis'],
                $input['fasilitas'],
                $input['status'],
                $input['id']
            ]);
        } else {
            // Insert
            $query = "INSERT INTO asrama (
                nama_asrama, 
                kode_asrama, 
                kapasitas, 
                lokasi, 
                jenis, 
                fasilitas, 
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute([
                $input['namaAsrama'],
                $input['kodeAsrama'] ?? strtoupper(substr($input['namaAsrama'], 0, 3)),
                $input['kapasitas'],
                $input['lokasi'],
                $input['jenis'],
                $input['fasilitas'],
                $input['status'] ?? 'Aktif'
            ]);
        }
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Data asrama berhasil disimpan'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Gagal menyimpan data asrama'
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
?>
