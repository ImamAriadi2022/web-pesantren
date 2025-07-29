<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['email']) || empty($data['role'])) {
    echo json_encode(['success' => false, 'message' => 'Email dan role wajib diisi']);
    exit;
}

try {
    // Check if status column exists, if not create it
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
    $columnExists = $stmt->fetchColumn();
    
    if (!$columnExists) {
        $pdo->exec("ALTER TABLE users ADD COLUMN status ENUM('aktif', 'nonaktif') DEFAULT 'aktif'");
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'PUT' && !empty($data['id'])) {
        // Update existing user
        if ($data['role'] === 'ustadz' || $data['role'] === 'pengajar') {
            // Update ustadz table
            $stmt = $pdo->prepare("UPDATE ustadz SET nama = ?, nik = ?, jenis_kelamin = ?, tanggal_lahir = ?, pendidikan_terakhir = ?, alamat = ?, nomor_hp = ?, email = ?, status = ? WHERE user_id = ?");
            $stmt->execute([
                $data['nama'] ?? '',
                $data['nik'] ?? '',
                $data['jenis_kelamin'] ?? '',
                $data['tanggal_lahir'] ?? null,
                $data['pendidikan_terakhir'] ?? '',
                $data['alamat'] ?? '',
                $data['nomor_hp'] ?? '',
                $data['email'],
                $data['status'] ?? 'aktif',
                $data['id']
            ]);
        }
        
        // Update users table with status
        $stmt = $pdo->prepare("UPDATE users SET email = ?, role = ?, status = ? WHERE id = ?");
        $stmt->execute([$data['email'], strtolower($data['role']), strtolower($data['status'] ?? 'aktif'), $data['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Data berhasil diperbarui']);
    } else {
        // Create new user
        $password = $data['password'] ?? '123456'; // Default password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Insert into users table with status
        $stmt = $pdo->prepare("INSERT INTO users (email, password, role, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['email'], $hashedPassword, strtolower($data['role']), strtolower($data['status'] ?? 'aktif')]);
        $user_id = $pdo->lastInsertId();
        
        // If role is ustadz/pengajar, insert into ustadz table
        if ($data['role'] === 'ustadz' || $data['role'] === 'pengajar') {
            $stmt = $pdo->prepare("INSERT INTO ustadz (user_id, nama, nik, jenis_kelamin, tanggal_lahir, pendidikan_terakhir, alamat, nomor_hp, email, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $user_id,
                $data['nama'] ?? '',
                $data['nik'] ?? '',
                $data['jenis_kelamin'] ?? '',
                $data['tanggal_lahir'] ?? null,
                $data['pendidikan_terakhir'] ?? '',
                $data['alamat'] ?? '',
                $data['nomor_hp'] ?? '',
                $data['email'],
                $data['status'] ?? 'aktif'
            ]);
        }
        
        echo json_encode(['success' => true, 'message' => 'User berhasil ditambahkan', 'user_id' => $user_id]);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}