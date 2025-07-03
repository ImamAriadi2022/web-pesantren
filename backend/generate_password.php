<?php
// Genecho "=== LOGIN CREDENTIALS YANG BENAR ===\n\n";
echo "Admin: admin@pesantren.com / admin\n";
echo "Ustadz: ustadz1@pesantren.com / admin\n";
echo "Santri: santri1@pesantren.com / admin\n";
echo "\n!!! SEMUA AKUN MENGGUNAKAN PASSWORD: admin !!!\n"; password hash untuk testing
header('Content-Type: text/plain');

echo "=== PASSWORD HASH GENERATOR ===\n\n";

echo "Admin Password Hash (admin123): " . password_hash('admin123', PASSWORD_DEFAULT) . "\n";
echo "Admin Password Hash (admin): " . password_hash('admin', PASSWORD_DEFAULT) . "\n";
echo "Ustadz Password Hash (ustadz123): " . password_hash('ustadz123', PASSWORD_DEFAULT) . "\n"; 
echo "Santri Password Hash (santri123): " . password_hash('santri123', PASSWORD_DEFAULT) . "\n";
echo "Simple Password Hash (123): " . password_hash('123', PASSWORD_DEFAULT) . "\n";
echo "Secret Password Hash (secret123): " . password_hash('secret123', PASSWORD_DEFAULT) . "\n";

echo "\n=== LOGIN CREDENTIALS YANG BENAR ===\n\n";
echo "Admin: admin@pesantren.com / secret123\n";
echo "Ustadz: ustadz1@pesantren.com / secret123\n";
echo "Santri: santri1@pesantren.com / secret123\n";
echo "\n!!! SEMUA AKUN MENGGUNAKAN PASSWORD: secret123 !!!\n";

echo "\n=== HASH YANG SUDAH DIGUNAKAN DI DATABASE ===\n\n";
echo "Hash untuk 'secret123': \$2y\$10\$eImiTXuWVxfM37uY4JANjOehXOBQjVLpyG8ZDFE2QlbIE9MZJFAbi\n";
echo "(Hash ini sudah dipakai untuk semua user di database)\n";

// Verifikasi hash yang ada
$stored_hash = '$2y$10$eImiTXuWVxfM37uY4JANjOehXOBQjVLpyG8ZDFE2QlbIE9MZJFAbi';
$test_passwords = ['admin', 'admin123', 'ustadz123', 'santri123', '123', 'secret123'];

echo "\n=== VERIFIKASI HASH ===\n\n";
foreach ($test_passwords as $password) {
    $is_valid = password_verify($password, $stored_hash);
    echo "Password '$password': " . ($is_valid ? "✓ VALID" : "✗ INVALID") . "\n";
}
?>
