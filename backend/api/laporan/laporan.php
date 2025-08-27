<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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
            generateLaporan($pdo);
            break;
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function generateLaporan($pdo) {
    $jenis_laporan = $_GET['jenis'] ?? null;
    $start_date = $_GET['start_date'] ?? null;
    $end_date = $_GET['end_date'] ?? null;
    
    if (!$jenis_laporan) {
        throw new Exception('Jenis laporan harus dipilih');
    }
    
    switch ($jenis_laporan) {
        case 'santri':
            $result = laporanSantri($pdo, $start_date, $end_date);
            break;
        case 'asrama':
            $result = laporanAsrama($pdo, $start_date, $end_date);
            break;
        case 'surat_izin':
            $result = laporanSuratIzin($pdo, $start_date, $end_date);
            break;
        default:
            throw new Exception('Jenis laporan tidak valid');
    }
    
    // Pastikan format konsisten: data dan statistik di level atas
    $data = $result['detail'] ?? $result['data'] ?? [];
    $statistik = $result['summary'] ?? $result['statistik'] ?? [];
    
    // Tambahkan statistik umum dari semua tabel
    $general_stats = getGeneralStatistics($pdo);
    $statistik = array_merge($statistik, $general_stats);
    
    echo json_encode([
        'success' => true,
        'jenis_laporan' => $jenis_laporan,
        'data' => $data,
        'summary' => $statistik,
        'statistik' => $statistik,
        'generated_at' => date('d/m/Y H:i:s')
    ]);
}

function getGeneralStatistics($pdo) {
    $stats = [];
    
    try {
        // Total santri
        $stmt = $pdo->query("SELECT COUNT(*) as total_santri FROM santri");
        $stats['total_santri'] = $stmt->fetchColumn();
        
        // Total kelas  
        $stmt = $pdo->query("SELECT COUNT(*) as total_kelas FROM kelas");
        $stats['total_kelas'] = $stmt->fetchColumn();
        
        // Total asrama (bisa tidak ada tabel)
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as total_asrama FROM asrama");
            $stats['total_asrama'] = $stmt->fetchColumn();
        } catch (Exception $e) {
            $stats['total_asrama'] = 0;
        }
        
        // Total ustadz
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as total_ustadz FROM ustadz");
            $stats['total_ustadz'] = $stmt->fetchColumn();
        } catch (Exception $e) {
            $stats['total_ustadz'] = 0;
        }
        
        // Total surat izin
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as total_surat_izin FROM surat_izin_keluar");
            $stats['total_surat_izin'] = $stmt->fetchColumn();
        } catch (Exception $e) {
            $stats['total_surat_izin'] = 0;
        }
        
    } catch (Exception $e) {
        // Jika ada error, return default values
        $stats = [
            'total_santri' => 0,
            'total_kelas' => 0,
            'total_asrama' => 0,
            'total_ustadz' => 0,
            'total_surat_izin' => 0
        ];
    }
    
    return $stats;
}

