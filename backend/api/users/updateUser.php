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

if (empty($data['id']) || empty($data['role'])) {
    echo json_encode(['success' => false, 'message' => 'ID dan role wajib diisi']);
    exit;
}

try {
    $role = ucfirst(strtolower($data['role'])); // Ensure proper case
    $status = isset($data['status']) ? ucfirst(strtolower($data['status'])) : 'Aktif';
    
    // Update berdasarkan role ke tabel yang sesuai
    if ($role === 'Admin') {
        // Validasi email untuk admin
        if (empty($data['email'])) {
            echo json_encode(['success' => false, 'message' => 'Email wajib diisi untuk admin']);
            exit;
        }
        
        // Update admin di tabel admin
        $fields = ['email = ?', 'status = ?'];
        $params = [$data['email'], $status];
        
        if (!empty($data['password'])) {
            $fields[] = 'password = ?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        
        $params[] = $data['id'];
        $stmt = $pdo->prepare("UPDATE admin SET " . implode(', ', $fields) . " WHERE id = ?");
        $success = $stmt->execute($params);
    } else if ($role === 'Ustadz') {
        // Validasi nama untuk ustadz
        if (empty($data['nama'])) {
            echo json_encode(['success' => false, 'message' => 'Nama wajib diisi untuk ustadz']);
            exit;
        }
        
        // Update ustadz di tabel ustadz
        $fields = ['nama = ?', 'status = ?'];
        $params = [$data['nama'], $status];
        
        if (!empty($data['password'])) {
            $fields[] = 'password = ?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        
        $params[] = $data['id'];
        $stmt = $pdo->prepare("UPDATE ustadz SET " . implode(', ', $fields) . " WHERE id = ?");
        $success = $stmt->execute($params);
    } else if ($role === 'Santri') {
        // Validasi nama untuk santri
        if (empty($data['nama'])) {
            echo json_encode(['success' => false, 'message' => 'Nama wajib diisi untuk santri']);
            exit;
        }
        
        // Update santri di tabel santri
        $fields = ['nama = ?', 'status = ?'];
        $params = [$data['nama'], $status];
        
        if (!empty($data['password'])) {
            $fields[] = 'password = ?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        
        $params[] = $data['id'];
        $stmt = $pdo->prepare("UPDATE santri SET " . implode(', ', $fields) . " WHERE id = ?");
        $success = $stmt->execute($params);
    } else {
        echo json_encode(['success' => false, 'message' => 'Role tidak valid']);
        exit;
    }
    
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'User berhasil diperbarui']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal memperbarui user']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>