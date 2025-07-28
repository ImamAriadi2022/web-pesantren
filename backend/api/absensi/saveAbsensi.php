<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

try {
    if (isset($input['id']) && $input['id']) {
        // Update existing absensi
        $stmt = $pdo->prepare("UPDATE absensi SET santri_id = ?, tanggal = ?, status = ?, keterangan = ?, dibuat_oleh = ? WHERE id = ?");
        $stmt->execute([
            $input['santri_id'],
            $input['tanggal'],
            $input['status'],
            $input['keterangan'] ?? '',
            1, // dibuat_oleh default user id 1
            $input['id']
        ]);
        $message = 'Absensi berhasil diupdate';
    } else {
        // Create new absensi
        // Check if absensi already exists for this santri on this date
        $stmt = $pdo->prepare("SELECT id FROM absensi WHERE santri_id = ? AND tanggal = ?");
        $stmt->execute([$input['santri_id'], $input['tanggal']]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            echo json_encode(['success' => false, 'message' => 'Absensi untuk santri ini pada tanggal tersebut sudah ada']);
            exit;
        }
        
        $stmt = $pdo->prepare("INSERT INTO absensi (santri_id, tanggal, status, keterangan, dibuat_oleh) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['santri_id'],
            $input['tanggal'],
            $input['status'],
            $input['keterangan'] ?? '',
            1 // dibuat_oleh default user id 1
        ]);
        $message = 'Absensi berhasil ditambahkan';
    }
    
    echo json_encode(['success' => true, 'message' => $message]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>