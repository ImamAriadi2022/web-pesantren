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
        // Update existing nilai
        $stmt = $db->prepare("UPDATE nilai SET santri_id = ?, mapel_id = ?, jenis_nilai = ?, nilai = ?, bobot = ?, keterangan = ?, tahun_ajaran = ?, semester = ? WHERE id = ?");
        $stmt->execute([
            $input['santri_id'],
            $input['mapel_id'],
            $input['jenis_nilai'] ?? 'UTS',
            $input['nilai'],
            $input['bobot'] ?? 1.00,
            $input['keterangan'] ?? '',
            $input['tahun_ajaran'] ?? '2024/2025',
            $input['semester'] ?? 'Ganjil',
            $input['id']
        ]);
        $message = 'Nilai berhasil diupdate';
    } else {
        // Create new nilai
        $stmt = $db->prepare("INSERT INTO nilai (santri_id, mapel_id, jenis_nilai, nilai, bobot, keterangan, tahun_ajaran, semester, dibuat_oleh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['santri_id'],
            $input['mapel_id'],
            $input['jenis_nilai'] ?? 'UTS',
            $input['nilai'],
            $input['bobot'] ?? 1.00,
            $input['keterangan'] ?? '',
            $input['tahun_ajaran'] ?? '2024/2025',
            $input['semester'] ?? 'Ganjil',
            1 // dibuat_oleh default user id 1
        ]);
        $message = 'Nilai berhasil ditambahkan';
    }
    
    echo json_encode(['success' => true, 'message' => $message]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
