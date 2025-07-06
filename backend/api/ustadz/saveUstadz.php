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
            $query = "UPDATE ustadz SET 
                nama = ?, 
                nik = ?, 
                jenis_kelamin = ?, 
                tanggal_lahir = ?, 
                alamat = ?, 
                telepon = ?, 
                email = ?, 
                pendidikan_terakhir = ?, 
                status = ?,
                foto = ?
            WHERE id = ?";
            
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute([
                $input['nama'],
                $input['nik'],
                $input['jenisKelamin'],
                $input['tanggalLahir'],
                $input['alamat'] ?? '',
                $input['telepon'] ?? '',
                $input['email'] ?? '',
                $input['pendidikanTerakhir'],
                $input['status'] ?? 'Aktif',
                $input['foto'] ?? ''
            ]);
        } else {
            // Insert
            $query = "INSERT INTO ustadz (
                nama, 
                nik, 
                jenis_kelamin, 
                tanggal_lahir, 
                alamat, 
                telepon, 
                email, 
                pendidikan_terakhir, 
                tanggal_masuk, 
                status,
                foto
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)";
            
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute([
                $input['nama'],
                $input['nik'],
                $input['jenisKelamin'],
                $input['tanggalLahir'],
                $input['alamat'] ?? '',
                $input['telepon'] ?? '',
                $input['email'] ?? '',
                $input['pendidikanTerakhir'],
                $input['status'] ?? 'Aktif',
                $input['foto'] ?? ''
            ]);
        }
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Data ustadz berhasil disimpan'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Gagal menyimpan data ustadz'
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
