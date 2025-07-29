<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
    exit;
}

$kode_mapel = $input['kode_mapel'] ?? '';
$nama_mapel = $input['nama_mapel'] ?? '';
$deskripsi = $input['deskripsi'] ?? '';
$sks = $input['sks'] ?? 1;
$kkm = $input['kkm'] ?? 75;
$kategori = $input['kategori'] ?? 'Umum';
$status = $input['status'] ?? 'Aktif';

if (empty($kode_mapel) || empty($nama_mapel)) {
    echo json_encode(['success' => false, 'message' => 'Kode mapel dan nama mapel harus diisi']);
    exit;
}

// Validasi KKM
if ($kkm < 0 || $kkm > 100) {
    echo json_encode(['success' => false, 'message' => 'KKM harus antara 0-100']);
    exit;
}

try {
    if (isset($input['id']) && $input['id']) {
        // Update existing mapel
        $stmt = $pdo->prepare("UPDATE mata_pelajaran SET kode_mapel = ?, nama_mapel = ?, deskripsi = ?, sks = ?, kkm = ?, kategori = ?, status = ? WHERE id = ?");
        $result = $stmt->execute([$kode_mapel, $nama_mapel, $deskripsi, $sks, $kkm, $kategori, $status, $input['id']]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Mata pelajaran berhasil diupdate'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Mata pelajaran tidak ditemukan']);
        }
    } else {
        // Create new mapel
        $stmt = $pdo->prepare("INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, deskripsi, sks, kkm, kategori, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$kode_mapel, $nama_mapel, $deskripsi, $sks, $kkm, $kategori, $status]);
        
        $id = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Mata pelajaran berhasil dibuat',
            'id' => $id
        ]);
    }
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'Kode mata pelajaran sudah digunakan']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data: ' . $e->getMessage()]);
    }
}
?>
