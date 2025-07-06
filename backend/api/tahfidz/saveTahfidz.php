<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

try {
    if (isset($input['id']) && $input['id']) {
        // Update existing tahfidz
        $stmt = $db->prepare("UPDATE tahfidz SET santri_id = ?, surat = ?, ayat_mulai = ?, ayat_selesai = ?, tanggal_mulai = ?, tanggal_selesai = ?, target_selesai = ?, status = ?, nilai_hafalan = ?, keterangan = ?, pembimbing_id = ? WHERE id = ?");
        $stmt->execute([
            $input['santri_id'],
            $input['surat'],
            $input['ayat_mulai'] ?? 1,
            $input['ayat_selesai'] ?? 1,
            $input['tanggal_mulai'] ?? date('Y-m-d'),
            $input['tanggal_selesai'] ?? null,
            $input['target_selesai'] ?? null,
            $input['status'] ?? 'Belum Mulai',
            $input['nilai_hafalan'] ?? null,
            $input['keterangan'] ?? '',
            $input['pembimbing_id'] ?? null,
            $input['id']
        ]);
        $message = 'Data tahfidz berhasil diupdate';
    } else {
        // Create new tahfidz
        $stmt = $db->prepare("INSERT INTO tahfidz (santri_id, surat, ayat_mulai, ayat_selesai, tanggal_mulai, tanggal_selesai, target_selesai, status, nilai_hafalan, keterangan, pembimbing_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['santri_id'],
            $input['surat'],
            $input['ayat_mulai'] ?? 1,
            $input['ayat_selesai'] ?? 1,
            $input['tanggal_mulai'] ?? date('Y-m-d'),
            $input['tanggal_selesai'] ?? null,
            $input['target_selesai'] ?? null,
            $input['status'] ?? 'Belum Mulai',
            $input['nilai_hafalan'] ?? null,
            $input['keterangan'] ?? '',
            $input['pembimbing_id'] ?? null
        ]);
        $message = 'Data tahfidz berhasil ditambahkan';
    }
    
    echo json_encode(['success' => true, 'message' => $message]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
