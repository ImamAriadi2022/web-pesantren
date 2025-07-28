<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            getMapel();
            break;
        case 'POST':
            createMapel();
            break;
        case 'PUT':
            updateMapel();
            break;
        case 'DELETE':
            deleteMapel();
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

function getMapel() {
    global $pdo;
    
    $id = $_GET['id'] ?? null;
    
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM mata_pelajaran WHERE id = ?");
        $stmt->execute([$id]);
        $mapel = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($mapel) {
            echo json_encode($mapel);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Mata pelajaran tidak ditemukan']);
        }
    } else {
        $stmt = $pdo->query("SELECT * FROM mata_pelajaran ORDER BY nama_mapel ASC");
        $mapel = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($mapel);
    }
}

function createMapel() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak valid']);
        return;
    }
    
    $kode_mapel = $input['kode_mapel'] ?? '';
    $nama_mapel = $input['nama_mapel'] ?? '';
    $deskripsi = $input['deskripsi'] ?? '';
    $sks = $input['sks'] ?? 1;
    $kkm = $input['kkm'] ?? 75;
    $kategori = $input['kategori'] ?? 'Umum';
    $status = $input['status'] ?? 'Aktif';
    
    if (empty($kode_mapel) || empty($nama_mapel)) {
        http_response_code(400);
        echo json_encode(['error' => 'Kode mapel dan nama mapel harus diisi']);
        return;
    }
    
    // Validasi KKM
    if ($kkm < 0 || $kkm > 100) {
        http_response_code(400);
        echo json_encode(['error' => 'KKM harus antara 0-100']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, deskripsi, sks, kkm, kategori, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$kode_mapel, $nama_mapel, $deskripsi, $sks, $kkm, $kategori, $status]);
        
        $id = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Mata pelajaran berhasil dibuat',
            'id' => $id
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(400);
            echo json_encode(['error' => 'Kode mata pelajaran sudah digunakan']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }
}

function updateMapel() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak valid']);
        return;
    }
    
    $id = $input['id'];
    $kode_mapel = $input['kode_mapel'] ?? '';
    $nama_mapel = $input['nama_mapel'] ?? '';
    $deskripsi = $input['deskripsi'] ?? '';
    $sks = $input['sks'] ?? 1;
    $kkm = $input['kkm'] ?? 75;
    $kategori = $input['kategori'] ?? 'Umum';
    $status = $input['status'] ?? 'Aktif';
    
    if (empty($kode_mapel) || empty($nama_mapel)) {
        http_response_code(400);
        echo json_encode(['error' => 'Kode mapel dan nama mapel harus diisi']);
        return;
    }
    
    // Validasi KKM
    if ($kkm < 0 || $kkm > 100) {
        http_response_code(400);
        echo json_encode(['error' => 'KKM harus antara 0-100']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE mata_pelajaran SET kode_mapel = ?, nama_mapel = ?, deskripsi = ?, sks = ?, kkm = ?, kategori = ?, status = ? WHERE id = ?");
        $result = $stmt->execute([$kode_mapel, $nama_mapel, $deskripsi, $sks, $kkm, $kategori, $status, $id]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Mata pelajaran berhasil diupdate'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Mata pelajaran tidak ditemukan']);
        }
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(400);
            echo json_encode(['error' => 'Kode mata pelajaran sudah digunakan']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Gagal mengupdate data: ' . $e->getMessage()]);
        }
    }
}

function deleteMapel() {
    global $pdo;
    
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID mata pelajaran harus diisi']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM mata_pelajaran WHERE id = ?");
        $result = $stmt->execute([$id]);
        
        if ($result && $stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Mata pelajaran berhasil dihapus'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Mata pelajaran tidak ditemukan']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menghapus data: ' . $e->getMessage()]);
    }
}
?>
