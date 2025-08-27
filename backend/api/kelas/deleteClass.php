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

// Log input for debugging
error_log("deleteClass input: " . json_encode($data));

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
    exit;
}

try {
    $pdo->beginTransaction();
    
    // Check if kelas exists
    $stmt = $pdo->prepare("SELECT nama_kelas FROM kelas WHERE id = ?");
    $stmt->execute([$data['id']]);
    $kelas = $stmt->fetch();
    
    if (!$kelas) {
        echo json_encode(['success' => false, 'message' => 'Kelas tidak ditemukan']);
        exit;
    }
    
    // Check if there are santri assigned to this class
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM santri WHERE kelas_id = ?");
    $stmt->execute([$data['id']]);
    $santriCount = $stmt->fetchColumn();
    
    if ($santriCount > 0) {
        echo json_encode([
            'success' => false, 
            'message' => "Tidak dapat menghapus kelas karena masih ada {$santriCount} santri terdaftar. Pindahkan santri terlebih dahulu."
        ]);
        exit;
    }
    
    // Delete kelas
    $stmt = $pdo->prepare("DELETE FROM kelas WHERE id = ?");
    $success = $stmt->execute([$data['id']]);
    
    if ($success) {
        $pdo->commit();
        echo json_encode([
            'success' => true, 
            'message' => 'Kelas berhasil dihapus'
        ]);
    } else {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus kelas']);
    }
    
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Error in deleteClass.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}