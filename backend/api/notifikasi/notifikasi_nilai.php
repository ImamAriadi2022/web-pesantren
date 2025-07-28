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
            getNotifikasiNilai();
            break;
        case 'POST':
            createNotifikasiNilai();
            break;
        case 'PUT':
            updateNotifikasiNilai();
            break;
        case 'DELETE':
            deleteNotifikasiNilai();
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

function getNotifikasiNilai() {
    global $pdo;
    
    $santri_id = $_GET['santri_id'] ?? null;
    $status = $_GET['status'] ?? null;
    
    $query = "
        SELECT nn.*, n.nilai, n.jenis_nilai, mp.nama_mapel, s.nama as nama_santri
        FROM notifikasi_nilai nn
        JOIN nilai n ON nn.nilai_id = n.id
        JOIN mata_pelajaran mp ON n.mapel_id = mp.id
        JOIN santri s ON nn.santri_id = s.id
        WHERE 1=1
    ";
    
    $params = [];
    
    if ($santri_id) {
        $query .= " AND nn.santri_id = ?";
        $params[] = $santri_id;
    }
    
    if ($status) {
        $query .= " AND nn.status = ?";
        $params[] = $status;
    }
    
    $query .= " ORDER BY nn.created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $notifikasi = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($notifikasi);
}

function createNotifikasiNilai() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak valid']);
        return;
    }
    
    $santri_id = $input['santri_id'] ?? '';
    $nilai_id = $input['nilai_id'] ?? '';
    $pesan = $input['pesan'] ?? '';
    
    if (empty($santri_id) || empty($nilai_id) || empty($pesan)) {
        http_response_code(400);
        echo json_encode(['error' => 'Santri ID, Nilai ID, dan pesan harus diisi']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO notifikasi_nilai (santri_id, nilai_id, pesan) VALUES (?, ?, ?)");
        $stmt->execute([$santri_id, $nilai_id, $pesan]);
        
        $id = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Notifikasi nilai berhasil dibuat',
            'id' => $id
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal membuat notifikasi: ' . $e->getMessage()]);
    }
}

function updateNotifikasiNilai() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak valid']);
        return;
    }
    
    $id = $input['id'];
    $status = $input['status'] ?? 'Sudah Dibaca';
    
    try {
        $stmt = $pdo->prepare("UPDATE notifikasi_nilai SET status = ? WHERE id = ?");
        $result = $stmt->execute([$status, $id]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Status notifikasi berhasil diupdate'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Notifikasi tidak ditemukan']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal mengupdate notifikasi: ' . $e->getMessage()]);
    }
}

function deleteNotifikasiNilai() {
    global $pdo;
    
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID notifikasi harus diisi']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM notifikasi_nilai WHERE id = ?");
        $result = $stmt->execute([$id]);
        
        if ($result && $stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Notifikasi berhasil dihapus'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Notifikasi tidak ditemukan']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menghapus notifikasi: ' . $e->getMessage()]);
    }
}

// Fungsi untuk otomatis membuat notifikasi ketika ada nilai baru
function createAutoNotifikasi($santri_id, $nilai_id, $nilai_data) {
    global $pdo;
    
    try {
        // Ambil data santri dan mata pelajaran
        $stmt = $pdo->prepare("
            SELECT s.nama as nama_santri, mp.nama_mapel, n.nilai, n.jenis_nilai
            FROM santri s, mata_pelajaran mp, nilai n
            WHERE s.id = ? AND mp.id = n.mapel_id AND n.id = ?
        ");
        $stmt->execute([$santri_id, $nilai_id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($data) {
            $pesan = "Nilai baru telah diinput untuk mata pelajaran {$data['nama_mapel']}. Jenis: {$data['jenis_nilai']}, Nilai: {$data['nilai']}";
            
            $stmt = $pdo->prepare("INSERT INTO notifikasi_nilai (santri_id, nilai_id, pesan) VALUES (?, ?, ?)");
            $stmt->execute([$santri_id, $nilai_id, $pesan]);
            
            return true;
        }
    } catch (PDOException $e) {
        error_log("Error creating auto notification: " . $e->getMessage());
    }
    
    return false;
}
?>
