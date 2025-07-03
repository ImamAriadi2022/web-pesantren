<?php
require_once 'config/database.php';

// Script untuk debug login secara detail
// Menampilkan semua informasi yang diperlukan untuk troubleshooting

echo "=== LOGIN DEBUG TOOL ===\n\n";

try {
    // 1. Cek koneksi database
    echo "1. Testing koneksi database...\n";
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
    $total = $stmt->fetchColumn();
    echo "✓ Koneksi database berhasil\n";
    echo "✓ Total users di database: $total\n\n";
    
    // 2. Tampilkan semua users
    echo "2. Daftar semua users:\n";
    $stmt = $pdo->query("SELECT id, email, role, LEFT(password, 30) as hash_preview FROM users ORDER BY id");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($users as $user) {
        echo "  - ID: {$user['id']}\n";
        echo "    Email: {$user['email']}\n";
        echo "    Role: {$user['role']}\n";
        echo "    Hash (30 char): {$user['hash_preview']}...\n\n";
    }
    
    // 3. Test password untuk user admin
    echo "3. Testing password untuk admin@pesantren.com:\n";
    $adminStmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $adminStmt->execute(['admin@pesantren.com']);
    $admin = $adminStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "✓ User admin ditemukan\n";
        $passwords_to_test = ['admin', 'secret123', 'password', 'admin123', '123456'];
        
        foreach ($passwords_to_test as $test_password) {
            $is_valid = password_verify($test_password, $admin['password']);
            echo "  - Password '$test_password': " . ($is_valid ? '✓ COCOK' : '✗ TIDAK COCOK') . "\n";
            
            if ($is_valid) {
                echo "    >>> PASSWORD YANG BENAR DITEMUKAN: '$test_password' <<<\n";
            }
        }
    } else {
        echo "✗ User admin tidak ditemukan!\n";
    }
    echo "\n";
    
    // 4. Simulasi login request
    echo "4. Simulasi login request:\n";
    $login_requests = [
        ['email' => 'admin@pesantren.com', 'password' => 'admin'],
        ['email' => 'admin@pesantren.com', 'password' => 'secret123'],
        ['email' => 'pengajar1@pesantren.com', 'password' => 'admin'],
        ['email' => 'santri1@pesantren.com', 'password' => 'admin']
    ];
    
    foreach ($login_requests as $request) {
        echo "Request: {$request['email']} dengan password '{$request['password']}'\n";
        
        // Cari user
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$request['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            $password_valid = password_verify($request['password'], $user['password']);
            echo "  - User: ✓ DITEMUKAN\n";
            echo "  - Login: " . ($password_valid ? '✓ BERHASIL' : '✗ GAGAL') . "\n";
            
            if ($password_valid) {
                echo "    >>> LOGIN SUKSES <<<\n";
                echo "    User ID: {$user['id']}\n";
                echo "    Role: {$user['role']}\n";
            }
        } else {
            echo "  - User: ✗ TIDAK DITEMUKAN\n";
            echo "  - Login: ✗ GAGAL\n";
        }
        echo "\n";
    }
    
    // 5. Cek API endpoint
    echo "5. Testing API endpoint:\n";
    $api_path = __DIR__ . '/api/login.php';
    if (file_exists($api_path)) {
        echo "✓ File api/login.php ditemukan\n";
        
        // Cek isi file login.php
        $login_content = file_get_contents($api_path);
        if (strpos($login_content, 'password_verify') !== false) {
            echo "✓ Function password_verify ditemukan di login.php\n";
        } else {
            echo "✗ Function password_verify TIDAK ditemukan di login.php\n";
        }
        
        if (strpos($login_content, 'SELECT') !== false) {
            echo "✓ Query SELECT ditemukan di login.php\n";
        } else {
            echo "✗ Query SELECT TIDAK ditemukan di login.php\n";
        }
    } else {
        echo "✗ File api/login.php TIDAK ditemukan!\n";
    }
    echo "\n";
    
    // 6. Cek index.php router
    echo "6. Testing router:\n";
    $index_path = __DIR__ . '/index.php';
    if (file_exists($index_path)) {
        echo "✓ File index.php ditemukan\n";
        
        $index_content = file_get_contents($index_path);
        if (strpos($index_content, '/login') !== false) {
            echo "✓ Route '/login' ditemukan di index.php\n";
        } else {
            echo "✗ Route '/login' TIDAK ditemukan di index.php\n";
        }
    } else {
        echo "✗ File index.php TIDAK ditemukan!\n";
    }
    echo "\n";
    
    // 7. Recommendations
    echo "=== REKOMENDASI TROUBLESHOOTING ===\n\n";
    
    // Cek password yang benar untuk admin
    if ($admin) {
        $correct_password = null;
        $test_passwords = ['admin', 'secret123', 'password', 'admin123'];
        
        foreach ($test_passwords as $pwd) {
            if (password_verify($pwd, $admin['password'])) {
                $correct_password = $pwd;
                break;
            }
        }
        
        if ($correct_password) {
            echo "✓ Password yang benar untuk admin@pesantren.com adalah: '$correct_password'\n";
            echo "  Gunakan kredensial ini untuk login:\n";
            echo "  - Email: admin@pesantren.com\n";
            echo "  - Password: $correct_password\n\n";
        } else {
            echo "✗ Tidak ada password yang cocok untuk admin!\n";
            echo "  Jalankan reset_all_passwords.php untuk reset password ke 'admin'\n\n";
        }
    }
    
    echo "Langkah troubleshooting:\n";
    echo "1. Pastikan menggunakan password yang benar (lihat di atas)\n";
    echo "2. Buka Network tab di browser saat login untuk cek request\n";
    echo "3. Periksa file backend/debug.log untuk error detail\n";
    echo "4. Pastikan frontend mengirim request ke endpoint yang benar\n";
    echo "5. Clear cache browser atau coba incognito mode\n";
    echo "6. Jika masih gagal, jalankan reset_all_passwords.php\n\n";

} catch (PDOException $e) {
    echo "✗ Database Error: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
?>
