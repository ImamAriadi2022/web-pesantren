<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\save_settings.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once '../config/database.php';

// Handle file upload and form data
$upload_dir = '../uploads/';
$pdf_path = '';

// Process file upload if exists
if (isset($_FILES['psb_pdf']) && $_FILES['psb_pdf']['error'] === UPLOAD_ERR_OK) {
    $file_tmp = $_FILES['psb_pdf']['tmp_name'];
    $file_name = $_FILES['psb_pdf']['name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    if ($file_ext === 'pdf') {
        $new_filename = 'psb_brosur_' . time() . '.pdf';
        $pdf_path = $upload_dir . $new_filename;
        
        if (move_uploaded_file($file_tmp, $pdf_path)) {
            $pdf_path = 'uploads/' . $new_filename; // Path relatif untuk database
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal mengupload file']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'File harus berformat PDF']);
        exit;
    }
}

// Get form data
$settings_data = [];

// Prioritize POST data first
if (!empty($_POST)) {
    if (isset($_POST['tahun_ajaran']) && $_POST['tahun_ajaran'] !== '') $settings_data['tahun_ajaran'] = $_POST['tahun_ajaran'];
    if (isset($_POST['whatsapp']) && $_POST['whatsapp'] !== '') $settings_data['whatsapp'] = $_POST['whatsapp'];
    if (isset($_POST['email_instansi']) && $_POST['email_instansi'] !== '') $settings_data['email_instansi'] = $_POST['email_instansi'];
    if (isset($_POST['alamat']) && $_POST['alamat'] !== '') $settings_data['alamat'] = $_POST['alamat'];
    if (isset($_POST['website']) && $_POST['website'] !== '') $settings_data['website'] = $_POST['website'];
    if (isset($_POST['status_psb']) && $_POST['status_psb'] !== '') $settings_data['status_psb'] = $_POST['status_psb'];
    if (isset($_POST['judul_web']) && $_POST['judul_web'] !== '') $settings_data['judul_web'] = $_POST['judul_web'];
    if (isset($_POST['tagline_web']) && $_POST['tagline_web'] !== '') $settings_data['tagline_web'] = $_POST['tagline_web'];
    if (isset($_POST['caption_web']) && $_POST['caption_web'] !== '') $settings_data['caption_web'] = $_POST['caption_web'];
    if (isset($_POST['tentang_web']) && $_POST['tentang_web'] !== '') $settings_data['tentang_web'] = $_POST['tentang_web'];
    if (isset($_POST['footer_web']) && $_POST['footer_web'] !== '') $settings_data['footer_web'] = $_POST['footer_web'];
    if (isset($_POST['logo_web']) && $_POST['logo_web'] !== '') $settings_data['logo_web'] = $_POST['logo_web'];
    if (isset($_POST['nama_instansi']) && $_POST['nama_instansi'] !== '') $settings_data['nama_instansi'] = $_POST['nama_instansi'];
    if (isset($_POST['nama_pimpinan']) && $_POST['nama_pimpinan'] !== '') $settings_data['nama_pimpinan'] = $_POST['nama_pimpinan'];
    if (isset($_POST['nik_pimpinan']) && $_POST['nik_pimpinan'] !== '') $settings_data['nik_pimpinan'] = $_POST['nik_pimpinan'];
    if (isset($_POST['telp']) && $_POST['telp'] !== '') $settings_data['telp'] = $_POST['telp'];
} else {
    // Handle JSON data
    $json_data = json_decode(file_get_contents("php://input"), true);
    if ($json_data) {
        foreach ($json_data as $key => $value) {
            if ($value !== '' && $value !== null) {
                $settings_data[$key] = $value;
            }
        }
    }
}

// Add PDF path if uploaded
if ($pdf_path) {
    $settings_data['psb_pdf'] = $pdf_path;
} else if (isset($_POST['psb_pdf_path']) && $_POST['psb_pdf_path'] !== '') {
    $settings_data['psb_pdf'] = $_POST['psb_pdf_path'];
}

try {
    $pdo->beginTransaction();
    
    // Update each setting
    $stmt = $pdo->prepare("
        INSERT INTO pengaturan (nama_setting, nilai_setting, deskripsi, updated_at) 
        VALUES (?, ?, ?, NOW()) 
        ON DUPLICATE KEY UPDATE 
        nilai_setting = VALUES(nilai_setting), 
        updated_at = NOW()
    ");
    
    foreach ($settings_data as $key => $value) {
        $deskripsi = '';
        switch($key) {
            case 'tahun_ajaran': $deskripsi = 'Tahun ajaran untuk PSB'; break;
            case 'whatsapp': $deskripsi = 'Nomor WhatsApp panitia PSB'; break;
            case 'email_instansi': $deskripsi = 'Email resmi panitia PSB'; break;
            case 'alamat': $deskripsi = 'Alamat lengkap pesantren'; break;
            case 'website': $deskripsi = 'Website resmi pesantren'; break;
            case 'status_psb': $deskripsi = 'Status pendaftaran santri baru'; break;
            case 'psb_pdf': $deskripsi = 'Brosur pendaftaran dalam format PDF'; break;
            default: $deskripsi = ucfirst(str_replace('_', ' ', $key)); break;
        }
        
        $stmt->execute([$key, $value, $deskripsi]);
    }
    
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Pengaturan PSB berhasil disimpan']);
    
} catch (PDOException $e) {
    $pdo->rollback();
    echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
}
?>