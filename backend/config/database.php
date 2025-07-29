<?php
// filepath: c:\laragon\www\web-pesantren\backend\config\database.php

$host = '127.0.0.1';
$port = '3306';
$dbname = 'web_pesantren';  // Ubah dari $db_name ke $dbname untuk konsistensi
$username = 'root';
$password = '';

try {
    // Try socket connection first, fallback to TCP
    $pdo = new PDO("mysql:unix_socket=/var/run/mysqld/mysqld.sock;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    try {
        // Fallback to TCP connection
        $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e2) {
        die("Koneksi database gagal: " . $e2->getMessage());
    }
}