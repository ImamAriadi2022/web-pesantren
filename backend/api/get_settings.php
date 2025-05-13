<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\get_settings.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';

$stmt = $pdo->query("SELECT * FROM pengaturan_web LIMIT 1");
$settings = $stmt->fetch(PDO::FETCH_ASSOC);

if ($settings) {
    echo json_encode(['success' => true, 'data' => $settings]);
} else {
    echo json_encode(['success' => false, 'message' => 'Pengaturan belum diatur']);
}