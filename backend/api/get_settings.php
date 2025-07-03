<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\save_settings.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../config/database.php';

// Ambil data dari request body
$data = json_decode(file_get_contents("php://input"), true);

// Validasi data
if (empty($data['judul_web']) || empty($data['tagline_web'])) {
    echo json_encode(['success' => false, 'message' => 'Judul dan tagline wajib diisi']);
    exit;
}

// Cek apakah pengaturan sudah ada
$stmt = $pdo->query("SELECT id FROM pengaturan_web LIMIT 1");
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    // Update pengaturan jika sudah ada
    $stmt = $pdo->prepare("
        UPDATE pengaturan_web 
        SET judul_web = ?, tagline_web = ?, caption_web = ?, tentang_web = ?, footer_web = ?, 
            logo_web = ?, nama_instansi = ?, nama_pimpinan = ?, nik_pimpinan = ?, 
            alamat_instansi = ?, email_instansi = ?, telp = ?, whatsapp = ?, psb_pdf = ?
        WHERE id = ?
    ");
    $success = $stmt->execute([
        $data['judul_web'], $data['tagline_web'], $data['caption_web'], $data['tentang_web'], $data['footer_web'],
        $data['logo_web'], $data['nama_instansi'], $data['nama_pimpinan'], $data['nik_pimpinan'],
        $data['alamat_instansi'], $data['email_instansi'], $data['telp'], $data['whatsapp'], $data['psb_pdf'],
        $existing['id']
    ]);
} else {
    // Insert pengaturan baru jika belum ada
    $stmt = $pdo->prepare("
        INSERT INTO pengaturan_web 
        (judul_web, tagline_web, caption_web, tentang_web, footer_web, logo_web, nama_instansi, 
         nama_pimpinan, nik_pimpinan, alamat_instansi, email_instansi, telp, whatsapp, psb_pdf)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $success = $stmt->execute([
        $data['judul_web'], $data['tagline_web'], $data['caption_web'], $data['tentang_web'], $data['footer_web'],
        $data['logo_web'], $data['nama_instansi'], $data['nama_pimpinan'], $data['nik_pimpinan'],
        $data['alamat_instansi'], $data['email_instansi'], $data['telp'], $data['whatsapp'], $data['psb_pdf']
    ]);
}

// Kirim respons
if ($success) {
    echo json_encode(['success' => true, 'message' => 'Pengaturan berhasil disimpan']);
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan pengaturan']);
}