<?php
// filepath: c:\laragon\www\web-pesantren\backend\config\database.php

$host = '127.0.0.1';
$port = '3306';
$dbname = 'web_pesantren';  // Ubah dari $db_name ke $dbname untuk konsistensi
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}