<?php
// filepath: c:\laragon\www\web-pesantren\backend\api\kelas\createClass.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['nama_kelas'])) {
    echo json_encode(['success' => false, 'message' => 'Nama kelas wajib diisi']);
    exit;
}

try {
    // Auto-generate kode_kelas if not provided
    if (empty($data['kode_kelas'])) {
        // Get the highest existing kode_kelas number
        $stmt = $pdo->query("SELECT kode_kelas FROM kelas WHERE kode_kelas REGEXP '^KLS[0-9]+$' ORDER BY CAST(SUBSTRING(kode_kelas, 4) AS UNSIGNED) DESC LIMIT 1");
        $lastKode = $stmt->fetchColumn();
        
        if ($lastKode) {
            $lastNumber = (int)substr($lastKode, 3);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        $data['kode_kelas'] = 'KLS' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    } else {
        // Check if kode_kelas already exists
        $stmt = $pdo->prepare("SELECT id FROM kelas WHERE kode_kelas = ?");
        $stmt->execute([$data['kode_kelas']]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Kode kelas sudah digunakan']);
            exit;
        }
    }

    $stmt = $pdo->prepare("INSERT INTO kelas (kode_kelas, nama_kelas, keterangan) VALUES (?, ?, ?)");
    $success = $stmt->execute([
        $data['kode_kelas'],
        $data['nama_kelas'],
        $data['keterangan'] ?? ''
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
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}