<?php
require_once '../../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID mata pelajaran harus diisi']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM mata_pelajaran WHERE id = ?");
    $result = $stmt->execute([$input['id']]);
    
    if ($result && $stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Mata pelajaran berhasil dihapus'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Mata pelajaran tidak ditemukan']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Gagal menghapus data: ' . $e->getMessage()]);
}
?>
