<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config/database.php';

try {
    $asrama_id = $_GET['id'] ?? null;
    
    if ($asrama_id) {
        // Get detail asrama dengan penghuni
        $stmt = $pdo->prepare("
            SELECT 
                a.id,
                a.nama_asrama,
                a.kode_asrama,
                a.kapasitas,
                a.lokasi,
                a.jenis,
                a.penanggung_jawab,
                a.fasilitas,
                a.status,
                a.created_at,
                a.updated_at
            FROM asrama a
            WHERE a.id = ?
        ");
        $stmt->execute([$asrama_id]);
        $asrama = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$asrama) {
            throw new Exception('Asrama tidak ditemukan');
        }
        
        // Get penghuni asrama
        $stmt = $pdo->prepare("
            SELECT 
                sa.id as santri_asrama_id,
                sa.tanggal_masuk,
                sa.status,
                s.id as santri_id,
                s.nama as nama_santri,
                s.nis as nomor_identitas,
                s.jenis_kelamin,
                k.nama_kelas
            FROM santri_asrama sa
            LEFT JOIN santri s ON sa.santri_id = s.id
            LEFT JOIN kelas k ON s.kelas_id = k.id
            WHERE sa.asrama_id = ? AND sa.status = 'aktif'
            ORDER BY s.nama
        ");
        $stmt->execute([$asrama_id]);
        $penghuni = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format data penghuni
        foreach ($penghuni as &$p) {
            if ($p['tanggal_masuk']) {
                $p['tanggal_masuk'] = date('d/m/Y', strtotime($p['tanggal_masuk']));
            }
        }
        
        $asrama['penghuni'] = $penghuni;
        $asrama['jumlah_penghuni'] = count($penghuni);
        $asrama['sisa_kapasitas'] = $asrama['kapasitas'] - count($penghuni);
        
        echo json_encode([
            'success' => true,
            'data' => $asrama
        ]);
        
    } else {
        // Get all asrama dengan ringkasan
        $stmt = $pdo->prepare("
            SELECT 
                a.id,
                a.nama_asrama,
                a.kode_asrama,
                a.kapasitas,
                a.lokasi,
                a.jenis,
                a.penanggung_jawab,
                a.fasilitas,
                a.status,
                a.created_at,
                a.updated_at,
                COUNT(sa.id) as jumlah_penghuni
            FROM asrama a
            LEFT JOIN santri_asrama sa ON a.id = sa.asrama_id AND sa.status = 'aktif'
            GROUP BY a.id, a.nama_asrama, a.kode_asrama, a.kapasitas, a.lokasi, a.jenis, a.penanggung_jawab, a.fasilitas, a.status, a.created_at, a.updated_at
            ORDER BY a.nama_asrama
        ");
        $stmt->execute();
        $asrama_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format data untuk frontend
        foreach ($asrama_list as &$asrama) {
            $asrama['sisa_kapasitas'] = $asrama['kapasitas'] - $asrama['jumlah_penghuni'];
            $asrama['status_kapasitas'] = $asrama['sisa_kapasitas'] > 0 ? 'Tersedia' : 'Penuh';
            $asrama['okupansi_persen'] = $asrama['kapasitas'] > 0 ? round(($asrama['jumlah_penghuni'] / $asrama['kapasitas']) * 100, 1) : 0;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $asrama_list,
            'total' => count($asrama_list)
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
