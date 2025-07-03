<?php
require_once 'config/database.php';

echo "=== CEK DATABASE ===\n\n";

try {
    // Test koneksi
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✓ Koneksi database berhasil\n";
    echo "Host: $host\n";
    echo "Database: $dbname\n";
    echo "User: $username\n\n";
    
    // Cek tabel users
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "✓ Tabel 'users' ditemukan\n";
        
        // Cek jumlah user
        $count_stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
        $count = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];
        echo "✓ Jumlah user: $count\n\n";
        
        // Cek struktur tabel users
        echo "=== STRUKTUR TABEL USERS ===\n";
        $desc_stmt = $pdo->query("DESCRIBE users");
        $columns = $desc_stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($columns as $column) {
            echo "- {$column['Field']}: {$column['Type']}\n";
        }
        
        echo "\n=== SAMPLE DATA USERS ===\n";
        $sample_stmt = $pdo->query("SELECT id, email, role, LEFT(password, 20) as password_preview FROM users LIMIT 5");
        $users = $sample_stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($users as $user) {
            echo "ID: {$user['id']} | Email: {$user['email']} | Role: {$user['role']} | Password: {$user['password_preview']}...\n";
        }
        
    } else {
        echo "✗ Tabel 'users' tidak ditemukan\n";
        echo "Silakan import file db.sql terlebih dahulu\n";
    }
    
    // Cek tabel lainnya
    echo "\n=== DAFTAR SEMUA TABEL ===\n";
    $tables_stmt = $pdo->query("SHOW TABLES");
    $tables = $tables_stmt->fetchAll(PDO::FETCH_COLUMN);
    
    foreach ($tables as $table) {
        echo "- $table\n";
    }
    
} catch (PDOException $e) {
    echo "✗ Error koneksi database: " . $e->getMessage() . "\n\n";
    echo "Troubleshooting:\n";
    echo "1. Pastikan MySQL/MariaDB server berjalan\n";
    echo "2. Cek kredensial di config/database.php\n";
    echo "3. Pastikan database sudah dibuat\n";
    echo "4. Import file db.sql ke database\n";
}
?>
