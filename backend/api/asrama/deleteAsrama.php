<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'ID asrama tidak ditemukan'
        ]);
        exit;
    }
    
    try {
        $query = "DELETE FROM asrama WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute([$input['id']]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Data asrama berhasil dihapus'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Gagal menghapus data asrama'
            ]);
        }
    } catch (Exception $e) {
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
