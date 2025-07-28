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
                a.nama_asrama,
                u.email as disetujui_email
            FROM surat_izin_keluar si
            LEFT JOIN santri s ON si.santri_id = s.id
            LEFT JOIN kelas k ON s.id = k.id  
            LEFT JOIN santri_asrama sa ON s.id = sa.santri_id AND sa.status = 'Aktif'
            LEFT JOIN asrama a ON sa.asrama_id = a.id
            LEFT JOIN users u ON si.disetujui_oleh = u.id
            WHERE si.id = ?
        ");
        $stmt->execute([$id]);
        $surat = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($surat) {
            echo json_encode(['success' => true, 'data' => $surat]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Surat izin tidak ditemukan']);
        }
    } else {
        // Get all surat izin with filters
        $status = $_GET['status'] ?? null;
        $santri_id = $_GET['santri_id'] ?? null;
        $start_date = $_GET['start_date'] ?? null;
        $end_date = $_GET['end_date'] ?? null;
        
        $where_conditions = [];
        $params = [];
        
        if ($status) {
            $where_conditions[] = "si.status = ?";
            $params[] = $status;
        }
        
        if ($santri_id) {
            $where_conditions[] = "si.santri_id = ?";
            $params[] = $santri_id;
        }
        
        if ($start_date) {
            $where_conditions[] = "si.tanggal_keluar >= ?";
            $params[] = $start_date;
        }
        
        if ($end_date) {
            $where_conditions[] = "si.tanggal_keluar <= ?";
            $params[] = $end_date;
        }
        
        $where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';
        
        $stmt = $pdo->prepare("
            SELECT 
                si.*,
                s.nama as nama_santri,
                s.nis,
                k.nama_kelas,
                a.nama_asrama,
                u.email as disetujui_email
            FROM surat_izin_keluar si
            LEFT JOIN santri s ON si.santri_id = s.id
            LEFT JOIN kelas k ON s.id = k.id  
            LEFT JOIN santri_asrama sa ON s.id = sa.santri_id AND sa.status = 'Aktif'
            LEFT JOIN asrama a ON sa.asrama_id = a.id
            LEFT JOIN users u ON si.disetujui_oleh = u.id
            $where_clause
            ORDER BY si.created_at DESC
        ");
        $stmt->execute($params);
        $surat_izin = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format tanggal untuk frontend
        foreach ($surat_izin as &$surat) {
            $surat['tanggal_keluar'] = date('d/m/Y', strtotime($surat['tanggal_keluar']));
            $surat['tanggal_masuk'] = date('d/m/Y', strtotime($surat['tanggal_masuk']));
            $surat['created_at'] = date('d/m/Y H:i', strtotime($surat['created_at']));
        }
        
        echo json_encode([
            'success' => true, 
            'data' => $surat_izin,
            'total' => count($surat_izin)
        ]);
    }
}

function createSuratIzin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $required_fields = ['santri_id', 'jenis_izin', 'tanggal_keluar', 'tanggal_kembali', 'alamat_tujuan', 'alasan'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field $field harus diisi");
        }
    }
    
    // Generate nomor surat otomatis
    $tahun = date('Y');
    $bulan = date('m');
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM surat_izin_keluar WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?");
    $stmt->execute([$tahun, $bulan]);
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $nomor_urut = str_pad($count + 1, 3, '0', STR_PAD_LEFT);
    $nomor_surat = "SI/{$nomor_urut}/PST/{$bulan}/{$tahun}";
    
    $stmt = $pdo->prepare("
        INSERT INTO surat_izin_keluar (
            nomor_surat, santri_id, jenis_izin, tanggal_keluar, tanggal_kembali,
            alamat_tujuan, alasan, nomor_hp_wali, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    ");
    
    $stmt->execute([
        $nomor_surat,
        $input['santri_id'],
        $input['jenis_izin'],
        $input['tanggal_keluar'],
        $input['tanggal_kembali'],
        $input['alamat_tujuan'],
        $input['alasan'],
        $input['nomor_hp_wali'] ?? ''
    ]);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Surat izin berhasil diajukan',
        'nomor_surat' => $nomor_surat
    ]);
}

function updateSuratIzin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id'])) {
        throw new Exception('ID surat izin harus diisi');
    }
    
    // Update status persetujuan
    if (isset($input['status'])) {
        $stmt = $pdo->prepare("
            UPDATE surat_izin_keluar 
            SET status = ?, disetujui_oleh = ?, catatan_persetujuan = ?, updated_at = NOW()
            WHERE id = ?
        ");
        
        $stmt->execute([
            $input['status'],
            $input['disetujui_oleh'] ?? null,
            $input['catatan_persetujuan'] ?? '',
            $input['id']
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Status surat izin berhasil diupdate']);
    } else {
        // Update data surat izin
        $stmt = $pdo->prepare("
            UPDATE surat_izin_keluar 
            SET jenis_izin = ?, tanggal_keluar = ?, tanggal_masuk = ?,
                jam_keluar = ?, jam_masuk = ?, tujuan = ?, keperluan = ?,
                penanggung_jawab = ?, telepon_penanggung_jawab = ?, updated_at = NOW()
            WHERE id = ?
        ");
        
        $stmt->execute([
            $input['jenis_izin'],
            $input['tanggal_keluar'],
            $input['tanggal_masuk'],
            $input['jam_keluar'],
            $input['jam_masuk'],
            $input['tujuan'],
            $input['keperluan'],
            $input['penanggung_jawab'],
            $input['telepon_penanggung_jawab'],
            $input['id']
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Surat izin berhasil diupdate']);
    }
}

function deleteSuratIzin($pdo) {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        throw new Exception('ID surat izin harus diisi');
    }
    
    $stmt = $pdo->prepare("DELETE FROM surat_izin_keluar WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'message' => 'Surat izin berhasil dihapus']);
}
?>
