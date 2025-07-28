<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Get PSB information from database
    $stmt = $db->prepare("
        SELECT p.*, pw.psb_pdf, pw.whatsapp, pw.email_instansi
        FROM psb p
        LEFT JOIN pengaturan_web pw ON 1=1
        WHERE p.status IN ('Dibuka', 'Ditutup')
        ORDER BY p.tahun_ajaran DESC
        LIMIT 1
    ");
    $stmt->execute();
    $psb = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($psb) {
        $data = [
            'id' => $psb['id'],
            'tahun_ajaran' => $psb['tahun_ajaran'],
            'tanggal_buka' => $psb['tanggal_buka'],
            'tanggal_tutup' => $psb['tanggal_tutup'],
            'status' => $psb['status'],
            'kuota' => $psb['kuota'] ?? 100,
            'biaya_pendaftaran' => $psb['biaya_pendaftaran'] ?? 'Gratis',
            'persyaratan' => $psb['persyaratan'] ?? 'Persyaratan akan diumumkan kemudian',
            'psb_pdf' => $psb['psb_pdf'] ?? '/documents/brosur-psb.pdf',
            'whatsapp' => $psb['whatsapp'] ?? '+62 812-3456-7890',
            'email_instansi' => $psb['email_instansi'] ?? 'info@pesantrenwalisongo.com'
        ];
    } else {
        // Default PSB data if no data found
        $data = [
            'id' => 0,
            'tahun_ajaran' => date('Y') . '/' . (date('Y') + 1),
            'tanggal_buka' => date('Y-m-d'),
            'tanggal_tutup' => date('Y-m-d', strtotime('+3 months')),
            'status' => 'Dibuka',
            'kuota' => 100,
            'biaya_pendaftaran' => 'Gratis',
            'persyaratan' => 'Persyaratan akan diumumkan kemudian',
            'psb_pdf' => '/documents/brosur-psb.pdf',
            'whatsapp' => '+62 812-3456-7890',
            'email_instansi' => 'info@pesantrenwalisongo.com'
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>