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
    // Extract jam mulai dan selesai dari format "08:00 - 09:30"
    $jamArray = explode(' - ', $input['jam'] ?? '');
    $jamMulai = isset($jamArray[0]) ? $jamArray[0] : '08:00';
    $jamSelesai = isset($jamArray[1]) ? $jamArray[1] : '09:00';
    
    if (isset($input['id']) && $input['id']) {
        // Update existing jadwal
        $stmt = $db->prepare("UPDATE jadwal_pelajaran SET kelas_id = ?, mapel_id = ?, ustadz_id = ?, hari = ?, jam_mulai = ?, jam_selesai = ?, ruangan = ?, tahun_ajaran = ?, semester = ?, status = ? WHERE id = ?");
        $stmt->execute([
            $input['kelas_id'],
            $input['mapel_id'],
            $input['ustadz_id'],
            $input['hari'],
            $jamMulai,
            $jamSelesai,
            $input['ruangan'] ?? '',
            $input['tahun_ajaran'] ?? '2024/2025',
            $input['semester'] ?? 'Ganjil',
            $input['status'] ?? 'Aktif',
            $input['id']
        ]);
        $message = 'Jadwal berhasil diupdate';
    } else {
        // Create new jadwal
        $stmt = $db->prepare("INSERT INTO jadwal_pelajaran (kelas_id, mapel_id, ustadz_id, hari, jam_mulai, jam_selesai, ruangan, tahun_ajaran, semester, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['kelas_id'],
            $input['mapel_id'],
            $input['ustadz_id'],
            $input['hari'],
            $jamMulai,
            $jamSelesai,
            $input['ruangan'] ?? '',
            $input['tahun_ajaran'] ?? '2024/2025',
            $input['semester'] ?? 'Ganjil',
            $input['status'] ?? 'Aktif'
        ]);
        $message = 'Jadwal berhasil ditambahkan';
    }
    
    echo json_encode(['success' => true, 'message' => $message]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
