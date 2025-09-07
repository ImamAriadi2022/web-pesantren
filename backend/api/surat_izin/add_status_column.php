<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    // Tambahkan kolom status jika belum ada
    $sql = "ALTER TABLE surat_izin_keluar ADD COLUMN status ENUM('Belum Kembali', 'Sudah di Pesantren') DEFAULT 'Belum Kembali' AFTER no_hp_penjemput";
    
    $pdo->exec($sql);
    echo "Kolom status berhasil ditambahkan ke tabel surat_izin_keluar\n";
    
} catch (PDOException $e) {
    if ($e->getCode() == '42S21') { // Column already exists
        echo "Kolom status sudah ada\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
?>
