<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\delete_settings.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';

// Cek apakah pengaturan ada
$stmt = $pdo->query("SELECT id FROM pengaturan_web LIMIT 1");
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    // Hapus pengaturan
    $stmt = $pdo->prepare("DELETE FROM pengaturan_web WHERE id = ?");
    $success = $stmt->execute([$existing['id']]);

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Pengaturan berhasil dihapus']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus pengaturan']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Pengaturan tidak ditemukan']);
}