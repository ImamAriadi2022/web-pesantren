<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'ID ustadz tidak ditemukan'
        ]);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // Ambil data ustadz untuk mendapatkan NIP dan hapus foto jika ada
        $stmt = $pdo->prepare("SELECT nip, foto FROM ustadz WHERE id = ?");
        $stmt->execute([$input['id']]);
        $ustadz = $stmt->fetch();
        
        if (!$ustadz) {
            echo json_encode([
                'success' => false,
                'message' => 'Ustadz tidak ditemukan'
            ]);
            exit;
        }
        
        // Hapus foto dari server jika ada
        if (!empty($ustadz['foto'])) {
            $fotoPath = __DIR__ . '/' . $ustadz['foto'];
            if (file_exists($fotoPath)) {
                unlink($fotoPath);
            }
        }
        
        // Hapus user account yang terkait (jika ada)
        $deleteUserStmt = $pdo->prepare("DELETE FROM users WHERE username = ?");
        $deleteUserStmt->execute([$ustadz['nip']]);
        
        // Hapus data ustadz
        $deleteUstadzStmt = $pdo->prepare("DELETE FROM ustadz WHERE id = ?");
        $result = $deleteUstadzStmt->execute([$input['id']]);
        
        if ($result) {
            $pdo->commit();
            echo json_encode([
                'success' => true,
                'message' => 'Data ustadz berhasil dihapus'
            ]);
        } else {
            $pdo->rollBack();
            echo json_encode([
                'success' => false,
                'message' => 'Gagal menghapus data ustadz'
            ]);
        }
        
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log("Error delete ustadz: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
?>
