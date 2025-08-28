<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    // Get ustadz_id from parameter atau fallback ke user_id
    $ustadz_id = $_GET['ustadz_id'] ?? null;
    $user_id = $_GET['user_id'] ?? null;
    
    if (!$ustadz_id && !$user_id) {
        throw new Exception('Parameter ustadz_id atau user_id diperlukan');
    }

        if ($ustadz_id) {
            // Query berdasarkan ustadz_id (tanpa join users, email tidak diperlukan)
            $stmt = $pdo->prepare("SELECT * FROM ustadz WHERE id = ?");
            $stmt->execute([$ustadz_id]);
    } else {
        // Query berdasarkan user_id (fallback)
            $stmt = $pdo->prepare("SELECT * FROM ustadz WHERE user_id = ?");
            $stmt->execute([$user_id]);
    }
    $pengajar = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($pengajar) {
        echo json_encode([
            'success' => true,
            'data' => $pengajar
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Data pengajar tidak ditemukan'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
