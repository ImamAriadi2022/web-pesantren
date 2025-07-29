<?php
// Migration script to add status column to users table
require_once 'config/database.php';

echo "Running migration to add status column to users table...\n";

try {
    // Check if the status column already exists
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
    $columnExists = $stmt->fetch();
    
    if ($columnExists) {
        echo "Status column already exists in users table.\n";
    } else {
        // Add the status column
        $pdo->exec("ALTER TABLE users ADD COLUMN status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif' AFTER role");
        echo "Status column added successfully to users table.\n";
        
        // Update existing users to have 'Aktif' status
        $pdo->exec("UPDATE users SET status = 'Aktif' WHERE status IS NULL");
        echo "Updated existing users with default 'Aktif' status.\n";
    }
    
    echo "Migration completed successfully!\n";
    
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}