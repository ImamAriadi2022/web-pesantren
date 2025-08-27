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
    // Get pengaturan/settings untuk landing page dari tabel pengaturan
    $stmt = $pdo->prepare("SELECT nama_setting, nilai_setting FROM pengaturan");
    $stmt->execute();
    
    $settings = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $settings[$row['nama_setting']] = $row['nilai_setting'];
    }
    
    // Format data sesuai yang diharapkan frontend dengan fallback values
    $data = [
        'judul_web' => $settings['nama_pesantren'] ?? 'Pondok Pesantren Al-Hikmah',
        'tagline_web' => 'Institusi Pendidikan Islam Terpadu',
        'caption_web' => 'Membentuk generasi Qur\'ani yang berakhlak mulia',
        'tentang_web' => 'Pondok Pesantren Al-Hikmah adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qur\'ani yang berakhlak mulia dan berprestasi.',
        'footer_web' => $settings['nama_pesantren'] ?? 'Pondok Pesantren Al-Hikmah',
        'logo_web' => $settings['logo_pesantren'] ?? '/images/logo.png',
        'nama_instansi' => $settings['nama_pesantren'] ?? 'Pondok Pesantren Al-Hikmah',
        'nama_pimpinan' => $settings['kepala_pesantren'] ?? 'KH. Ahmad Dahlan',
        'alamat_instansi' => $settings['alamat_pesantren'] ?? 'Jl. Raya Pesantren No. 123',
        'telp_instansi' => $settings['telepon_pesantren'] ?? '021-12345678',
        'email_instansi' => $settings['email_pesantren'] ?? 'info@alhikmah.ac.id',
        'website_instansi' => $settings['website_pesantren'] ?? 'https://www.alhikmah.ac.id'
    ];
    
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