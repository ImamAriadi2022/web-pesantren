<?php
require_once 'config/database.php';

echo "=== CEK DATA USER DI DATABASE ===\n\n";

try {
    // Cek semua user
    $stmt = $pdo->query("SELECT id, email, role, LEFT(password, 30) as password_preview FROM users ORDER BY id");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($users)) {
        echo "❌ TIDAK ADA USER DI DATABASE!\n";
        echo "Silakan jalankan setup_data.php terlebih dahulu.\n\n";
        exit;
    }
    
    echo "📊 DATA USER DI DATABASE:\n";
    foreach ($users as $user) {
        echo "ID: {$user['id']} | Email: {$user['email']} | Role: {$user['role']} | Hash: {$user['password_preview']}...\n";
    }
    
    echo "\n" . str_repeat("=", 50) . "\n";
    echo "🔐 TEST PASSWORD VERIFICATION\n\n";
    
    // Test berbagai password untuk admin
    $adminStmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $adminStmt->execute(['admin@pesantren.com']);
    $admin = $adminStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "✅ User admin ditemukan!\n";
        echo "Email: {$admin['email']}\n";
        echo "Role: {$admin['role']}\n";
        echo "Hash tersimpan: " . substr($admin['password'], 0, 40) . "...\n\n";
        
        $testPasswords = ['admin', 'secret123', 'admin123', 'password'];
        
        echo "Testing password:\n";
        foreach ($testPasswords as $testPass) {
            $isValid = password_verify($testPass, $admin['password']);
            echo "- '$testPass': " . ($isValid ? '✅ BENAR' : '❌ SALAH') . "\n";
            
            if ($isValid) {
                echo "\n🎯 PASSWORD YANG BENAR: '$testPass'\n";
                break;
            }
        }
        
        // Test manual hash generation
        echo "\n" . str_repeat("-", 30) . "\n";
        echo "🧪 TEST HASH MANUAL:\n";
        $manualHash = password_hash('secret123', PASSWORD_DEFAULT);
        $manualVerify = password_verify('secret123', $manualHash);
        echo "Hash baru untuk 'secret123': " . substr($manualHash, 0, 40) . "...\n";
        echo "Verifikasi hash baru: " . ($manualVerify ? '✅ BERHASIL' : '❌ GAGAL') . "\n";
        
    } else {
        echo "❌ User admin tidak ditemukan!\n";
    }
    
    echo "\n" . str_repeat("=", 50) . "\n";
    echo "📝 KESIMPULAN:\n";
    echo "1. Jika password 'secret123' berhasil, gunakan itu untuk login\n";
    echo "2. Jika tidak ada yang berhasil, jalankan setup_data.php lagi\n";
    echo "3. Pastikan menggunakan email: admin@pesantren.com\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting:\n";
    echo "1. Pastikan database 'web_pesantren' ada\n";
    echo "2. Jalankan setup_data.php untuk membuat tabel dan data\n";
    echo "3. Cek konfigurasi database di config/database.php\n";
}
?>
