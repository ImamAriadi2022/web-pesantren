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
    // Ambil kata sandi asli dari database
    $password = $user['password']; // Pastikan ini adalah kata sandi asli, bukan hash

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