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
            // Update existing asrama
            $stmt = $pdo->prepare("UPDATE asrama SET nama_asrama = ?, kode_asrama = ?, kapasitas = ?, lokasi = ?, jenis = ?, penanggung_jawab_id = ?, fasilitas = ?, status = ? WHERE id = ?");
            $stmt->execute([
                $input['nama_asrama'],
                $input['kode_asrama'], 
                $input['kapasitas'],
                $input['lokasi'] ?? '',
                $input['jenis'],
                $input['penanggung_jawab_id'] ?? null,
                $input['fasilitas'] ?? '',
                $input['status'] ?? 'Aktif',
                $input['id']
            ]);
            $message = 'Asrama berhasil diupdate';
        } else {
            // Create new asrama
            $stmt = $pdo->prepare("INSERT INTO asrama (nama_asrama, kode_asrama, kapasitas, lokasi, jenis, penanggung_jawab_id, fasilitas, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['nama_asrama'],
                $input['kode_asrama'],
                $input['kapasitas'],
                $input['lokasi'] ?? '',
                $input['jenis'],
                $input['penanggung_jawab_id'] ?? null,
                $input['fasilitas'] ?? '',
                $input['status'] ?? 'Aktif'
            ]);
            $message = 'Asrama berhasil ditambahkan';
        }
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => $message
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
