<?php
require_once 'config/database.php';

header("Access-Control-Allow-Origin: *"); // atau spesifik ke domain Anda
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

echo "=== UPDATE PASSWORD ADMIN ===\n\n";

try {
    // Cek user admin
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute(['admin@pesantren.com']);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        echo "❌ User admin tidak ditemukan!\n";
        echo "Silakan jalankan setup_data.php terlebih dahulu.\n";
        exit;
    }
    
    echo "📋 USER ADMIN DITEMUKAN:\n";
    echo "ID: {$admin['id']}\n";
    echo "Email: {$admin['email']}\n";
    echo "Role: {$admin['role']}\n";
    echo "Hash lama: " . substr($admin['password'], 0, 30) . "...\n\n";
    
    // Update password menjadi "admin"
    $newPassword = 'admin';
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    
    $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
    $updateStmt->execute([$newHash, 'admin@pesantren.com']);
    
    echo "✅ PASSWORD BERHASIL DIUPDATE!\n\n";
    
    // Verifikasi update
    $verifyStmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $verifyStmt->execute(['admin@pesantren.com']);
    $updatedAdmin = $verifyStmt->fetch(PDO::FETCH_ASSOC);
    
    $passwordTest = password_verify($newPassword, $updatedAdmin['password']);
    
    echo "📋 VERIFIKASI:\n";
    echo "Hash baru: " . substr($updatedAdmin['password'], 0, 30) . "...\n";
    echo "Test password '$newPassword': " . ($passwordTest ? '✅ BERHASIL' : '❌ GAGAL') . "\n\n";
    
    if ($passwordTest) {
        echo "🎉 SEKARANG BISA LOGIN DENGAN:\n";
        echo "Email: admin@pesantren.com\n";
        echo "Password: admin\n\n";
        
        // Update juga password user lain supaya konsisten
        echo "🔄 UPDATE PASSWORD USER LAIN...\n";
        $allUsersStmt = $pdo->query("SELECT id, email FROM users WHERE email != 'admin@pesantren.com'");
        $otherUsers = $allUsersStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        
        foreach ($otherUsers as $user) {
            $updateStmt->execute([$newHash, $user['id']]);
            echo "- Updated: {$user['email']}\n";
        }
        
        echo "\n✅ SEMUA USER SEKARANG MENGGUNAKAN PASSWORD: admin\n";
        
    } else {
        echo "❌ Ada masalah dengan update password!\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
