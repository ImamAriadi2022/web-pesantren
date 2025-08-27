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

if (empty($data['username']) || empty($data['role'])) {
    echo json_encode(['success' => false, 'message' => 'Username dan role wajib diisi']);
    exit;
}

try {
    // Convert status to proper case for ENUM values
    $status = isset($data['status']) ? ucfirst(strtolower($data['status'])) : 'Aktif';
    $role = strtolower($data['role']);
    
    if ($_SERVER['REQUEST_METHOD'] === 'PUT' && !empty($data['id'])) {
        // Update existing user
        $fields = ['username=?', 'role=?', 'status=?'];
        $params = [$data['username'], $role, $status];
        
        // Add password if provided
        if (!empty($data['password'])) {
            $fields[] = 'password=?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        
        // Add ID parameter for WHERE clause
        $params[] = $data['id'];
        
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id=?";
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute($params);
        
        // Update related tables based on role
        if ($success && ($role === 'ustadz' || $role === 'pengajar')) {
            // Check if ustadz record exists
            $checkStmt = $pdo->prepare("SELECT id FROM ustadz WHERE user_id = ?");
            $checkStmt->execute([$data['id']]);
            
            if ($checkStmt->rowCount() > 0) {
                // Update existing ustadz record
                $ustadzStmt = $pdo->prepare("UPDATE ustadz SET nama = ?, email = ?, status = ? WHERE user_id = ?");
                $ustadzStmt->execute([
                    $data['nama'] ?? '',
                    $data['email'],
                    $status,
                    $data['id']
                ]);
            } else {
                // Create new ustadz record
                $ustadzStmt = $pdo->prepare("INSERT INTO ustadz (user_id, nama, email, status) VALUES (?, ?, ?, ?)");
                $ustadzStmt->execute([
                    $data['id'],
                    $data['nama'] ?? '',
                    $data['email'],
                    $status
                ]);
            }
        } else if ($success && $role === 'santri') {
            // Check if santri record exists
            $checkStmt = $pdo->prepare("SELECT id FROM santri WHERE user_id = ?");
            $checkStmt->execute([$data['id']]);
            
            if ($checkStmt->rowCount() > 0) {
                // Update existing santri record
                $santriStmt = $pdo->prepare("UPDATE santri SET nama = ?, status = ? WHERE user_id = ?");
                $santriStmt->execute([
                    $data['nama'] ?? '',
                    $status,
                    $data['id']
                ]);
            } else if (!empty($data['nama'])) {
                // Create new santri record with auto-generated NIS
                $nisStmt = $pdo->query("SELECT nis FROM santri WHERE nis REGEXP '^[0-9]+$' ORDER BY CAST(nis AS UNSIGNED) DESC LIMIT 1");
                $lastNis = $nisStmt->fetchColumn();
                $newNis = $lastNis ? (string)((int)$lastNis + 1) : '1001';
                
                $santriStmt = $pdo->prepare("INSERT INTO santri (user_id, nama, nis, status, tanggal_masuk) VALUES (?, ?, ?, ?, CURDATE())");
                $santriStmt->execute([
                    $data['id'],
                    $data['nama'],
                    $newNis,
                    $status
                ]);
            }
        }
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'User berhasil diperbarui']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui user']);
        }
    } else {
        // Create new user
        $password = !empty($data['password']) ? $data['password'] : '123456'; // Default password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Check if username already exists
        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $checkStmt->execute([$data['username']]);
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Username sudah digunakan']);
            exit;
        }
        
        // Insert into users table
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)");
        $success = $stmt->execute([$data['username'], $hashedPassword, $role, $status]);
        $user_id = $pdo->lastInsertId();
        
        // Insert into related tables based on role
        if ($success && ($role === 'ustadz' || $role === 'pengajar')) {
            $ustadzStmt = $pdo->prepare("INSERT INTO ustadz (user_id, nama, status) VALUES (?, ?, ?)");
            $ustadzStmt->execute([
                $user_id,
                $data['nama'] ?? '',
                $status
            ]);
        } else if ($success && $role === 'santri' && !empty($data['nama'])) {
            // Auto-generate NIS for new santri
            $nisStmt = $pdo->query("SELECT nis FROM santri WHERE nis REGEXP '^[0-9]+$' ORDER BY CAST(nis AS UNSIGNED) DESC LIMIT 1");
            $lastNis = $nisStmt->fetchColumn();
            $newNis = $lastNis ? (string)((int)$lastNis + 1) : '1001';
            
            $santriStmt = $pdo->prepare("INSERT INTO santri (user_id, nama, nis, status, tanggal_masuk) VALUES (?, ?, ?, ?, CURDATE())");
            $santriStmt->execute([
                $user_id,
                $data['nama'],
                $newNis,
                $status
            ]);
        }
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'User berhasil ditambahkan', 'user_id' => $user_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal menambahkan user']);
        }
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
}