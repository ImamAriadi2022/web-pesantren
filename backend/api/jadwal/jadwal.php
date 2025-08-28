<?php
require_once '../../config/database.php';

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
            getJadwal();
            break;
        case 'POST':
            createJadwal();
            break;
        case 'PUT':
            updateJadwal();
            break;
        case 'DELETE':
            deleteJadwal();
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

function getJadwal() {
    global $pdo;
    
    $id = $_GET['id'] ?? null;
    $ustadz_id = $_GET['ustadz_id'] ?? null;
    $hari = $_GET['hari'] ?? null;
    $ruangan = $_GET['ruangan'] ?? null;
    
    if ($id) {
        $stmt = $pdo->prepare("
            SELECT jp.*, mp.nama_mapel, mp.kode_mapel, u.nama as nama_ustadz, k.nama_kelas, k.kode_kelas
            FROM jadwal_pelajaran jp
            LEFT JOIN mata_pelajaran mp ON jp.mapel_id = mp.id
            LEFT JOIN ustadz u ON jp.ustadz_id = u.id
            LEFT JOIN kelas k ON jp.kelas_id = k.id
            WHERE jp.id = ?
        ");
        $stmt->execute([$id]);
        $jadwal = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($jadwal) {
            echo json_encode($jadwal);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Jadwal tidak ditemukan']);
        }
    } else {
        $query = "
            SELECT jp.*, mp.nama_mapel, mp.kode_mapel, u.nama as nama_ustadz, k.nama_kelas, k.kode_kelas,
                   CONCAT(jp.jam_mulai, ' - ', jp.jam_selesai) as jam
            FROM jadwal_pelajaran jp
            LEFT JOIN mata_pelajaran mp ON jp.mapel_id = mp.id
            LEFT JOIN ustadz u ON jp.ustadz_id = u.id
            LEFT JOIN kelas k ON jp.kelas_id = k.id
            WHERE 1=1
        ";
        
        $params = [];
        
        if ($ustadz_id) {
            $query .= " AND jp.ustadz_id = ?";
            $params[] = $ustadz_id;
        }
        
        if ($hari) {
            $query .= " AND jp.hari = ?";
            $params[] = $hari;
        }
        
        if ($ruangan) {
            $query .= " AND jp.ruangan = ?";
            $params[] = $ruangan;
        }
        
        $query .= " ORDER BY jp.hari, jp.jam_mulai";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $jadwal = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($jadwal);
    }
}

function createJadwal() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak valid']);
        return;
    }
    
    $mapel_id = $input['mapel_id'] ?? '';
    $ustadz_id = $input['ustadz_id'] ?? '';
    $kelas_id = $input['kelas_id'] ?? '';
    $hari = $input['hari'] ?? '';
    $jam_mulai = $input['jam_mulai'] ?? '';
    $jam_selesai = $input['jam_selesai'] ?? '';
    $ruangan = $input['ruangan'] ?? '';
    
    if (empty($mapel_id) || empty($ustadz_id) || empty($kelas_id) || empty($hari) || empty($jam_mulai) || empty($jam_selesai)) {
        http_response_code(400);
        echo json_encode(['error' => 'Mata pelajaran, pengajar, kelas, hari, jam mulai, dan jam selesai harus diisi']);
        return;
    }
    
    // Validasi jam
    if ($jam_mulai >= $jam_selesai) {
        http_response_code(400);
        echo json_encode(['error' => 'Jam mulai harus lebih kecil dari jam selesai']);
        return;
    }
    
    // Check for schedule conflicts
    if (checkSimpleConflicts($pdo, $ustadz_id, $kelas_id, $ruangan, $hari, $jam_mulai, $jam_selesai)) {
        http_response_code(400);
        echo json_encode(['error' => 'Jadwal bentrok dengan jadwal yang sudah ada']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO jadwal_pelajaran (mapel_id, ustadz_id, kelas_id, hari, jam_mulai, jam_selesai, ruangan) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$mapel_id, $ustadz_id, $kelas_id, $hari, $jam_mulai, $jam_selesai, $ruangan]);
        
        $id = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Jadwal berhasil dibuat',
            'id' => $id
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menyimpan jadwal: ' . $e->getMessage()]);
    }
}

