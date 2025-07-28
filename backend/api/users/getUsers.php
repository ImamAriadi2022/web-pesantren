<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../../config/database.php';

try {
    // Get all users with additional info
    $stmt = $pdo->query("
        SELECT 
            u.id,
            u.email, 
            u.role,
            u.created_at,
            CASE 
                WHEN u.role = 'santri' THEN s.nama
                WHEN u.role = 'pengajar' THEN us.nama  
                ELSE 'Administrator'
            END as nama,
            CASE 
                WHEN u.role = 'santri' THEN s.nis
                WHEN u.role = 'pengajar' THEN us.nik
                ELSE NULL
            END as nomor_identitas
        FROM users u
        LEFT JOIN santri s ON u.id = s.user_id AND u.role = 'santri'
        LEFT JOIN ustadz us ON u.id = us.user_id AND u.role = 'pengajar'
        ORDER BY u.created_at DESC
    ");
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data untuk frontend
    foreach ($users as &$user) {
        $user['nama'] = $user['nama'] ?? 'Belum Diisi';
        $user['nomor_identitas'] = $user['nomor_identitas'] ?? '-';
        $user['created_at'] = date('d/m/Y H:i', strtotime($user['created_at']));
        $user['status'] = 'Aktif'; // Default status since column doesn't exist
    }
    
    echo json_encode([
        'success' => true, 
        'data' => $users,
        'total' => count($users)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Error: ' . $e->getMessage()
    ]);
}