<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\download_brosur.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';

try {
    // Get PSB PDF path from settings
    $stmt = $pdo->prepare("SELECT nilai_setting FROM pengaturan WHERE nama_setting = 'psb_pdf'");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result && !empty($result['nilai_setting'])) {
        $pdf_path = '../' . $result['nilai_setting'];
        
        if (file_exists($pdf_path)) {
            // Get file info
            $file_info = pathinfo($pdf_path);
            $file_size = filesize($pdf_path);
            
            // Set headers for PDF download
            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment; filename="Brosur_PSB_' . date('Y') . '.pdf"');
            header('Content-Length: ' . $file_size);
            header('Cache-Control: private, must-revalidate');
            header('Pragma: private');
            
            // Output file
            readfile($pdf_path);
            exit;
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'File brosur tidak ditemukan']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Brosur PSB belum diupload']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