function updateJadwal() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak valid']);
        return;
    }
    
    $id = $input['id'];
    $mapel_id = $input['mapel_id'] ?? '';
    $ustadz_id = $input['ustadz_id'] ?? '';
    $kelas_id = $input['kelas_id'] ?? '';
    $hari = $input['hari'] ?? '';
    $jam_mulai = $input['jam_mulai'] ?? '';
    $jam_selesai = $input['jam_selesai'] ?? '';
    $ruangan = $input['ruangan'] ?? '';
    
    if (empty($mapel_id) || empty($ustadz_id) || empty($kelas_id) || empty($hari) || empty($jam_mulai) || empty($jam_selesai)) {
        http_response_code(400);
        echo json_encode(['error' => 'Semua field wajib harus diisi']);
        return;
    }
    
    // Validasi jam
    if ($jam_mulai >= $jam_selesai) {
        http_response_code(400);
        echo json_encode(['error' => 'Jam mulai harus lebih kecil dari jam selesai']);
        return;
    }
    
    // Check for simple schedule conflicts (excluding current record)
    if (checkSimpleConflicts($pdo, $ustadz_id, $kelas_id, $ruangan, $hari, $jam_mulai, $jam_selesai, $id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Jadwal bentrok dengan jadwal lain']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE jadwal_pelajaran SET mapel_id = ?, ustadz_id = ?, kelas_id = ?, hari = ?, jam_mulai = ?, jam_selesai = ?, ruangan = ? WHERE id = ?");
        $result = $stmt->execute([$mapel_id, $ustadz_id, $kelas_id, $hari, $jam_mulai, $jam_selesai, $ruangan, $id]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Jadwal berhasil diupdate'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Jadwal tidak ditemukan']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal mengupdate jadwal: ' . $e->getMessage()]);
    }
}

function deleteJadwal() {
    global $pdo;
    
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID jadwal harus diisi']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM jadwal_pelajaran WHERE id = ?");
        $result = $stmt->execute([$id]);
        
        if ($result && $stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Jadwal berhasil dihapus'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Jadwal tidak ditemukan']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal menghapus jadwal: ' . $e->getMessage()]);
    }
}

// Function untuk validasi konflik yang disederhanakan (sesuai schema)
function checkSimpleConflicts($pdo, $ustadz_id, $kelas_id, $ruangan, $hari, $jam_mulai, $jam_selesai, $exclude_id = null) {
    // Cek konflik ustadz
    $query = "
        SELECT jp.*, mp.nama_mapel, u.nama as nama_ustadz
        FROM jadwal_pelajaran jp
        LEFT JOIN mata_pelajaran mp ON jp.mapel_id = mp.id
        LEFT JOIN ustadz u ON jp.ustadz_id = u.id
        WHERE jp.ustadz_id = ? 
        AND jp.hari = ? 
        AND (
            (jp.jam_mulai <= ? AND jp.jam_selesai > ?) OR
            (jp.jam_mulai < ? AND jp.jam_selesai >= ?) OR
            (jp.jam_mulai >= ? AND jp.jam_selesai <= ?)
        )
    ";
    
    $params = [$ustadz_id, $hari, $jam_mulai, $jam_mulai, $jam_selesai, $jam_selesai, $jam_mulai, $jam_selesai];
    
    if ($exclude_id) {
        $query .= " AND jp.id != ?";
        $params[] = $exclude_id;
    }
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        return true; // Ada konflik ustadz
    }
    
    // Cek konflik kelas
    $query = "
        SELECT jp.*, mp.nama_mapel, k.nama_kelas
        FROM jadwal_pelajaran jp
        LEFT JOIN mata_pelajaran mp ON jp.mapel_id = mp.id
        LEFT JOIN kelas k ON jp.kelas_id = k.id
        WHERE jp.kelas_id = ? 
        AND jp.hari = ? 
        AND (
            (jp.jam_mulai <= ? AND jp.jam_selesai > ?) OR
            (jp.jam_mulai < ? AND jp.jam_selesai >= ?) OR
            (jp.jam_mulai >= ? AND jp.jam_selesai <= ?)
        )
    ";
    
    $params = [$kelas_id, $hari, $jam_mulai, $jam_mulai, $jam_selesai, $jam_selesai, $jam_mulai, $jam_selesai];
    
    if ($exclude_id) {
        $query .= " AND jp.id != ?";
        $params[] = $exclude_id;
    }
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        return true; // Ada konflik kelas
    }
    
    // Cek konflik ruangan jika ruangan diisi
    if (!empty($ruangan)) {
        $query = "
            SELECT jp.*, mp.nama_mapel, u.nama as nama_ustadz
            FROM jadwal_pelajaran jp
            LEFT JOIN mata_pelajaran mp ON jp.mapel_id = mp.id
            LEFT JOIN ustadz u ON jp.ustadz_id = u.id
            WHERE jp.ruangan = ? 
            AND jp.hari = ? 
            AND (
                (jp.jam_mulai <= ? AND jp.jam_selesai > ?) OR
                (jp.jam_mulai < ? AND jp.jam_selesai >= ?) OR
                (jp.jam_mulai >= ? AND jp.jam_selesai <= ?)
            )
        ";
        
        $params = [$ruangan, $hari, $jam_mulai, $jam_mulai, $jam_selesai, $jam_selesai, $jam_mulai, $jam_selesai];
        
        if ($exclude_id) {
            $query .= " AND jp.id != ?";
            $params[] = $exclude_id;
        }
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        
        if ($stmt->fetch(PDO::FETCH_ASSOC)) {
            return true; // Ada konflik ruangan
        }
    }
    
    return false; // Tidak ada konflik
}
?>
