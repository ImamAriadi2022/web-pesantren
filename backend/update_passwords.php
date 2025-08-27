<?php
require_once 'config/database.php';

header("Access-Control-Allow-Origin: *"); // atau spesifik ke domain Anda
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Script untuk memperbarui password semua user dengan hash yang benar
// Password yang akan diset: secret123

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Password yang akan digunakan untuk semua user
    $new_password = 'secret123';
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    
    echo "=== UPDATE PASSWORD USERS ===\n";
    echo "Password baru: $new_password\n";
    echo "Hash yang akan disimpan: $hashed_password\n\n";
    
    // Ambil semua user
    $stmt = $pdo->query("SELECT id, email, role FROM users ORDER BY id");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "User yang ditemukan:\n";
    foreach ($users as $user) {
        echo "- ID: {$user['id']}, Email: {$user['email']}, Role: {$user['role']}\n";
    }
    
    echo "\nMemperbarui password...\n";
    
    // Update password untuk semua user
    $update_stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    
    foreach ($users as $user) {
        $update_stmt->execute([$hashed_password, $user['id']]);
        echo "✓ Password berhasil diupdate untuk: {$user['email']}\n";
    }
    
    echo "\n=== VERIFIKASI HASH ===\n";
    
    // Verifikasi hash yang tersimpan
    $verify_stmt = $pdo->query("SELECT id, email, password FROM users ORDER BY id");
    $users_updated = $verify_stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($users_updated as $user) {
        $stored_hash = $user['password'];
        $is_valid = password_verify($new_password, $stored_hash);
        
        echo "\nUser: {$user['email']}\n";
        echo "Hash tersimpan: " . substr($stored_hash, 0, 50) . "...\n";
        echo "Verifikasi dengan '$new_password': " . ($is_valid ? '✓ BERHASIL' : '✗ GAGAL') . "\n";
        
        // Cek format hash
        if (substr($stored_hash, 0, 4) === '$2y$') {
            echo "Format hash: ✓ bcrypt valid\n";
        } else {
            echo "Format hash: ✗ bukan bcrypt yang valid\n";
        }
    }
    
    echo "\n=== INSTRUKSI LOGIN ===\n";
    echo "Setelah menjalankan script ini, gunakan kredensial berikut untuk login:\n\n";
    
    foreach ($users_updated as $user) {
        echo "Email: {$user['email']}\n";
        echo "Password: $new_password\n";
        echo "Role: " . strtoupper($user['id'] == 1 ? 'admin' : ($user['id'] <= 6 ? 'pengajar' : 'santri')) . "\n";
        echo "---\n";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "\nPastikan:\n";
    echo "1. Database sudah diimport\n";
    echo "2. Konfigurasi database di config/database.php benar\n";
    echo "3. MySQL server berjalan\n";
}
?>
