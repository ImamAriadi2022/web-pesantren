<?php
require_once 'config/database.php';

// Script untuk reset semua password user ke "admin"
// Untuk mengatasi masalah login

echo "=== RESET ALL PASSWORDS KE 'admin' ===\n\n";

try {
    // 1. Cek users yang ada
    echo "1. Mengecek users yang ada di database...\n";
    $stmt = $pdo->query("SELECT id, email, role FROM users ORDER BY id");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($users)) {
        echo "✗ Tidak ada user di database!\n";
        echo "Silahkan jalankan setup_data.php terlebih dahulu.\n\n";
        exit;
    }
    
    echo "✓ Ditemukan " . count($users) . " users:\n";
    foreach ($users as $user) {
        echo "  - ID: {$user['id']}, Email: {$user['email']}, Role: {$user['role']}\n";
    }
    echo "\n";
    
    // 2. Generate hash untuk password "admin"
    echo "2. Membuat hash untuk password 'admin'...\n";
    $newPassword = 'admin';
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    echo "✓ Hash berhasil dibuat: " . substr($newHash, 0, 30) . "...\n\n";
    
    // 3. Update semua user
    echo "3. Mengupdate password semua user ke 'admin'...\n";
    $pdo->beginTransaction();
    
    $updateStmt = $pdo->prepare("UPDATE users SET password = ?");
    $result = $updateStmt->execute([$newHash]);
    
    if ($result) {
        $affected = $updateStmt->rowCount();
        $pdo->commit();
        echo "✓ Berhasil update password untuk $affected users\n\n";
    } else {
        $pdo->rollBack();
        echo "✗ Gagal update password!\n\n";
        exit;
    }
    
    // 4. Test verifikasi password
    echo "4. Testing verifikasi password...\n";
    foreach ($users as $user) {
        echo "Testing user: {$user['email']}\n";
        
        // Ambil hash yang baru disimpan
        $checkStmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $checkStmt->execute([$user['id']]);
        $storedHash = $checkStmt->fetchColumn();
        
        // Test verifikasi
        $verify_result = password_verify('admin', $storedHash);
        echo "  - Verifikasi password 'admin': " . ($verify_result ? '✓ BERHASIL' : '✗ GAGAL') . "\n";
        
        if (!$verify_result) {
            echo "  - Hash tersimpan: " . substr($storedHash, 0, 50) . "...\n";
        }
    }
    echo "\n";
    
    // 5. Test login dengan API
    echo "5. Testing login melalui API...\n";
    $test_email = 'admin@pesantren.com';
    
    // Simulasi request ke login API
    $login_data = [
        'email' => $test_email,
        'password' => 'admin'
    ];
    
    echo "Testing login API dengan email: $test_email\n";
    echo "Password: admin\n";
    
    // Cek apakah user admin ada
    $adminStmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $adminStmt->execute([$test_email]);
    $admin = $adminStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        $login_success = password_verify('admin', $admin['password']);
        echo "✓ User admin ditemukan\n";
        echo "  - Login test: " . ($login_success ? '✓ BERHASIL' : '✗ GAGAL') . "\n";
        
        if ($login_success) {
            echo "  - User ID: {$admin['id']}\n";
            echo "  - Email: {$admin['email']}\n";
            echo "  - Role: {$admin['role']}\n";
        }
    } else {
        echo "✗ User admin tidak ditemukan!\n";
    }
    echo "\n";
    
    echo "=== SELESAI ===\n";
    echo "Semua password user telah direset ke: 'admin'\n";
    echo "Silahkan coba login di frontend dengan:\n";
    echo "- Email: admin@pesantren.com\n";
    echo "- Password: admin\n\n";
    
    echo "Jika masih gagal login, kemungkinan masalah ada di:\n";
    echo "1. Frontend tidak mengirim data dengan benar\n";
    echo "2. Ada cache di browser\n";
    echo "3. Endpoint API tidak terhubung dengan benar\n";
    echo "4. Cek file debug.log untuk error detail\n\n";

} catch (PDOException $e) {
    echo "✗ Database Error: " . $e->getMessage() . "\n";
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
?>
