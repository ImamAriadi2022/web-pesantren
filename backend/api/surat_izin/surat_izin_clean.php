<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            getSuratIzin($pdo);
            break;
        case 'POST':
            createSuratIzin($pdo);
            break;
        case 'PUT':
            updateSuratIzin($pdo);
            break;
        case 'DELETE':
            deleteSuratIzin($pdo);
            break;
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function getSuratIzin($pdo) {
    $id = $_GET['id'] ?? null;
    
    if ($id) {
        // Get single surat izin
        $stmt = $pdo->prepare("
            SELECT 
                si.*,
                s.nama as nama_santri,
                s.nis,
                k.nama_kelas,
                u.nama as disetujui_oleh_nama
            FROM surat_izin_keluar si
            LEFT JOIN santri s ON si.santri_id = s.id
            LEFT JOIN kelas k ON s.kelas_id = k.id
            LEFT JOIN users u ON si.disetujui_oleh = u.id
            WHERE si.id = :id
        ");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Surat izin tidak ditemukan']);
        }
    } else {
        // Get all surat izin
        $stmt = $pdo->prepare("
            SELECT 
                si.*,
                s.nama as nama_santri,
                s.nis,
                k.nama_kelas,
                u.nama as disetujui_oleh_nama
            FROM surat_izin_keluar si
            LEFT JOIN santri s ON si.santri_id = s.id
            LEFT JOIN kelas k ON s.kelas_id = k.id
            LEFT JOIN users u ON si.disetujui_oleh = u.id
            ORDER BY si.created_at DESC
        ");
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'data' => $results]);
    }
}

function createSuratIzin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $required_fields = ['santri_id', 'tanggal_keluar', 'jam_keluar', 'tanggal_kembali', 'jam_kembali', 'keperluan', 'alamat_tujuan'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field $field harus diisi");
        }
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO surat_izin_keluar (
            santri_id, tanggal_keluar, jam_keluar, tanggal_kembali, jam_kembali,
            keperluan, alamat_tujuan, nama_penjemput, no_hp_penjemput
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $result = $stmt->execute([
        $input['santri_id'],
        $input['tanggal_keluar'],
        $input['jam_keluar'],
        $input['tanggal_kembali'],
        $input['jam_kembali'],
        $input['keperluan'],
        $input['alamat_tujuan'],
        $input['nama_penjemput'] ?? null,
        $input['no_hp_penjemput'] ?? null
    ]);
    
    if ($result) {
        $id = $pdo->lastInsertId();
        echo json_encode(['success' => true, 'message' => 'Surat izin berhasil dibuat', 'id' => $id]);
    } else {
        throw new Exception('Gagal membuat surat izin');
    }
}

function updateSuratIzin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id'])) {
        throw new Exception('ID surat izin harus diisi');
    }
    
    $stmt = $pdo->prepare("
        UPDATE surat_izin_keluar 
        SET santri_id = ?, tanggal_keluar = ?, jam_keluar = ?, tanggal_kembali = ?, jam_kembali = ?,
            keperluan = ?, alamat_tujuan = ?, nama_penjemput = ?, no_hp_penjemput = ?,
            disetujui_oleh = ?, tanggal_disetujui = ?, updated_at = NOW()
        WHERE id = ?
    ");
    
    $result = $stmt->execute([
        $input['santri_id'],
        $input['tanggal_keluar'],
        $input['jam_keluar'],
        $input['tanggal_kembali'],
        $input['jam_kembali'],
        $input['keperluan'],
        $input['alamat_tujuan'],
        $input['nama_penjemput'] ?? null,
        $input['no_hp_penjemput'] ?? null,
        $input['disetujui_oleh'] ?? null,
        $input['disetujui_oleh'] ? date('Y-m-d H:i:s') : null,
        $input['id']
    ]);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Surat izin berhasil diupdate']);
    } else {
        throw new Exception('Gagal mengupdate surat izin');
    }
}

function deleteSuratIzin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? $_GET['id'] ?? null;
    
    if (!$id) {
        throw new Exception('ID surat izin harus diisi');
    }
    
    $stmt = $pdo->prepare("DELETE FROM surat_izin_keluar WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'message' => 'Surat izin berhasil dihapus']);
}
?>
