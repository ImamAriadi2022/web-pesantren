<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

require_once '../config/database.php';

try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['field']) || empty($data['field'])) {
        echo json_encode(['success' => false, 'message' => 'Field name is required']);
        exit();
    }

    $field = $data['field'];

    // Validate field name to prevent SQL injection
    $allowedFields = [
        'judul_web', 'tagline_web', 'caption_web', 'tentang_web', 'footer_web', 
        'logo_web', 'nama_instansi', 'nama_pimpinan', 'nik_pimpinan', 'alamat', 
        'email_instansi', 'telp', 'whatsapp', 'website', 'psb_pdf'
    ];

    if (!in_array($field, $allowedFields)) {
        echo json_encode(['success' => false, 'message' => 'Invalid field name']);
        exit();
    }

    // Delete the specific field (remove from pengaturan table)
    $sql = "DELETE FROM pengaturan WHERE pengaturan_key = ?";
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([$field]);

    if ($result) {
        // Log the deletion
        error_log("Field deleted: " . $field . " at " . date('Y-m-d H:i:s'));
        
        echo json_encode([
            'success' => true, 
            'message' => 'Field berhasil dihapus dari database',
            'deleted_field' => $field
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus field dari database']);
    }

} catch (PDOException $e) {
    error_log("Database error in delete_settings.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General error in delete_settings.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>