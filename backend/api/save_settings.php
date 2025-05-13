<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\save_settings.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
    exit;
}

// Pastikan semua parameter ada
$params = [
    'judul_web' => $data['judul_web'] ?? null,
    'tagline_web' => $data['tagline_web'] ?? null,
    'caption_web' => $data['caption_web'] ?? null,
    'tentang_web' => $data['tentang_web'] ?? null,
    'footer_web' => $data['footer_web'] ?? null,
    'logo_web' => $data['logo_web'] ?? null,
    'nama_instansi' => $data['nama_instansi'] ?? null,
    'nama_pimpinan' => $data['nama_pimpinan'] ?? null,
    'nik_pimpinan' => $data['nik_pimpinan'] ?? null,
    'alamat_instansi' => $data['alamat_instansi'] ?? null,
    'email_instansi' => $data['email_instansi'] ?? null,
    'telp' => $data['telp'] ?? null,
    'whatsapp' => $data['whatsapp'] ?? null,
    'psb_pdf' => $data['psb_pdf'] ?? null,
];

// Debugging: Log parameter
file_put_contents('debug.log', print_r($params, true), FILE_APPEND);

try {
    $stmt = $pdo->prepare("
        INSERT INTO pengaturan_web (judul_web, tagline_web, caption_web, tentang_web, footer_web, logo_web, nama_instansi, nama_pimpinan, nik_pimpinan, alamat_instansi, email_instansi, telp, whatsapp, psb_pdf)
        VALUES (:judul_web, :tagline_web, :caption_web, :tentang_web, :footer_web, :logo_web, :nama_instansi, :nama_pimpinan, :nik_pimpinan, :alamat_instansi, :email_instansi, :telp, :whatsapp, :psb_pdf)
        ON DUPLICATE KEY UPDATE
        judul_web = VALUES(judul_web),
        tagline_web = VALUES(tagline_web),
        caption_web = VALUES(caption_web),
        tentang_web = VALUES(tentang_web),
        footer_web = VALUES(footer_web),
        logo_web = VALUES(logo_web),
        nama_instansi = VALUES(nama_instansi),
        nama_pimpinan = VALUES(nama_pimpinan),
        nik_pimpinan = VALUES(nik_pimpinan),
        alamat_instansi = VALUES(alamat_instansi),
        email_instansi = VALUES(email_instansi),
        telp = VALUES(telp),
        whatsapp = VALUES(whatsapp),
        psb_pdf = VALUES(psb_pdf)
    ");

    $stmt->execute($params);

    echo json_encode(['success' => true, 'message' => 'Pengaturan berhasil disimpan']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
}