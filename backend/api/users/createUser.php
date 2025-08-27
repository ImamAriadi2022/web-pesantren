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

// Debug logging
error_log("CreateUser API called - Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Data received: " . json_encode($data));

// Validasi input berdasarkan role
if (empty($data['role'])) {
    echo json_encode(['success' => false, 'message' => 'Role wajib diisi']);
    exit;
}

// Validasi berdasarkan role - sesuai schema_clean.sql
$roleCheck = strtolower($data['role']);
if ($roleCheck === 'admin' && (empty($data['email']) && empty($data['username']))) {
    echo json_encode(['success' => false, 'message' => 'Username atau email wajib diisi untuk admin']);
    exit;
}

if (in_array($roleCheck, ['santri', 'ustadz']) && empty($data['nama'])) {
    echo json_encode(['success' => false, 'message' => 'Nama wajib diisi']);
    exit;
}

try {
    $role = ucfirst(strtolower($data['role'])); // Ensure proper case
    $status = isset($data['status']) ? ucfirst(strtolower($data['status'])) : 'Aktif';
    
    if ($_SERVER['REQUEST_METHOD'] === 'PUT' && !empty($data['id'])) {
        // Update existing user in users table
        $fields = ['role = ?', 'status = ?'];
        $params = [$role, $status];
        
        // Add username if provided
        if (!empty($data['username'])) {
            $fields[] = 'username = ?';
            $params[] = $data['username'];
        }
        
        // Add nama if provided
        if (!empty($data['nama'])) {
            $fields[] = 'nama = ?';
            $params[] = $data['nama'];
        }
        
        // Add password if provided
        if (!empty($data['password'])) {
            $fields[] = 'password = ?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        
        $params[] = $data['id'];
        $query = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
        error_log("Update query: $query with params: " . json_encode($params));
        
        $stmt = $pdo->prepare($query);
        $success = $stmt->execute($params);
        error_log("Update result: " . ($success ? 'success' : 'failed') . ", rows affected: " . $stmt->rowCount());
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'User berhasil diperbarui']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui user']);
        }
    } else {
        // Create new user in users table
        $password = !empty($data['password']) ? $data['password'] : '123456'; // Default password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Generate username if not provided
        $username = '';
        $nama = '';
        
        if ($role === 'Admin') {
            $username = !empty($data['username']) ? $data['username'] : explode('@', $data['email'])[0];
            $nama = !empty($data['nama']) ? $data['nama'] : $username;
        } else {
            $nama = $data['nama'];
            $username = !empty($data['username']) ? $data['username'] : strtolower(str_replace(' ', '', $nama));
        }
        
        // Check if username already exists
        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $checkStmt->execute([$username]);
        if ($checkStmt->rowCount() > 0) {
            $username = $username . rand(100, 999); // Add random number if exists
        }
        
        // Insert into users table
        $stmt = $pdo->prepare("INSERT INTO users (username, password, nama, role, status) VALUES (?, ?, ?, ?, ?)");
        $success = $stmt->execute([$username, $hashedPassword, $nama, $role, $status]);
        $user_id = $pdo->lastInsertId();
        
        error_log("Insert result: " . ($success ? 'success' : 'failed') . ", new ID: $user_id");
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'User berhasil ditambahkan', 'user_id' => $user_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal menambahkan user']);
        }
    }
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>