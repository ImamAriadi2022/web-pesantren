<?php
// filepath: c:\laragon\www\web-pesantren\backend\index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type");

header("Content-Type: application/json");

// Log untuk debugging
file_put_contents('debug.log', "=== API Request ===\n", FILE_APPEND);

$request = $_GET['request'] ?? '';

// Log endpoint yang diminta
file_put_contents('debug.log', "Endpoint: $request\n", FILE_APPEND);

switch ($request) {
    case 'login':
        file_put_contents('debug.log', "Mengakses login.php\n", FILE_APPEND);
        require_once 'api/login.php';
        break;
    default:
        file_put_contents('debug.log', "Error: Endpoint tidak ditemukan\n", FILE_APPEND);
        echo json_encode(['message' => 'Endpoint tidak ditemukan']);
        break;
}