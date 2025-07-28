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
            getKomunikasi();
            break;
        case 'POST':
            createKomunikasi();
            break;
        case 'PUT':
            updateKomunikasi();
            break;
        case 'DELETE':
            deleteKomunikasi();
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

function getKomunikasi() {
    global $pdo;
    
    $id = $_GET['id'] ?? null;
    $user_id = $_GET['user_id'] ?? null;
    $tipe = $_GET['tipe'] ?? null;
    $kelas_id = $_GET['kelas_id'] ?? null;
    
    if ($id) {
        $stmt = $pdo->prepare("
            SELECT k.*, 
                   u1.nama as nama_pengirim, u1.role as role_pengirim,
                   u2.nama as nama_penerima, u2.role as role_penerima,
                   kls.nama_kelas
            FROM komunikasi k
            LEFT JOIN users u1 ON k.pengirim_id = u1.id
            LEFT JOIN users u2 ON k.penerima_id = u2.id  
            LEFT JOIN kelas kls ON k.kelas_id = kls.id
            WHERE k.id = ?
        ");
        $stmt->execute([$id]);
        $komunikasi = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($komunikasi) {
            echo json_encode($komunikasi);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pesan tidak ditemukan']);
        }
    } else {
        $query = "
            SELECT k.*, 
                   u1.nama as nama_pengirim, u1.role as role_pengirim,
                   u2.nama as nama_penerima, u2.role as role_penerima,
                   kls.nama_kelas
            FROM komunikasi k
            LEFT JOIN users u1 ON k.pengirim_id = u1.id
            LEFT JOIN users u2 ON k.penerima_id = u2.id
            LEFT JOIN kelas kls ON k.kelas_id = kls.id
            WHERE 1=1
        ";
        
        $params = [];
        
        if ($user_id) {
            $query .= " AND (k.pengirim_id = ? OR k.penerima_id = ?)";
            $params[] = $user_id;
            $params[] = $user_id;
        }
        
        if ($tipe) {
            $query .= " AND k.tipe = ?";
            $params[] = $tipe;
        }
        
        if ($kelas_id) {
            $query .= " AND k.kelas_id = ?";
            $params[] = $kelas_id;
        }
        
        $query .= " ORDER BY k.created_at DESC";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $komunikasi = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($komunikasi);
    }
}

function createKomunikasi() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak valid']);
        return;
    }
    
    $pengirim_id = $input['pengirim_id'] ?? '';
    $penerima_id = $input['penerima_id'] ?? '';
    $judul = $input['judul'] ?? '';
    $pesan = $input['pesan'] ?? '';
    $tipe = $input['tipe'] ?? 'Pribadi';
    $kelas_id = $input['kelas_id'] ?? null;
    $lampiran = $input['lampiran'] ?? null;
    
    if (empty($pengirim_id) || empty($judul) || empty($pesan)) {
        http_response_code(400);
        echo json_encode(['error' => 'Pengirim, judul, dan pesan harus diisi']);
        return;
    }
    
    // Untuk pesan kelas, tidak perlu penerima spesifik
    if ($tipe != 'Kelas' && empty($penerima_id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Penerima harus diisi untuk pesan pribadi']);
        return;
    }
    
    // Jika tipe kelas, set penerima_id ke 0 sebagai placeholder
    if ($tipe == 'Kelas') {
        $penerima_id = 0;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO komunikasi (pengirim_id, penerima_id, judul, pesan, tipe, kelas_id, lampiran) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$pengirim_id, $penerima_id, $judul, $pesan, $tipe, $kelas_id, $lampiran]);
        
        $id = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Pesan berhasil dikirim',
            'id' => $id
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal mengirim pesan: ' . $e->getMessage()]);
    }
}

function updateKomunikasi() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak valid']);
        return;
    }
    
    $id = $input['id'];
    $status = $input['status'] ?? null;
    
    if ($status == 'Dibaca') {
        $stmt = $pdo->prepare("UPDATE komunikasi SET status = ?, tanggal_baca = NOW() WHERE id = ?");
        $result = $stmt->execute([$status, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE komunikasi SET status = ? WHERE id = ?");
        $result = $stmt->execute([$status, $id]);
    }
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Status pesan berhasil diupdate'
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Pesan tidak ditemukan']);
    }
}

function deleteKomunikasi() {
    global $pdo;
    
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID pesan harus diisi']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM komunikasi WHERE id = ?");
        $result = $stmt->execute([$id]);
        
        if ($result && $stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Pesan berhasil dihapus'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pesan tidak ditemukan']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menghapus pesan: ' . $e->getMessage()]);
    }
}
?>
