<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
    exit;
}

try {
    $pdo->beginTransaction();
    
    // Ambil data santri untuk mendapatkan NIS dan hapus foto jika ada
    $stmt = $pdo->prepare("SELECT nis, foto FROM santri WHERE id = ?");
    $stmt->execute([$data['id']]);
    $santri = $stmt->fetch();
    
    if (!$santri) {
        echo json_encode(['success' => false, 'message' => 'Santri tidak ditemukan']);
        exit;
    }
    
    // Hapus foto dari server jika ada
    if (!empty($santri['foto'])) {
        $fotoPath = __DIR__ . '/' . $santri['foto'];
        if (file_exists($fotoPath)) {
            unlink($fotoPath);
        }
    }
    
    // Hapus user account yang terkait (jika ada)
    $deleteUserStmt = $pdo->prepare("DELETE FROM users WHERE username = ?");
    $deleteUserStmt->execute([$santri['nis']]);
    
    // Hapus data santri
    $deleteSantriStmt = $pdo->prepare("DELETE FROM santri WHERE id = ?");
    $success = $deleteSantriStmt->execute([$data['id']]);
    
    if ($success) {
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Data santri berhasil dihapus']);
    } else {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus data santri']);
    }
    
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("Error delete santri: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Gagal menghapus santri: ' . $e->getMessage()]);
}