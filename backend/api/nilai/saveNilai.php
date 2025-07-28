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
        $stmt = $db->prepare("UPDATE nilai SET santri_id = ?, mapel_id = ?, jenis_nilai = ?, nilai = ?, kkm = ?, bobot = ?, keterangan = ?, tahun_ajaran = ?, semester = ? WHERE id = ?");
        $stmt->execute([
            $input['santri_id'],
            $input['mapel_id'],
            $input['jenis_nilai'] ?? 'UTS',
            $input['nilai'],
            $input['kkm'] ?? 75,
            $input['bobot'] ?? 1.00,
            $input['keterangan'] ?? '',
            $input['tahun_ajaran'] ?? '2024/2025',
            $input['semester'] ?? 'Ganjil',
            $input['id']
        ]);
        $nilai_id = $input['id'];
        $message = 'Nilai berhasil diupdate';
    } else {
        // Create new nilai
        $stmt = $db->prepare("INSERT INTO nilai (santri_id, mapel_id, jenis_nilai, nilai, kkm, bobot, keterangan, tahun_ajaran, semester, dibuat_oleh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['santri_id'],
            $input['mapel_id'],
            $input['jenis_nilai'] ?? 'UTS',
            $input['nilai'],
            $input['kkm'] ?? 75,
            $input['bobot'] ?? 1.00,
            $input['keterangan'] ?? '',
            $input['tahun_ajaran'] ?? '2024/2025',
            $input['semester'] ?? 'Ganjil',
            1 // dibuat_oleh default user id 1
        ]);
        $nilai_id = $db->lastInsertId();
        $message = 'Nilai berhasil ditambahkan';
        
        // Create automatic notification for new nilai
        createAutoNotifikasi($input['santri_id'], $nilai_id);
    }
    
    echo json_encode(['success' => true, 'message' => $message]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

// Function to create automatic notification when new nilai is added
function createAutoNotifikasi($santri_id, $nilai_id) {
    global $db;
    
    try {
        // Get santri and mapel data
        $stmt = $db->prepare("
            SELECT s.nama as nama_santri, mp.nama_mapel, n.nilai, n.jenis_nilai, n.kkm
            FROM santri s, mata_pelajaran mp, nilai n
            WHERE s.id = ? AND mp.id = n.mapel_id AND n.id = ?
        ");
        $stmt->execute([$santri_id, $nilai_id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($data) {
            $status = $data['nilai'] >= $data['kkm'] ? 'Tuntas' : 'Belum Tuntas';
            $pesan = "Nilai baru telah diinput untuk mata pelajaran {$data['nama_mapel']}. Jenis: {$data['jenis_nilai']}, Nilai: {$data['nilai']}, KKM: {$data['kkm']}, Status: {$status}";
            
            $stmt = $db->prepare("INSERT INTO notifikasi_nilai (santri_id, nilai_id, pesan) VALUES (?, ?, ?)");
            $stmt->execute([$santri_id, $nilai_id, $pesan]);
        }
    } catch (Exception $e) {
        error_log("Error creating auto notification: " . $e->getMessage());
    }
}
?>
