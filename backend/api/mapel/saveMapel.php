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
        // Update existing mapel
        $stmt = $db->prepare("UPDATE mata_pelajaran SET kode_mapel = ?, nama_mapel = ?, deskripsi = ?, sks = ?, kategori = ?, status = ? WHERE id = ?");
        $stmt->execute([
            $input['kode_mapel'],
            $input['nama_mapel'], 
            $input['deskripsi'] ?? '',
            $input['sks'] ?? 1,
            $input['kategori'] ?? 'Umum',
            $input['status'] ?? 'Aktif',
            $input['id']
        ]);
        $message = 'Mata pelajaran berhasil diupdate';
    } else {
        // Create new mapel
        $stmt = $db->prepare("INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, deskripsi, sks, kategori, status) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['kode_mapel'],
            $input['nama_mapel'],
            $input['deskripsi'] ?? '',
            $input['sks'] ?? 1,
            $input['kategori'] ?? 'Umum',
            $input['status'] ?? 'Aktif'
        ]);
        $message = 'Mata pelajaran berhasil ditambahkan';
    }
    
    echo json_encode(['success' => true, 'message' => $message]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
