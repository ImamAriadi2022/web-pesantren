<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new Exception('Method not allowed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || empty($input['id'])) {
        throw new Exception('ID asrama tidak ditemukan');
    }
    
    // Cek apakah asrama masih memiliki penghuni
    $check_query = "SELECT COUNT(*) as count FROM santri_asrama WHERE asrama_id = ? AND status = 'aktif'";
    $check_stmt = $pdo->prepare($check_query);
    $check_stmt->execute([$input['id']]);
    $penghuni_count = $check_stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($penghuni_count > 0) {
        throw new Exception('Tidak dapat menghapus asrama yang masih memiliki penghuni aktif');
    }
    
    // Hapus data asrama
    $query = "DELETE FROM asrama WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([$input['id']]);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception('Data asrama tidak ditemukan');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Data asrama berhasil dihapus'
    ]);
    
} catch (PDOException $e) {
    error_log("Database Error in deleteAsrama.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan database: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General Error in deleteAsrama.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
