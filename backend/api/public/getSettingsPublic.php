<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM pengaturan_web LIMIT 1");
    $stmt->execute();
    $settings = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($settings) {
        echo json_encode([
            'success' => true,
            'data' => [
                'judul_web' => $settings['judul_web'] ?? 'Pondok Pesantren Walisongo',
                'tagline_web' => $settings['tagline_web'] ?? 'Institusi Madrasah Aliyah (MA) Plus',
                'caption_web' => $settings['caption_web'] ?? 'Membentuk generasi Qur\'ani yang berakhlak mulia',
                'tentang_web' => $settings['tentang_web'] ?? 'Pondok Pesantren Walisongo adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qur\'ani yang berakhlak mulia dan berprestasi.',
                'footer_web' => $settings['footer_web'] ?? 'Pondok Pesantren Walisongo Lampung Utara',
                'logo_web' => $settings['logo_web'] ?? '/images/logo.png',
                'nama_instansi' => $settings['nama_instansi'] ?? 'Pondok Pesantren Walisongo Lampung Utara',
                'nama_pimpinan' => $settings['nama_pimpinan'] ?? 'KH. Ahmad Dahlan',
                'nik_pimpinan' => $settings['nik_pimpinan'] ?? '',
                'alamat_instansi' => $settings['alamat_instansi'] ?? 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung',
                'email_instansi' => $settings['email_instansi'] ?? 'info@pesantrenwalisongo.com',
                'telp' => $settings['telp'] ?? '0724-123456',
                'whatsapp' => $settings['whatsapp'] ?? '+62 812-3456-7890',
                'psb_pdf' => $settings['psb_pdf'] ?? '/documents/brosur-psb.pdf'
            ]
        ]);
    } else {
        // Return default settings if no settings found
        echo json_encode([
            'success' => true,
            'data' => [
                'judul_web' => 'Pondok Pesantren Walisongo',
                'tagline_web' => 'Institusi Madrasah Aliyah (MA) Plus',
                'caption_web' => 'Membentuk generasi Qur\'ani yang berakhlak mulia',
                'tentang_web' => 'Pondok Pesantren Walisongo adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qur\'ani yang berakhlak mulia dan berprestasi.',
                'footer_web' => 'Pondok Pesantren Walisongo Lampung Utara',
                'logo_web' => '/images/logo.png',
                'nama_instansi' => 'Pondok Pesantren Walisongo Lampung Utara',
                'nama_pimpinan' => 'KH. Ahmad Dahlan',
                'nik_pimpinan' => '',
                'alamat_instansi' => 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung',
                'email_instansi' => 'info@pesantrenwalisongo.com',
                'telp' => '0724-123456',
                'whatsapp' => '+62 812-3456-7890',
                'psb_pdf' => '/documents/brosur-psb.pdf'
            ]
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>