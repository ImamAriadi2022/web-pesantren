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
    // Get pengaturan web dari tabel pengaturan_web
    $stmt = $pdo->prepare("SELECT * FROM pengaturan_web ORDER BY id DESC LIMIT 1");
    $stmt->execute();
    $settings = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($settings) {
        $data = [
            'judul_web' => $settings['judul_web'] ?? 'Pondok Pesantren Walisongo Lampung Utara',
            'tagline_web' => $settings['tagline_web'] ?? 'Institusi Pendidikan Islam Terpadu',
            'caption_web' => $settings['caption_web'] ?? 'Membentuk generasi Qur\'ani yang berakhlak mulia',
            'tentang_web' => $settings['tentang_web'] ?? 'Pondok Pesantren yang berkomitmen untuk membentuk generasi Qur\'ani yang berakhlak mulia dan berprestasi.',
            'footer_web' => $settings['footer_web'] ?? 'Pondok Pesantren Walisongo Lampung Utara',
            'logo_web' => $settings['logo_web'] ?? '/images/logo.png',
            'nama_instansi' => $settings['nama_instansi'] ?? 'Pondok Pesantren Walisongo Lampung Utara',
            'nama_pimpinan' => $settings['nama_pimpinan'] ?? 'KH. Ahmad Dahlan',
            'nik_pimpinan' => $settings['nik_pimpinan'] ?? '',
            'alamat_instansi' => $settings['alamat_instansi'] ?? 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung',
            'email_instansi' => $settings['email_instansi'] ?? 'info@pesantrenwalisongo.com',
            'telp' => $settings['telp'] ?? '0724-123456',
            'whatsapp' => $settings['whatsapp'] ?? '+62 812-3456-7890',
            // Data PSB dalam pengaturan web
            'psb_tahun_ajaran' => date('Y') . '/' . (date('Y') + 1),
            'psb_status' => 'Dibuka',
            'psb_tanggal_buka' => date('Y-m-d'),
            'psb_tanggal_tutup' => date('Y-m-d', strtotime('+3 months')),
            'psb_kuota' => 100,
            'psb_biaya_pendaftaran' => 'Gratis',
            'psb_persyaratan' => 'Fotokopi Ijazah terakhir, Fotokopi KTP/KK, Pas foto 3x4 sebanyak 6 lembar, Surat keterangan sehat dari dokter',
            'psb_pdf' => '/documents/brosur-psb.pdf'
        ];
    } else {
        // Default data jika belum ada pengaturan
        $data = [
            'judul_web' => 'Pondok Pesantren Walisongo Lampung Utara',
            'tagline_web' => 'Institusi Pendidikan Islam Terpadu',
            'caption_web' => 'Membentuk generasi Qur\'ani yang berakhlak mulia',
            'tentang_web' => 'Pondok Pesantren yang berkomitmen untuk membentuk generasi Qur\'ani yang berakhlak mulia dan berprestasi.',
            'footer_web' => 'Pondok Pesantren Walisongo Lampung Utara',
            'logo_web' => '/images/logo.png',
            'nama_instansi' => 'Pondok Pesantren Walisongo Lampung Utara',
            'nama_pimpinan' => 'KH. Ahmad Dahlan',
            'nik_pimpinan' => '',
            'alamat_instansi' => 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung',
            'email_instansi' => 'info@pesantrenwalisongo.com',
            'telp' => '0724-123456',
            'whatsapp' => '+62 812-3456-7890',
            'psb_tahun_ajaran' => date('Y') . '/' . (date('Y') + 1),
            'psb_status' => 'Dibuka',
            'psb_tanggal_buka' => date('Y-m-d'),
            'psb_tanggal_tutup' => date('Y-m-d', strtotime('+3 months')),
            'psb_kuota' => 100,
            'psb_biaya_pendaftaran' => 'Gratis',
            'psb_persyaratan' => 'Fotokopi Ijazah terakhir, Fotokopi KTP/KK, Pas foto 3x4 sebanyak 6 lembar, Surat keterangan sehat dari dokter',
            'psb_pdf' => '/documents/brosur-psb.pdf'
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $data,
        'message' => 'Settings berhasil diambil'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error mengambil settings: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>