<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\login.php

session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

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
    
    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_email'] = $user['email'];
    
    $response = [
        'success' => true,
        'message' => 'Login berhasil',
        'role' => $user['role'],
        'user_id' => $user['id']
    ];
    
    // Get santri_id if user is santri
    if ($user['role'] === 'santri') {
        $santri_stmt = $pdo->prepare("SELECT id FROM santri WHERE user_id = ?");
        $santri_stmt->execute([$user['id']]);
        $santri = $santri_stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($santri) {
            $_SESSION['santri_id'] = $santri['id'];
            $response['santri_id'] = $santri['id'];
        }
    }
    
    // Get ustadz_id if user is pengajar
    if ($user['role'] === 'pengajar') {
        $ustadz_stmt = $pdo->prepare("SELECT id FROM ustadz WHERE user_id = ?");
        $ustadz_stmt->execute([$user['id']]);
        $ustadz = $ustadz_stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($ustadz) {
            $_SESSION['ustadz_id'] = $ustadz['id'];
            $response['ustadz_id'] = $ustadz['id'];
        }
    }
    
    echo json_encode($response);
} else {
    file_put_contents('debug.log', "Error: Password tidak cocok atau user tidak ditemukan\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Email atau password salah']);
}

