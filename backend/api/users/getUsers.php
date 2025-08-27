<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../../config/database.php';

try {
    // Get all users - simplified query without NIS/NIP
    $stmt = $pdo->query("
        SELECT 
            u.id,
            u.username,
            u.nama,
            u.role,
            u.status,
            u.created_at
        FROM users u
        ORDER BY u.created_at DESC
    ");
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Debug log untuk melihat data yang diambil
    error_log("Users found: " . count($users));
    if (count($users) > 0) {
        error_log("Sample user data: " . json_encode($users[0]));
    }
    
    // Format data untuk frontend
    foreach ($users as &$user) {
        $user['nama'] = $user['nama'] ?? 'Belum Diisi';
        $user['username'] = $user['username'] ?? 'Belum Diisi';
        $user['email'] = $user['username']; // Use username as email for display
        $user['created_at'] = date('d/m/Y H:i', strtotime($user['created_at']));
        $user['status'] = $user['status'] ?? 'Aktif';
    }
    
    echo json_encode([
        'success' => true, 
        'data' => $users,
        'total' => count($users)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Gagal memuat data pengguna: ' . $e->getMessage()
    ]);
}
?>