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
            LEFT JOIN santri_kelas sk ON s.id = sk.santri_id AND sk.status = 'Aktif'
            LEFT JOIN kelas k ON sk.kelas_id = k.id  
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
            LEFT JOIN santri_kelas sk ON s.id = sk.santri_id AND sk.status = 'Aktif'
            LEFT JOIN kelas k ON sk.kelas_id = k.id  
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
            $surat['tanggal_keluar'] = $surat['tanggal_keluar'] ? date('Y-m-d', strtotime($surat['tanggal_keluar'])) : '';
            $surat['tanggal_masuk'] = $surat['tanggal_masuk'] ? date('Y-m-d', strtotime($surat['tanggal_masuk'])) : '';
            $surat['tanggal_kembali'] = $surat['tanggal_masuk']; // Alias untuk frontend
            $surat['created_at'] = $surat['created_at'] ? date('d/m/Y H:i', strtotime($surat['created_at'])) : '-';
            // Map field names for frontend compatibility
            $surat['alasan'] = $surat['keperluan'];
            $surat['alamat_tujuan'] = $surat['tujuan'];
            $surat['nomor_hp_wali'] = $surat['telepon_penanggung_jawab'];
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
    
    // Map frontend field names to backend expectations
    $santri_id = $input['santri_id'] ?? $input['id_santri'] ?? null;
    $jenis_izin = $input['jenis_izin'] ?? 'Lainnya';
    $tanggal_keluar = $input['tanggal_keluar'] ?? $input['tanggal_izin'] ?? null;
    
    if (empty($santri_id)) {
        throw new Exception("Field santri_id harus diisi");
    }
    if (empty($tanggal_keluar)) {
        throw new Exception("Field tanggal_keluar harus diisi");
    }
    
    // Generate nomor surat otomatis
    $tahun = date('Y');
    $bulan = date('m');
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM surat_izin_keluar WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?");
    $stmt->execute([$tahun, $bulan]);
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $nomor_urut = str_pad($count + 1, 3, '0', STR_PAD_LEFT);
    $nomor_surat = "SI/{$nomor_urut}/PST/{$bulan}/{$tahun}";
    
    // Map frontend field names to backend expectations
    $keperluan = $input['alasan'] ?? $input['keperluan'] ?? '';
    $tanggal_masuk = $input['tanggal_kembali'] ?? $input['tanggal_masuk'] ?? null;
    $tujuan = $input['alamat_tujuan'] ?? $input['tujuan'] ?? '';
    $telepon_penanggung_jawab = $input['nomor_hp_wali'] ?? $input['telepon_penanggung_jawab'] ?? '';
    
    // Map status values
    $status_mapping = [
        'pending' => 'Diajukan',
        'approved' => 'Disetujui',
        'rejected' => 'Ditolak',
        'returned' => 'Selesai'
    ];
    $status = $status_mapping[$input['status'] ?? 'pending'] ?? 'Diajukan';
    
    // Map jenis izin values
    $jenis_izin_mapping = [
        'sakit' => 'Sakit',
        'acara_keluarga' => 'Keperluan Keluarga',
        'pulang_kampung' => 'Keperluan Keluarga',
        'keperluan_penting' => 'Urusan Penting',
        'urusan_keluarga' => 'Keperluan Keluarga',
        'lainnya' => 'Lainnya'
    ];
    $jenis_izin = $jenis_izin_mapping[$input['jenis_izin']] ?? 'Lainnya';
    
    $stmt = $pdo->prepare("
        INSERT INTO surat_izin_keluar (
            nomor_surat, santri_id, jenis_izin, tanggal_keluar, tanggal_masuk,
            jam_keluar, jam_masuk, tujuan, keperluan, penanggung_jawab, telepon_penanggung_jawab, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $nomor_surat,
        $santri_id,
        $jenis_izin,
        $tanggal_keluar,
        $tanggal_masuk,
        $input['jam_keluar'] ?? null,
        $input['jam_masuk'] ?? null,
        $tujuan,
        $keperluan,
        $input['penanggung_jawab'] ?? '',
        $telepon_penanggung_jawab,
        $status
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
    
    // Map frontend field names to backend expectations
    $keperluan = $input['alasan'] ?? $input['keperluan'] ?? '';
    $tanggal_masuk = $input['tanggal_kembali'] ?? $input['tanggal_masuk'] ?? null;
    $tujuan = $input['alamat_tujuan'] ?? $input['tujuan'] ?? '';
    $telepon_penanggung_jawab = $input['nomor_hp_wali'] ?? $input['telepon_penanggung_jawab'] ?? '';
    
    // Map status values
    $status_mapping = [
        'pending' => 'Diajukan',
        'approved' => 'Disetujui',
        'rejected' => 'Ditolak',
        'returned' => 'Selesai'
    ];
    $status = $status_mapping[$input['status'] ?? 'pending'] ?? 'Diajukan';
    
    // Map jenis izin values
    $jenis_izin_mapping = [
        'sakit' => 'Sakit',
        'acara_keluarga' => 'Keperluan Keluarga',
        'pulang_kampung' => 'Keperluan Keluarga',
        'keperluan_penting' => 'Urusan Penting',
        'urusan_keluarga' => 'Keperluan Keluarga',
        'lainnya' => 'Lainnya'
    ];
    $jenis_izin = $jenis_izin_mapping[$input['jenis_izin']] ?? 'Lainnya';
    
    // Build dynamic update query based on provided fields
    $update_fields = [];
    $params = [];
    
    if (isset($input['jenis_izin'])) {
        $update_fields[] = "jenis_izin = ?";
        $params[] = $jenis_izin;
    }
    
    if (isset($input['tanggal_keluar'])) {
        $update_fields[] = "tanggal_keluar = ?";
        $params[] = $input['tanggal_keluar'];
    }
    
    if (isset($input['tanggal_masuk']) || isset($input['tanggal_kembali'])) {
        $update_fields[] = "tanggal_masuk = ?";
        $params[] = $tanggal_masuk;
    }
    
    if (isset($input['jam_keluar'])) {
        $update_fields[] = "jam_keluar = ?";
        $params[] = $input['jam_keluar'];
    }
    
    if (isset($input['jam_masuk'])) {
        $update_fields[] = "jam_masuk = ?";
        $params[] = $input['jam_masuk'];
    }
    
    if (isset($input['tujuan']) || isset($input['alamat_tujuan'])) {
        $update_fields[] = "tujuan = ?";
        $params[] = $tujuan;
    }
    
    if (isset($input['keperluan']) || isset($input['alasan'])) {
        $update_fields[] = "keperluan = ?";
        $params[] = $keperluan;
    }
    
    if (isset($input['penanggung_jawab'])) {
        $update_fields[] = "penanggung_jawab = ?";
        $params[] = $input['penanggung_jawab'];
    }
    
    if (isset($input['telepon_penanggung_jawab']) || isset($input['nomor_hp_wali'])) {
        $update_fields[] = "telepon_penanggung_jawab = ?";
        $params[] = $telepon_penanggung_jawab;
    }
    
    if (isset($input['status'])) {
        $update_fields[] = "status = ?";
        $params[] = $status;
    }
    
    if (isset($input['catatan_persetujuan'])) {
        $update_fields[] = "catatan_persetujuan = ?";
        $params[] = $input['catatan_persetujuan'];
    }
    
    if (isset($input['disetujui_oleh'])) {
        $update_fields[] = "disetujui_oleh = ?";
        $params[] = $input['disetujui_oleh'];
    }
    
    // Always update updated_at
    $update_fields[] = "updated_at = NOW()";
    
    if (empty($update_fields)) {
        throw new Exception('Tidak ada field yang diupdate');
    }
    
    $update_fields_str = implode(', ', $update_fields);
    $params[] = $input['id']; // Add ID for WHERE clause
    
    $stmt = $pdo->prepare("
        UPDATE surat_izin_keluar 
        SET $update_fields_str
        WHERE id = ?
    ");
    
    $stmt->execute($params);
    
    echo json_encode(['success' => true, 'message' => 'Surat izin berhasil diupdate']);
}

function deleteSuratIzin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    
    if (!$id) {
        throw new Exception('ID surat izin harus diisi');
    }
    
    $stmt = $pdo->prepare("DELETE FROM surat_izin_keluar WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'message' => 'Surat izin berhasil dihapus']);
}
?>
