<?php
require_once __DIR__ . '/config/database.php';

if (isset($pdo) && $pdo instanceof PDO) {
    echo "<h2 style='color:green;'>Koneksi ke database BERHASIL!</h2>";
} else {
    echo "<h2 style='color:red;'>Koneksi ke database GAGAL!</h2>";
}
?>