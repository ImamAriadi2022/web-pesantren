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
                a.*,
                u.nama as penanggung_jawab_nama,
                u.telepon as penanggung_jawab_telepon
            FROM asrama a
            LEFT JOIN ustadz u ON a.penanggung_jawab_id = u.id
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
                sa.nomor_kamar,
                sa.tanggal_masuk,
                sa.status,
                s.id as santri_id,
                s.nama,
                s.nis,
                s.jenis_kelamin,
                k.nama_kelas,
                us.email as santri_email
            FROM santri_asrama sa
            LEFT JOIN santri s ON sa.santri_id = s.id
            LEFT JOIN users us ON s.user_id = us.id
            LEFT JOIN kelas k ON s.id = k.id
            WHERE sa.asrama_id = ? AND sa.status = 'Aktif'
            ORDER BY sa.nomor_kamar, s.nama
        ");
        $stmt->execute([$asrama_id]);
        $penghuni = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format data penghuni
        foreach ($penghuni as &$p) {
            $p['tanggal_masuk'] = date('d/m/Y', strtotime($p['tanggal_masuk']));
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
                a.*,
                u.nama as penanggung_jawab_nama,
                u.telepon as penanggung_jawab_telepon,
                COUNT(sa.id) as jumlah_penghuni,
                (a.kapasitas - COUNT(sa.id)) as sisa_kapasitas,
                ROUND((COUNT(sa.id) / a.kapasitas) * 100, 1) as okupansi_persen
            FROM asrama a
            LEFT JOIN ustadz u ON a.penanggung_jawab_id = u.id
            LEFT JOIN santri_asrama sa ON a.id = sa.asrama_id AND sa.status = 'Aktif'
            WHERE a.status = 'Aktif'
            GROUP BY a.id
            ORDER BY a.nama_asrama
        ");
        $stmt->execute();
        $asrama_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format data untuk frontend
        foreach ($asrama_list as &$asrama) {
            $asrama['status_kapasitas'] = $asrama['sisa_kapasitas'] > 0 ? 'Tersedia' : 'Penuh';
            $asrama['penanggung_jawab_nama'] = $asrama['penanggung_jawab_nama'] ?? 'Belum Ditentukan';
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
