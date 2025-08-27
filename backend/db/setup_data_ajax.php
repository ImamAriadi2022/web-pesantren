<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

require_once '../config/database.php';

try {
    if ($input['action'] === 'setup') {
        setupData($pdo, $input);
    } elseif ($input['action'] === 'reset') {
        resetData($pdo);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

function setupData($pdo, $input) {
    $admin_username = $input['admin_username'] ?? 'admin';
    $admin_password = $input['admin_password'] ?? 'admin123';
    $admin_name = $input['admin_name'] ?? 'Administrator Pesantren';
    
    // Validasi input
    if (strlen($admin_username) < 3) {
        echo json_encode(['success' => false, 'message' => 'Username minimal 3 karakter']);
        return;
    }
    
    if (strlen($admin_password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password minimal 6 karakter']);
        return;
    }
    
    // Cek apakah sudah ada data
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $userCount = $stmt->fetchColumn();
    
    if ($userCount > 0) {
        echo json_encode(['success' => false, 'message' => 'Database sudah berisi data. Gunakan Reset terlebih dahulu jika ingin setup ulang.']);
        return;
    }
    
    $pdo->beginTransaction();
    
    try {
        // Insert default pengaturan
        $pengaturan_data = [
            ['nama_pesantren', 'Pesantren Al-Hikmah', 'Nama pesantren'],
            ['alamat_pesantren', 'Jl. Raya Pesantren No. 123', 'Alamat pesantren'],
            ['telepon_pesantren', '021-12345678', 'Nomor telepon pesantren'],
            ['email_pesantren', 'info@alhikmah.ac.id', 'Email pesantren'],
            ['website_pesantren', 'https://www.alhikmah.ac.id', 'Website pesantren'],
            ['logo_pesantren', 'logo.png', 'Logo pesantren'],
            ['kepala_pesantren', 'KH. Ahmad Dahlan', 'Nama kepala pesantren'],
            ['tahun_ajaran_aktif', '2024/2025', 'Tahun ajaran yang sedang aktif'],
            ['semester_aktif', 'Ganjil', 'Semester yang sedang aktif']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO pengaturan (nama_setting, nilai_setting, deskripsi) VALUES (?, ?, ?)");
        foreach ($pengaturan_data as $data) {
            $stmt->execute($data);
        }
        
        // Insert admin user dengan kredensial custom
        $password_hash = password_hash($admin_password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$admin_username, $password_hash, $admin_name, 'Admin']);
        
        // Insert sample kelas
        $kelas_data = [
            ['Kelas 1A', 'K1A', 25],
            ['Kelas 1B', 'K1B', 25],
            ['Kelas 2A', 'K2A', 25],
            ['Kelas 2B', 'K2B', 25],
            ['Kelas 3A', 'K3A', 25],
            ['Kelas 3B', 'K3B', 25]
        ];
        
        $stmt = $pdo->prepare("INSERT INTO kelas (nama_kelas, kode_kelas, kapasitas) VALUES (?, ?, ?)");
        foreach ($kelas_data as $data) {
            $stmt->execute($data);
        }
        
        // Insert sample mata pelajaran
        $mapel_data = [
            ['AQ001', 'Al-Quran dan Hadits', 'Pembelajaran Al-Quran dan Hadits'],
            ['AK002', 'Akidah Akhlak', 'Pembelajaran Akidah dan Akhlak'],
            ['FQ003', 'Fiqh', 'Pembelajaran Fiqh'],
            ['SKI004', 'Sejarah Kebudayaan Islam', 'Pembelajaran Sejarah Kebudayaan Islam'],
            ['BA005', 'Bahasa Arab', 'Pembelajaran Bahasa Arab'],
            ['BI006', 'Bahasa Indonesia', 'Pembelajaran Bahasa Indonesia'],
            ['MAT007', 'Matematika', 'Pembelajaran Matematika'],
            ['IPA008', 'Ilmu Pengetahuan Alam', 'Pembelajaran IPA'],
            ['IPS009', 'Ilmu Pengetahuan Sosial', 'Pembelajaran IPS'],
            ['PKN010', 'Pendidikan Kewarganegaraan', 'Pembelajaran PKN']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, keterangan) VALUES (?, ?, ?)");
        foreach ($mapel_data as $data) {
            $stmt->execute($data);
        }
        
        // Insert sample ustadz
        $ustadz_data = [
            ['UST001', 'Ustadz Ahmad Dahlan', 'Jakarta', '1980-05-15', 'Laki-laki', 'Jl. Masjid No. 1', '081234567001', 'S1 Pendidikan Agama Islam', 'Al-Quran dan Hadits, Fiqh'],
            ['UST002', 'Ustadz Muhammad Abduh', 'Bandung', '1975-08-20', 'Laki-laki', 'Jl. Pondok No. 2', '081234567002', 'S2 Tafsir Hadits', 'Al-Quran dan Hadits, Akidah Akhlak'],
            ['UST003', 'Ustadzah Fatimah Az-Zahra', 'Surabaya', '1985-03-10', 'Perempuan', 'Jl. Santri No. 3', '081234567003', 'S1 Bahasa Arab', 'Bahasa Arab'],
            ['UST004', 'Ustadz Ali ibn Abi Thalib', 'Yogyakarta', '1978-12-05', 'Laki-laki', 'Jl. Pesantren No. 4', '081234567004', 'S1 Pendidikan Matematika', 'Matematika, IPA'],
            ['UST005', 'Ustadzah Aisyah binti Abu Bakar', 'Semarang', '1982-07-25', 'Perempuan', 'Jl. Madrasah No. 5', '081234567005', 'S1 Pendidikan Bahasa Indonesia', 'Bahasa Indonesia, PKN']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO ustadz (nip, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_hp, pendidikan_terakhir, mata_pelajaran) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($ustadz_data as $data) {
            $stmt->execute($data);
        }
        
        // Insert sample santri
        $santri_data = [
            ['2024001', 'Muhammad Rizki Pratama', 1, 'Jakarta', '2010-01-15', 'Laki-laki', 'Jl. Kemerdekaan No. 123', '081234567101', 'Budi Santoso', '081234567201'],
            ['2024002', 'Fatimah Azzahra', 1, 'Bogor', '2010-03-20', 'Perempuan', 'Jl. Merdeka No. 456', '081234567102', 'Ahmad Rahman', '081234567202'],
            ['2024003', 'Abdullah Al-Mahdi', 2, 'Depok', '2010-05-10', 'Laki-laki', 'Jl. Pancasila No. 789', '081234567103', 'Hasan Basri', '081234567203'],
            ['2024004', 'Khadijah binti Khuwailid', 2, 'Tangerang', '2010-07-25', 'Perempuan', 'Jl. Proklamasi No. 321', '081234567104', 'Omar Bakri', '081234567204'],
            ['2024005', 'Ali Zainal Abidin', 3, 'Bekasi', '2009-02-14', 'Laki-laki', 'Jl. Pahlawan No. 654', '081234567105', 'Yusuf Ibrahim', '081234567205']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO santri (nis, nama, kelas_id, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_hp, nama_wali, no_hp_wali) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($santri_data as $data) {
            $stmt->execute($data);
        }
        
        // Insert sample jadwal pelajaran
        $jadwal_data = [
            [1, 1, 'Senin', '07:00:00', '08:30:00', 'Ruang A1'],
            [2, 2, 'Senin', '08:30:00', '10:00:00', 'Ruang A2'],
            [5, 3, 'Selasa', '07:00:00', '08:30:00', 'Ruang B1'],
            [7, 4, 'Selasa', '08:30:00', '10:00:00', 'Ruang B2'],
            [6, 5, 'Rabu', '07:00:00', '08:30:00', 'Ruang C1'],
            [3, 1, 'Rabu', '08:30:00', '10:00:00', 'Ruang C2'],
            [8, 4, 'Kamis', '07:00:00', '08:30:00', 'Ruang D1'],
            [10, 5, 'Kamis', '08:30:00', '10:00:00', 'Ruang D2'],
            [4, 2, 'Jumat', '07:00:00', '08:30:00', 'Ruang E1'],
            [9, 5, 'Jumat', '08:30:00', '10:00:00', 'Ruang E2']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO jadwal_pelajaran (mapel_id, ustadz_id, hari, jam_mulai, jam_selesai, ruangan) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($jadwal_data as $data) {
            $stmt->execute($data);
        }
        
        // Insert sample nilai
        $nilai_data = [
            [1, 1, 'UTS', 85.50, 'Ganjil', 1],
            [1, 2, 'UTS', 78.75, 'Ganjil', 1],
            [2, 1, 'UTS', 92.00, 'Ganjil', 1],
            [2, 5, 'UTS', 88.25, 'Ganjil', 1],
            [3, 7, 'UTS', 76.50, 'Ganjil', 1],
            [4, 6, 'UTS', 90.75, 'Ganjil', 1],
            [5, 8, 'UTS', 82.00, 'Ganjil', 1]
        ];
        
        $stmt = $pdo->prepare("INSERT INTO nilai (santri_id, mapel_id, jenis_nilai, nilai, semester, dibuat_oleh) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($nilai_data as $data) {
            $stmt->execute($data);
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Setup data dummy berhasil diselesaikan!',
            'credentials' => [
                'username' => $admin_username,
                'password' => $admin_password,
                'name' => $admin_name
            ]
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function resetData($pdo) {
    $pdo->beginTransaction();
    
    try {
        // Hapus data dari semua tabel (urutan penting karena foreign key)
        $tables = [
            'notifikasi_nilai',
            'nilai',
            'surat_izin_keluar',
            'jadwal_pelajaran',
            'santri',
            'ustadz',
            'mata_pelajaran',
            'kelas',
            'users',
            'pengaturan'
        ];
        
        foreach ($tables as $table) {
            $pdo->exec("DELETE FROM $table");
            // Reset auto increment
            $pdo->exec("ALTER TABLE $table AUTO_INCREMENT = 1");
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Database berhasil direset. Semua data telah dihapus.'
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}
?>
