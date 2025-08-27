<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\get_settings.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

require_once '../config/database.php';

try {
    // Ambil semua pengaturan
    $stmt = $pdo->query("SELECT nama_setting, nilai_setting FROM pengaturan");
    $settings_raw = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert to associative array
    $settings = [];
    foreach ($settings_raw as $setting) {
        $settings[$setting['nama_setting']] = $setting['nilai_setting'];
    }
    
    // Provide default values for PSB settings
    $default_settings = [
        'judul_web' => '',
        'tagline_web' => '',
        'caption_web' => '',
        'tentang_web' => '',
        'footer_web' => '',
        'logo_web' => '',
        'nama_instansi' => '',
        'nama_pimpinan' => '',
        'nik_pimpinan' => '',
        'alamat' => '',
        'email_instansi' => '',
        'telp' => '',
        'whatsapp' => '',
        'website' => '',
        'tahun_ajaran' => '',
        'status_psb' => 'Tutup',
        'psb_pdf' => ''
    ];
    
    // Merge with defaults
    $final_settings = array_merge($default_settings, $settings);
    
    echo json_encode([
        'success' => true, 
        'data' => $final_settings
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>