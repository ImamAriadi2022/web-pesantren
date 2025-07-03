<?php
require_once 'config/database.php';

// Script untuk test login secara langsung
// Meniru proses yang ada di api/login.php

echo "=== TEST LOGIN ===\n\n";

// Data login yang akan ditest
$test_credentials = [
    ['email' => 'admin@pesantren.com', 'password' => 'admin'],
    ['email' => 'pengajar1@pesantren.com', 'password' => 'admin'],
    ['email' => 'santri1@pesantren.com', 'password' => 'admin']
];

try {
    foreach ($test_credentials as $credential) {
        echo "Testing login: {$credential['email']}\n";
        echo "Password: {$credential['password']}\n";
        
        // Cari user berdasarkan email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$credential['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo "✓ User ditemukan di database\n";
            echo "  - ID: {$user['id']}\n";
            echo "  - Email: {$user['email']}\n";
            echo "  - Role: {$user['role']}\n";
            echo "  - Hash tersimpan: " . substr($user['password'], 0, 30) . "...\n";
            
            // Test verifikasi password
            $password_valid = password_verify($credential['password'], $user['password']);
            echo "  - Verifikasi password: " . ($password_valid ? '✓ BERHASIL' : '✗ GAGAL') . "\n";
            
            if ($password_valid) {
                echo "  - Status: ✓ LOGIN BERHASIL\n";
            } else {
                echo "  - Status: ✗ LOGIN GAGAL - Password tidak cocok\n";
                
                // Coba verifikasi dengan password lain
                $other_passwords = ['secret123', 'admin123', 'password', '123456'];
                echo "  - Mencoba password lain:\n";
                foreach ($other_passwords as $test_pass) {
                    $test_valid = password_verify($test_pass, $user['password']);
                    echo "    * '$test_pass': " . ($test_valid ? '✓' : '✗') . "\n";
                }
            }
        } else {
            echo "✗ User tidak ditemukan di database\n";
        }
        
        echo "\n" . str_repeat("-", 50) . "\n\n";
    }
    
    // Test dengan hash manual
    echo "=== TEST HASH MANUAL ===\n\n";
    $manual_password = 'admin';
    $manual_hash = password_hash($manual_password, PASSWORD_DEFAULT);
    $manual_verify = password_verify($manual_password, $manual_hash);
    
    echo "Password: $manual_password\n";
    echo "Hash baru: $manual_hash\n";
    echo "Verifikasi: " . ($manual_verify ? '✓ BERHASIL' : '✗ GAGAL') . "\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
