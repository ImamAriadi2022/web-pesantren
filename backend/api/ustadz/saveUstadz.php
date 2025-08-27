<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Log input for debugging
    error_log("saveUstadz input: " . json_encode($input));
    
    try {
        // Validasi data wajib
        if (empty($input['nama']) || empty($input['nik'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Nama dan NIK wajib diisi'
            ]);
            exit;
        }
        
        $pdo->beginTransaction();
        
        if (isset($input['id']) && $input['id']) {
            // Update ustadz berdasarkan schema_clean.sql
            
            // Cek apakah NIP sudah digunakan oleh ustadz lain
            $checkNip = $pdo->prepare("SELECT id FROM ustadz WHERE nip = ? AND id != ?");
            $checkNip->execute([$input['nik'], $input['id']]);
            if ($checkNip->rowCount() > 0) {
                echo json_encode([
                    'success' => false,
                    'message' => 'NIP sudah digunakan oleh ustadz lain'
                ]);
                exit;
            }
            
            // Proses foto jika ada
            $fotoPath = null;
            if (!empty($input['foto'])) {
                $fotoData = $input['foto'];
                if (preg_match('/^data:image\/(\w+);base64,/', $fotoData, $type)) {
                    $fotoData = substr($fotoData, strpos($fotoData, ',') + 1);
                    $type = strtolower($type[1]);
                    $fotoData = base64_decode($fotoData);
                    $fileName = 'ustadz_' . time() . '_' . uniqid() . '.' . $type;
                    $uploadDir = __DIR__ . '/uploads/';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }
                    $filePath = $uploadDir . $fileName;
                    file_put_contents($filePath, $fotoData);
                    $fotoPath = 'uploads/' . $fileName;
                }
            }
            
            $query = "UPDATE ustadz SET 
                nip = ?, 
                nama = ?, 
                tempat_lahir = ?,
                tanggal_lahir = ?, 
                jenis_kelamin = ?, 
                alamat = ?, 
                no_hp = ?, 
                pendidikan_terakhir = ?, 
                mata_pelajaran = ?,
                status = ?";
            
            $params = [
                $input['nik'], // nip
                $input['nama'],
                $input['tempat_lahir'] ?? '',
                $input['tanggalLahir'] ?? $input['tanggal_lahir'] ?? null,
                $input['jenisKelamin'] ?? $input['jenis_kelamin'],
                $input['alamat'] ?? '',
                $input['telepon'] ?? $input['nomor_hp'] ?? '',
                $input['pendidikanTerakhir'] ?? $input['pendidikan_terakhir'] ?? '',
                $input['mata_pelajaran'] ?? '',
                $input['status'] ?? 'Aktif'
            ];
            
            if ($fotoPath) {
                $query .= ", foto = ?";
                $params[] = $fotoPath;
            }
            
            $query .= " WHERE id = ?";
            $params[] = $input['id'];
            
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute($params);
            
            // Update user account jika ada
            if (!empty($input['password'])) {
                $userUpdateSql = "UPDATE users SET password = ?, nama = ? WHERE username = ?";
                $userParams = [
                    password_hash($input['password'], PASSWORD_BCRYPT), 
                    $input['nama'],
                    $input['nik'] // username berdasarkan NIP
                ];
                $userStmt = $pdo->prepare($userUpdateSql);
                $userStmt->execute($userParams);
            }
            
        } else {
            // Insert ustadz baru
            
            // Cek apakah NIP sudah ada
            $checkNip = $pdo->prepare("SELECT id FROM ustadz WHERE nip = ?");
            $checkNip->execute([$input['nik']]);
            if ($checkNip->rowCount() > 0) {
                echo json_encode([
                    'success' => false,
                    'message' => 'NIP sudah terdaftar'
                ]);
                exit;
            }
            
            // Proses foto jika ada
            $fotoPath = '';
            if (!empty($input['foto'])) {
                $fotoData = $input['foto'];
                if (preg_match('/^data:image\/(\w+);base64,/', $fotoData, $type)) {
                    $fotoData = substr($fotoData, strpos($fotoData, ',') + 1);
                    $type = strtolower($type[1]);
                    $fotoData = base64_decode($fotoData);
                    $fileName = 'ustadz_' . time() . '_' . uniqid() . '.' . $type;
                    $uploadDir = __DIR__ . '/uploads/';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }
                    $filePath = $uploadDir . $fileName;
                    file_put_contents($filePath, $fotoData);
                    $fotoPath = 'uploads/' . $fileName;
                }
            }
            
            // Insert ustadz berdasarkan schema_clean.sql
            $query = "INSERT INTO ustadz (
                nip,
                nama, 
                tempat_lahir,
                tanggal_lahir, 
                jenis_kelamin, 
                alamat, 
                no_hp, 
                pendidikan_terakhir, 
                mata_pelajaran,
                foto,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute([
                $input['nik'], // nip
                $input['nama'],
                $input['tempat_lahir'] ?? '',
                $input['tanggalLahir'] ?? $input['tanggal_lahir'] ?? null,
                $input['jenisKelamin'] ?? $input['jenis_kelamin'],
                $input['alamat'] ?? '',
                $input['telepon'] ?? $input['nomor_hp'] ?? '',
                $input['pendidikanTerakhir'] ?? $input['pendidikan_terakhir'] ?? '',
                $input['mata_pelajaran'] ?? '',
                $fotoPath,
                $input['status'] ?? 'Aktif'
            ]);
            
            // Buat user account untuk ustadz jika ada email/password
            if (!empty($input['email']) && !empty($input['password'])) {
                $hashedPassword = password_hash($input['password'], PASSWORD_BCRYPT);
                $userStmt = $pdo->prepare("
                    INSERT INTO users (username, password, nama, role, status) 
                    VALUES (?, ?, ?, 'Ustadz', 'Aktif')
                ");
                $userStmt->execute([
                    $input['nik'], // username menggunakan NIP
                    $hashedPassword,
                    $input['nama']
                ]);
            }
        }
        
        $pdo->commit();
        
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
        if ($pdo->inTransaction()) {
            $pdo->rollback();
        }
        error_log("Error in saveUstadz.php: " . $e->getMessage());
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
