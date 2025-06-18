<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\login.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type");

// Gunakan jalur absolut atau perbaiki jalur relatif
require_once __DIR__ . '/../config/database.php';

// Log untuk debugging
file_put_contents('debug.log', "=== Login Request ===\n", FILE_APPEND);

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Log data yang diterima
file_put_contents('debug.log', "Email: $email\n", FILE_APPEND);
file_put_contents('debug.log', "Password: $password\n", FILE_APPEND);

if (empty($email) || empty($password)) {
    file_put_contents('debug.log', "Error: Email atau password kosong\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Email dan password harus diisi']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Log hasil query
if ($user) {
    file_put_contents('debug.log', "User ditemukan: " . json_encode($user) . "\n", FILE_APPEND);
} else {
    file_put_contents('debug.log', "Error: User tidak ditemukan\n", FILE_APPEND);
}

if ($user && password_verify($password, $user['password'])) {
    file_put_contents('debug.log', "Password cocok\n", FILE_APPEND);
    echo json_encode([
        'success' => true,
        'message' => 'Login berhasil',
        'role' => $user['role']
    ]);
} else {
    file_put_contents('debug.log', "Error: Password tidak cocok atau user tidak ditemukan\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Email atau password salah']);
}



<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email harus diisi']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    $password = $user['password']; // Ambil kata sandi dari database

    // Kirim email ke pengguna
    $to = $email;
    $subject = "Permintaan Lupa Kata Sandi";
    $message = "Halo, berikut adalah kata sandi Anda: $password";
    $headers = "From: no-reply@web-pesantren.com";

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Kata sandi telah dikirim ke email Anda']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal mengirim email']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Email tidak ditemukan']);
}