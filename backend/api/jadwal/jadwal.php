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
    $kelas_id = $_GET['kelas_id'] ?? null;
    $ustadz_id = $_GET['ustadz_id'] ?? null;
    $hari = $_GET['hari'] ?? null;
    $tahun_ajaran = $_GET['tahun_ajaran'] ?? null;
    $semester = $_GET['semester'] ?? null;
    
    if ($id) {
        $stmt = $pdo->prepare("
            SELECT jp.*, k.nama_kelas, k.kode_kelas, mp.nama_mapel, u.nama as nama_ustadz
            FROM jadwal_pelajaran jp
            LEFT JOIN kelas k ON jp.kelas_id = k.id
            LEFT JOIN mata_pelajaran mp ON jp.mapel_id = mp.id
            LEFT JOIN ustadz u ON jp.ustadz_id = u.id
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
            SELECT jp.*, k.nama_kelas, k.kode_kelas, mp.nama_mapel, u.nama as nama_ustadz
            FROM jadwal_pelajaran jp
            LEFT JOIN kelas k ON jp.kelas_id = k.id
            LEFT JOIN mata_pelajaran mp ON jp.mapel_id = mp.id
            LEFT JOIN ustadz u ON jp.ustadz_id = u.id
            WHERE 1=1
        ";
        
        $params = [];
        
        if ($kelas_id) {
            $query .= " AND jp.kelas_id = ?";
            $params[] = $kelas_id;
        }
        
        if ($ustadz_id) {
            $query .= " AND jp.ustadz_id = ?";
            $params[] = $ustadz_id;
        }
        
        if ($hari) {
            $query .= " AND jp.hari = ?";
            $params[] = $hari;
        }
        
        if ($tahun_ajaran) {
            $query .= " AND jp.tahun_ajaran = ?";
            $params[] = $tahun_ajaran;
        }
        
        if ($semester) {
            $query .= " AND jp.semester = ?";
            $params[] = $semester;
        }
        
        $query .= " AND jp.status = 'Aktif' ORDER BY jp.hari, jp.jam_mulai";
        
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
    
    $kelas_id = $input['kelas_id'] ?? '';
    $mapel_id = $input['mapel_id'] ?? '';
    $ustadz_id = $input['ustadz_id'] ?? '';
    $hari = $input['hari'] ?? '';
    $jam_mulai = $input['jam_mulai'] ?? '';
    $jam_selesai = $input['jam_selesai'] ?? '';
    $ruangan = $input['ruangan'] ?? '';
    $tahun_ajaran = $input['tahun_ajaran'] ?? '2024/2025';
    $semester = $input['semester'] ?? 'Ganjil';
    
    if (empty($kelas_id) || empty($mapel_id) || empty($ustadz_id) || empty($hari) || empty($jam_mulai) || empty($jam_selesai)) {
        http_response_code(400);
        echo json_encode(['error' => 'Semua field wajib harus diisi']);
        return;
    }
    
    // Check for schedule conflicts
    $conflict_check = checkScheduleConflict($ustadz_id, $hari, $jam_mulai, $jam_selesai, $tahun_ajaran, $semester);
    if ($conflict_check) {
        http_response_code(400);
        echo json_encode(['error' => 'Jadwal bentrok dengan jadwal yang sudah ada: ' . $conflict_check]);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO jadwal_pelajaran (kelas_id, mapel_id, ustadz_id, hari, jam_mulai, jam_selesai, ruangan, tahun_ajaran, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$kelas_id, $mapel_id, $ustadz_id, $hari, $jam_mulai, $jam_selesai, $ruangan, $tahun_ajaran, $semester]);
        
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
    $kelas_id = $input['kelas_id'] ?? '';
    $mapel_id = $input['mapel_id'] ?? '';
    $ustadz_id = $input['ustadz_id'] ?? '';
    $hari = $input['hari'] ?? '';
    $jam_mulai = $input['jam_mulai'] ?? '';
    $jam_selesai = $input['jam_selesai'] ?? '';
    $ruangan = $input['ruangan'] ?? '';
    $tahun_ajaran = $input['tahun_ajaran'] ?? '2024/2025';
    $semester = $input['semester'] ?? 'Ganjil';
    $status = $input['status'] ?? 'Aktif';
    
    if (empty($kelas_id) || empty($mapel_id) || empty($ustadz_id) || empty($hari) || empty($jam_mulai) || empty($jam_selesai)) {
        http_response_code(400);
        echo json_encode(['error' => 'Semua field wajib harus diisi']);
        return;
    }
    
    // Check for schedule conflicts (excluding current record)
    $conflict_check = checkScheduleConflict($ustadz_id, $hari, $jam_mulai, $jam_selesai, $tahun_ajaran, $semester, $id);
    if ($conflict_check) {
        http_response_code(400);
        echo json_encode(['error' => 'Jadwal bentrok dengan jadwal yang sudah ada: ' . $conflict_check]);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE jadwal_pelajaran SET kelas_id = ?, mapel_id = ?, ustadz_id = ?, hari = ?, jam_mulai = ?, jam_selesai = ?, ruangan = ?, tahun_ajaran = ?, semester = ?, status = ? WHERE id = ?");
        $result = $stmt->execute([$kelas_id, $mapel_id, $ustadz_id, $hari, $jam_mulai, $jam_selesai, $ruangan, $tahun_ajaran, $semester, $status, $id]);
        
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

function checkScheduleConflict($ustadz_id, $hari, $jam_mulai, $jam_selesai, $tahun_ajaran, $semester, $exclude_id = null) {
    global $pdo;
    
    $query = "
        SELECT jp.*, k.nama_kelas, mp.nama_mapel
        FROM jadwal_pelajaran jp
        LEFT JOIN kelas k ON jp.kelas_id = k.id
        LEFT JOIN mata_pelajaran mp ON jp.mapel_id = mp.id
        WHERE jp.ustadz_id = ? 
        AND jp.hari = ? 
        AND jp.tahun_ajaran = ? 
        AND jp.semester = ?
        AND jp.status = 'Aktif'
        AND (
            (jp.jam_mulai <= ? AND jp.jam_selesai > ?) OR
            (jp.jam_mulai < ? AND jp.jam_selesai >= ?) OR
            (jp.jam_mulai >= ? AND jp.jam_selesai <= ?)
        )
    ";
    
    $params = [$ustadz_id, $hari, $tahun_ajaran, $semester, $jam_mulai, $jam_mulai, $jam_selesai, $jam_selesai, $jam_mulai, $jam_selesai];
    
    if ($exclude_id) {
        $query .= " AND jp.id != ?";
        $params[] = $exclude_id;
    }
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $conflict = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($conflict) {
        return $conflict['nama_kelas'] . ' - ' . $conflict['nama_mapel'] . ' (' . $conflict['jam_mulai'] . '-' . $conflict['jam_selesai'] . ')';
    }
    
    return false;
}
?>
