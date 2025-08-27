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
error_log("createClass input: " . json_encode($data));

if (!$data || !isset($data['nama_kelas'])) {
    echo json_encode(['success' => false, 'message' => 'Nama kelas wajib diisi']);
    exit;
}

try {
    // Auto-generate kode_kelas if not provided
    if (empty($data['kode_kelas'])) {
        // Get the highest existing kode_kelas number
        $stmt = $pdo->query("SELECT kode_kelas FROM kelas WHERE kode_kelas REGEXP '^K[0-9]+[A-Z]?$' ORDER BY LENGTH(kode_kelas) DESC, kode_kelas DESC LIMIT 1");
        $lastKode = $stmt->fetchColumn();
        
        if ($lastKode) {
            // Extract number from kode like K1A, K2B, etc.
            preg_match('/^K(\d+)([A-Z]?)$/', $lastKode, $matches);
            $lastNumber = isset($matches[1]) ? (int)$matches[1] : 0;
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        $data['kode_kelas'] = 'K' . $newNumber . 'A';
    } else {
        // Check if kode_kelas already exists
        $stmt = $pdo->prepare("SELECT id FROM kelas WHERE kode_kelas = ?");
        $stmt->execute([$data['kode_kelas']]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Kode kelas sudah digunakan']);
            exit;
        }
    }

    // Insert kelas berdasarkan schema_clean.sql
    $stmt = $pdo->prepare("
        INSERT INTO kelas (nama_kelas, kode_kelas, kapasitas, status) 
        VALUES (?, ?, ?, ?)
    ");
    
    $success = $stmt->execute([
        $data['nama_kelas'],
        $data['kode_kelas'],
        $data['kapasitas'] ?? 30,
        $data['status'] ?? 'Aktif'
    ]);

    if ($success) {
        echo json_encode([
            'success' => true, 
            'message' => 'Kelas berhasil ditambahkan',
            'kode_kelas' => $data['kode_kelas']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menambahkan kelas']);
    }
} catch (Exception $e) {
    error_log("Error in createClass.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}