function laporanNilai($pdo, $start_date, $end_date, $kelas_id, $mapel_id, $santri_id) {
    $where_conditions = ['1=1'];
    $params = [];
    
    if ($start_date) {
        $where_conditions[] = "n.created_at >= ?";
        $params[] = $start_date;
    }
    
    if ($end_date) {
        $where_conditions[] = "n.created_at <= ?";
        $params[] = $end_date . ' 23:59:59';
    }
    
    if ($kelas_id) {
        $where_conditions[] = "EXISTS (SELECT 1 FROM santri_kelas sk WHERE sk.santri_id = s.id AND sk.kelas_id = ?)";
        $params[] = $kelas_id;
    }
    
    if ($mapel_id) {
        $where_conditions[] = "n.mapel_id = ?";
        $params[] = $mapel_id;
    }
    
    if ($santri_id) {
        $where_conditions[] = "n.santri_id = ?";
        $params[] = $santri_id;
    }
    
    $where_clause = implode(' AND ', $where_conditions);
    
    $stmt = $pdo->prepare("
        SELECT 
            n.*,
            s.nama as nama_santri,
            s.nis,
            mp.nama_mapel,
            mp.kkm,
            k.nama_kelas,
            CASE WHEN n.nilai >= mp.kkm THEN 'Tuntas' ELSE 'Belum Tuntas' END as status_kkm,
            u.email as dinilai_oleh
        FROM nilai n
        LEFT JOIN santri s ON n.santri_id = s.id
        LEFT JOIN mata_pelajaran mp ON n.mapel_id = mp.id
        LEFT JOIN santri_kelas sk ON s.id = sk.santri_id AND sk.status = 'Aktif'
        LEFT JOIN kelas k ON sk.kelas_id = k.id
        LEFT JOIN users u ON n.dibuat_oleh = u.id
        WHERE $where_clause
        ORDER BY s.nama, mp.nama_mapel, n.created_at DESC
    ");
    $stmt->execute($params);
    $nilai_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data
    foreach ($nilai_data as &$nilai) {
        $nilai['created_at'] = date('d/m/Y H:i', strtotime($nilai['created_at']));
        $nilai['nilai_formatted'] = number_format($nilai['nilai'], 1);
    }
    
    return [
        'detail' => $nilai_data,
        'summary' => [
            'total_nilai' => count($nilai_data),
            'rata_rata' => count($nilai_data) > 0 ? round(array_sum(array_column($nilai_data, 'nilai')) / count($nilai_data), 2) : 0,
            'tuntas' => count(array_filter($nilai_data, function($n) { return $n['status_kkm'] === 'Tuntas'; })),
            'belum_tuntas' => count(array_filter($nilai_data, function($n) { return $n['status_kkm'] === 'Belum Tuntas'; }))
        ]
    ];
}

function laporanAbsensi($pdo, $start_date, $end_date, $kelas_id, $santri_id) {
    $where_conditions = ['1=1'];
    $params = [];
    
    if ($start_date) {
        $where_conditions[] = "a.tanggal >= ?";
        $params[] = $start_date;
    }
    
    if ($end_date) {
        $where_conditions[] = "a.tanggal <= ?";
        $params[] = $end_date;
    }
    
    if ($kelas_id) {
        $where_conditions[] = "EXISTS (SELECT 1 FROM santri_kelas sk WHERE sk.santri_id = s.id AND sk.kelas_id = ?)";
        $params[] = $kelas_id;
    }
    
    if ($santri_id) {
        $where_conditions[] = "a.santri_id = ?";
        $params[] = $santri_id;
    }
    
    $where_clause = implode(' AND ', $where_conditions);
    
    $stmt = $pdo->prepare("
        SELECT 
            a.*,
            s.nama as nama_santri,
            s.nis,
            k.nama_kelas
        FROM absensi a
        LEFT JOIN santri s ON a.santri_id = s.id
        LEFT JOIN santri_kelas sk ON s.id = sk.santri_id AND sk.status = 'Aktif'
        LEFT JOIN kelas k ON sk.kelas_id = k.id
        WHERE $where_clause
        ORDER BY a.tanggal DESC, s.nama
    ");
    $stmt->execute($params);
    $absensi_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data
    foreach ($absensi_data as &$absensi) {
        $absensi['tanggal'] = date('d/m/Y', strtotime($absensi['tanggal']));
    }
    
    // Summary statistik
    $total_absensi = count($absensi_data);
    $hadir = count(array_filter($absensi_data, function($a) { return $a['status'] === 'Hadir'; }));
    $izin = count(array_filter($absensi_data, function($a) { return $a['status'] === 'Izin'; }));
    $sakit = count(array_filter($absensi_data, function($a) { return $a['status'] === 'Sakit'; }));
    $alpha = count(array_filter($absensi_data, function($a) { return $a['status'] === 'Alpha'; }));
    
    return [
        'detail' => $absensi_data,
        'summary' => [
            'total_absensi' => $total_absensi,
            'hadir' => $hadir,
            'izin' => $izin,
            'sakit' => $sakit,
            'alpha' => $alpha,
            'persentase_kehadiran' => $total_absensi > 0 ? round(($hadir / $total_absensi) * 100, 2) : 0
        ]
    ];
}

function laporanKeuangan($pdo, $start_date, $end_date, $santri_id) {
    try {
        $where_conditions = ['1=1'];
        $params = [];
        
        if ($start_date) {
            $where_conditions[] = "k.tanggal_transaksi >= ?";
            $params[] = $start_date;
        }
        
        if ($end_date) {
            $where_conditions[] = "k.tanggal_transaksi <= ?";
            $params[] = $end_date;
        }
        
        if ($santri_id) {
            $where_conditions[] = "k.santri_id = ?";
            $params[] = $santri_id;
        }
        
        $where_clause = implode(' AND ', $where_conditions);
        
        $stmt = $pdo->prepare("
            SELECT 
                k.*,
                COALESCE(s.nama, 'Tidak Diketahui') as nama_santri,
                COALESCE(s.nis, '-') as nis,
                COALESCE(u.email, '-') as diproses_oleh_email
            FROM keuangan k
            LEFT JOIN santri s ON k.santri_id = s.id
            LEFT JOIN users u ON k.diproses_oleh = u.id
            WHERE $where_clause
            ORDER BY k.tanggal_transaksi DESC
        ");
    } catch (Exception $e) {
        // If keuangan table doesn't exist, return empty data
        return [
            'detail' => [],
            'summary' => [
                'total_transaksi' => 0,
                'total_pemasukan' => 0,
                'total_pengeluaran' => 0,
                'saldo' => 0,
                'pemasukan_formatted' => 'Rp 0',
                'pengeluaran_formatted' => 'Rp 0',
                'saldo_formatted' => 'Rp 0'
            ]
        ];
    }
    $stmt->execute($params);
    $keuangan_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data
    foreach ($keuangan_data as &$transaksi) {
        $transaksi['tanggal_transaksi'] = date('d/m/Y', strtotime($transaksi['tanggal_transaksi']));
        $transaksi['jumlah_formatted'] = 'Rp ' . number_format($transaksi['jumlah'], 0, ',', '.');
    }
    
    // Summary
    $pemasukan = array_sum(array_column(array_filter($keuangan_data, function($k) { 
        return $k['jenis_transaksi'] === 'Pemasukan'; 
    }), 'jumlah'));
    
    $pengeluaran = array_sum(array_column(array_filter($keuangan_data, function($k) { 
        return $k['jenis_transaksi'] === 'Pengeluaran'; 
    }), 'jumlah'));
    
    return [
        'detail' => $keuangan_data,
        'summary' => [
            'total_transaksi' => count($keuangan_data),
            'total_pemasukan' => $pemasukan,
            'total_pengeluaran' => $pengeluaran,
            'saldo' => $pemasukan - $pengeluaran,
            'pemasukan_formatted' => 'Rp ' . number_format($pemasukan, 0, ',', '.'),
            'pengeluaran_formatted' => 'Rp ' . number_format($pengeluaran, 0, ',', '.'),
            'saldo_formatted' => 'Rp ' . number_format($pemasukan - $pengeluaran, 0, ',', '.')
        ]
    ];
}

function laporanTahfidz($pdo, $start_date, $end_date, $santri_id) {
    $where_conditions = ['1=1'];
    $params = [];
    
    if ($start_date) {
        $where_conditions[] = "t.tanggal_mulai >= ?";
        $params[] = $start_date;
    }
    
    if ($end_date) {
        $where_conditions[] = "t.tanggal_mulai <= ?";
        $params[] = $end_date;
    }
    
    if ($santri_id) {
        $where_conditions[] = "t.santri_id = ?";
        $params[] = $santri_id;
    }
    
    $where_clause = implode(' AND ', $where_conditions);
    
    $stmt = $pdo->prepare("
        SELECT 
            t.*,
            s.nama as nama_santri,
            s.nis,
            u.nama as pembimbing_nama
        FROM tahfidz t
        LEFT JOIN santri s ON t.santri_id = s.id
        LEFT JOIN ustadz u ON t.pembimbing_id = u.id
        WHERE $where_clause
        ORDER BY s.nama, t.tanggal_mulai DESC
    ");
    $stmt->execute($params);
    $tahfidz_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data
    foreach ($tahfidz_data as &$tahfidz) {
        $tahfidz['tanggal_mulai'] = date('d/m/Y', strtotime($tahfidz['tanggal_mulai']));
        $tahfidz['tanggal_selesai'] = $tahfidz['tanggal_selesai'] ? date('d/m/Y', strtotime($tahfidz['tanggal_selesai'])) : '-';
        $tahfidz['target_selesai'] = date('d/m/Y', strtotime($tahfidz['target_selesai']));
    }
    
    // Summary
    $selesai = count(array_filter($tahfidz_data, function($t) { return $t['status'] === 'Selesai'; }));
    $sedang_hafalan = count(array_filter($tahfidz_data, function($t) { return $t['status'] === 'Sedang Hafalan'; }));
    
    return [
        'detail' => $tahfidz_data,
        'summary' => [
            'total_hafalan' => count($tahfidz_data),
            'selesai' => $selesai,
            'sedang_hafalan' => $sedang_hafalan,
            'persentase_selesai' => count($tahfidz_data) > 0 ? round(($selesai / count($tahfidz_data)) * 100, 2) : 0
        ]
    ];
}

function laporanDataSantri($pdo, $kelas_id) {
    $where_conditions = ['1=1']; // Remove status filter as it might not exist
    $params = [];
    
    if ($kelas_id) {
        $where_conditions[] = "sk.kelas_id = ?";
        $params[] = $kelas_id;
    }
    
    $where_clause = implode(' AND ', $where_conditions);
    
    $stmt = $pdo->prepare("
        SELECT 
            s.*,
            COALESCE(k.nama_kelas, 'Belum Ada Kelas') as nama_kelas,
            COALESCE(a.nama_asrama, 'Belum Ada Asrama') as nama_asrama,
            COALESCE(sa.nomor_kamar, '-') as nomor_kamar,
            COALESCE(u.email, '-') as email,
            s.nis as nomor_identitas
        FROM santri s
        LEFT JOIN santri_kelas sk ON s.id = sk.santri_id
        LEFT JOIN kelas k ON sk.kelas_id = k.id
        LEFT JOIN santri_asrama sa ON s.id = sa.santri_id
        LEFT JOIN asrama a ON sa.asrama_id = a.id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE $where_clause
        ORDER BY s.nama
    ");
    $stmt->execute($params);
    $santri_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data
    foreach ($santri_data as &$santri) {
        $santri['tanggal_lahir'] = $santri['tanggal_lahir'] ? date('d/m/Y', strtotime($santri['tanggal_lahir'])) : '-';
        $santri['tanggal_masuk'] = $santri['tanggal_masuk'] ? date('d/m/Y', strtotime($santri['tanggal_masuk'])) : '-';
        $santri['status'] = 'Aktif'; // Default status for reports
    }
    
    return [
        'detail' => $santri_data,
        'summary' => [
            'total_santri' => count($santri_data),
            'laki_laki' => count(array_filter($santri_data, function($s) { return $s['jenis_kelamin'] === 'Laki-laki'; })),
            'perempuan' => count(array_filter($santri_data, function($s) { return $s['jenis_kelamin'] === 'Perempuan'; }))
        ]
    ];
}

function laporanSantri($pdo, $start_date = null, $end_date = null) {
    $sql = "SELECT s.*, k.nama_kelas, 
            CASE WHEN s.jenis_kelamin = 'L' THEN 'Laki-laki' 
                 WHEN s.jenis_kelamin = 'P' THEN 'Perempuan' 
                 ELSE s.jenis_kelamin END as jenis_kelamin
            FROM santri s 
            LEFT JOIN kelas k ON s.kelas_id = k.id 
            WHERE 1=1";
    
    $params = [];
    if ($start_date) {
        $sql .= " AND DATE(s.created_at) >= ?";
        $params[] = $start_date;
    }
    if ($end_date) {
        $sql .= " AND DATE(s.created_at) <= ?";
        $params[] = $end_date;
    }
    
    $sql .= " ORDER BY s.nama ASC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $santri_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Statistik
    $stmt_stat = $pdo->prepare("SELECT 
        COUNT(*) as total_santri,
        COUNT(CASE WHEN jenis_kelamin IN ('L', 'Laki-laki') THEN 1 END) as laki_laki,
        COUNT(CASE WHEN jenis_kelamin IN ('P', 'Perempuan') THEN 1 END) as perempuan,
        COUNT(CASE WHEN status = 'aktif' THEN 1 END) as aktif,
        COUNT(CASE WHEN status = 'tidak_aktif' THEN 1 END) as tidak_aktif
        FROM santri");
    $stmt_stat->execute();
    $statistik = $stmt_stat->fetch(PDO::FETCH_ASSOC);
    
    return [
        'detail' => $santri_data,
        'summary' => $statistik
    ];
}

function laporanSuratIzin($pdo, $start_date = null, $end_date = null) {
    $sql = "SELECT sik.*, s.nama as nama_santri, s.nis, k.nama_kelas
           FROM surat_izin_keluar sik 
           LEFT JOIN santri s ON sik.santri_id = s.id 
           LEFT JOIN kelas k ON s.kelas_id = k.id
           WHERE 1=1";
    
    $params = [];
    if ($start_date) {
        $sql .= " AND DATE(sik.tanggal_keluar) >= ?";
        $params[] = $start_date;
    }
    if ($end_date) {
        $sql .= " AND DATE(sik.tanggal_keluar) <= ?";
        $params[] = $end_date;
    }
    
    $sql .= " ORDER BY sik.tanggal_keluar DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $surat_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Statistik
    $stmt_stat = $pdo->prepare("SELECT 
        COUNT(*) as total_surat_izin,
        COUNT(CASE WHEN status = 'Belum Kembali' THEN 1 END) as belum_kembali,
        COUNT(CASE WHEN status = 'Sudah di Pesantren' THEN 1 END) as sudah_kembali
        FROM surat_izin_keluar");
    $stmt_stat->execute();
    $statistik = $stmt_stat->fetch(PDO::FETCH_ASSOC);
    
    return [
        'detail' => $surat_data,
        'summary' => $statistik
    ];
}

function laporanAsrama($pdo, $start_date = null, $end_date = null) {
    try {
        $sql = "SELECT 
                a.*,
                a.penanggung_jawab as penanggung_jawab_nama,
                COUNT(sa.id) as jumlah_penghuni,
                (COALESCE(a.kapasitas, 0) - COUNT(sa.id)) as sisa_kapasitas
            FROM asrama a
            LEFT JOIN santri_asrama sa ON a.id = sa.asrama_id AND sa.status = 'aktif'
            WHERE 1=1";
        
        $params = [];
        if ($start_date) {
            $sql .= " AND DATE(a.created_at) >= ?";
            $params[] = $start_date;
        }
        if ($end_date) {
            $sql .= " AND DATE(a.created_at) <= ?";
            $params[] = $end_date;
        }
        
        $sql .= " GROUP BY a.id ORDER BY a.nama_asrama";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $asrama_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Total summary
        $total_kapasitas = array_sum(array_column($asrama_data, 'kapasitas'));
        $total_penghuni = array_sum(array_column($asrama_data, 'jumlah_penghuni'));
        
        return [
            'detail' => $asrama_data,
            'summary' => [
                'total_asrama' => count($asrama_data),
                'total_kapasitas' => $total_kapasitas,
                'total_penghuni' => $total_penghuni,
                'total_sisa_kapasitas' => $total_kapasitas - $total_penghuni,
                'okupansi_persen' => $total_kapasitas > 0 ? round(($total_penghuni / $total_kapasitas) * 100, 2) : 0
            ]
        ];
    } catch (Exception $e) {
        // If asrama table doesn't exist, return empty data
        return [
            'detail' => [],
            'summary' => [
                'total_asrama' => 0,
                'total_kapasitas' => 0,
                'total_penghuni' => 0,
                'total_sisa_kapasitas' => 0,
                'okupansi_persen' => 0
            ]
        ];
    }
}
?>
