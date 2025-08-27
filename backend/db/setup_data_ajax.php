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
            ['Kelas 1A', 'K1A', 30],
            ['Kelas 1B', 'K1B', 30],
            ['Kelas 2A', 'K2A', 30],
            ['Kelas 2B', 'K2B', 30],
            ['Kelas 3A', 'K3A', 30],
            ['Kelas 3B', 'K3B', 30],
            ['Kelas 4A', 'K4A', 25],
            ['Kelas 5A', 'K5A', 25],
            ['Kelas 6A', 'K6A', 25]
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
            ['BE007', 'Bahasa Inggris', 'Pembelajaran Bahasa Inggris'],
            ['MAT008', 'Matematika', 'Pembelajaran Matematika'],
            ['IPA009', 'Ilmu Pengetahuan Alam', 'Pembelajaran IPA'],
            ['IPS010', 'Ilmu Pengetahuan Sosial', 'Pembelajaran IPS'],
            ['PKN011', 'Pendidikan Kewarganegaraan', 'Pembelajaran PKN'],
            ['THF012', 'Tahfidz Al-Quran', 'Hafalan Al-Quran'],
            ['SEN013', 'Seni dan Budaya', 'Pembelajaran Seni dan Budaya'],
            ['OLR014', 'Olahraga', 'Pendidikan Jasmani dan Olahraga']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, keterangan) VALUES (?, ?, ?)");
        foreach ($mapel_data as $data) {
            $stmt->execute($data);
        }
        
        // Insert users untuk ustadz dan santri
        $ustadz_users = [
            ['ust001', password_hash('ust001123', PASSWORD_DEFAULT), 'Ustadz Ahmad Dahlan', 'Ustadz'],
            ['ust002', password_hash('ust002123', PASSWORD_DEFAULT), 'Ustadz Muhammad Abduh', 'Ustadz'],
            ['ust003', password_hash('ust003123', PASSWORD_DEFAULT), 'Ustadzah Fatimah Az-Zahra', 'Ustadz'],
            ['ust004', password_hash('ust004123', PASSWORD_DEFAULT), 'Ustadz Ali ibn Abi Thalib', 'Ustadz'],
            ['ust005', password_hash('ust005123', PASSWORD_DEFAULT), 'Ustadzah Aisyah binti Abu Bakar', 'Ustadz'],
            ['ust006', password_hash('ust006123', PASSWORD_DEFAULT), 'Ustadz Umar ibn Khattab', 'Ustadz'],
            ['ust007', password_hash('ust007123', PASSWORD_DEFAULT), 'Ustadzah Khadijah binti Khuwailid', 'Ustadz']
        ];
        
        $santri_users = [
            ['sant001', password_hash('sant001123', PASSWORD_DEFAULT), 'Muhammad Rizki Pratama', 'Santri'],
            ['sant002', password_hash('sant002123', PASSWORD_DEFAULT), 'Fatimah Azzahra', 'Santri'],
            ['sant003', password_hash('sant003123', PASSWORD_DEFAULT), 'Abdullah Al-Mahdi', 'Santri'],
            ['sant004', password_hash('sant004123', PASSWORD_DEFAULT), 'Khadijah binti Khuwailid', 'Santri'],
            ['sant005', password_hash('sant005123', PASSWORD_DEFAULT), 'Ali Zainal Abidin', 'Santri'],
            ['sant006', password_hash('sant006123', PASSWORD_DEFAULT), 'Ahmad Fauzi Rahman', 'Santri'],
            ['sant007', password_hash('sant007123', PASSWORD_DEFAULT), 'Siti Nurhalimah', 'Santri'],
            ['sant008', password_hash('sant008123', PASSWORD_DEFAULT), 'Muhammad Ikhsan Hidayat', 'Santri'],
            ['sant009', password_hash('sant009123', PASSWORD_DEFAULT), 'Zainab binti Jahsh', 'Santri'],
            ['sant010', password_hash('sant010123', PASSWORD_DEFAULT), 'Hamzah ibn Abdul Muttalib', 'Santri'],
            ['sant011', password_hash('sant011123', PASSWORD_DEFAULT), 'Hafsah binti Umar', 'Santri'],
            ['sant012', password_hash('sant012123', PASSWORD_DEFAULT), 'Saad ibn Abi Waqqas', 'Santri'],
            ['sant013', password_hash('sant013123', PASSWORD_DEFAULT), 'Ummu Salamah', 'Santri'],
            ['sant014', password_hash('sant014123', PASSWORD_DEFAULT), 'Khalid ibn Walid', 'Santri'],
            ['sant015', password_hash('sant015123', PASSWORD_DEFAULT), 'Safiyyah binti Huyay', 'Santri']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)");
        foreach (array_merge($ustadz_users, $santri_users) as $user) {
            $stmt->execute($user);
        }
        
        // Insert sample ustadz data
        $ustadz_data = [
            ['UST001', 'Ustadz Ahmad Dahlan', 'Jakarta', '1980-05-15', 'Laki-laki', 'Jl. Masjid No. 1, Jakarta Pusat', '081234567001', 'S1 Pendidikan Agama Islam', 'Al-Quran dan Hadits, Fiqh'],
            ['UST002', 'Ustadz Muhammad Abduh', 'Bandung', '1975-08-20', 'Laki-laki', 'Jl. Pondok No. 2, Bandung', '081234567002', 'S2 Tafsir Hadits', 'Al-Quran dan Hadits, Akidah Akhlak'],
            ['UST003', 'Ustadzah Fatimah Az-Zahra', 'Surabaya', '1985-03-10', 'Perempuan', 'Jl. Santri No. 3, Surabaya', '081234567003', 'S1 Bahasa Arab', 'Bahasa Arab'],
            ['UST004', 'Ustadz Ali ibn Abi Thalib', 'Yogyakarta', '1978-12-05', 'Laki-laki', 'Jl. Pesantren No. 4, Yogyakarta', '081234567004', 'S1 Pendidikan Matematika', 'Matematika, IPA'],
            ['UST005', 'Ustadzah Aisyah binti Abu Bakar', 'Semarang', '1982-07-25', 'Perempuan', 'Jl. Madrasah No. 5, Semarang', '081234567005', 'S1 Pendidikan Bahasa Indonesia', 'Bahasa Indonesia, PKN'],
            ['UST006', 'Ustadz Umar ibn Khattab', 'Medan', '1977-11-30', 'Laki-laki', 'Jl. Dakwah No. 6, Medan', '081234567006', 'S1 Pendidikan Bahasa Inggris', 'Bahasa Inggris, Seni'],
            ['UST007', 'Ustadzah Khadijah binti Khuwailid', 'Palembang', '1983-09-18', 'Perempuan', 'Jl. Tahfidz No. 7, Palembang', '081234567007', 'S1 Pendidikan Al-Quran', 'Tahfidz Al-Quran, SKI']
        ];
        
        $ustadz_stmt = $pdo->prepare("INSERT INTO ustadz (nip, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_hp, pendidikan_terakhir, mata_pelajaran) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($ustadz_data as $data) {
            $ustadz_stmt->execute($data);
        }
        
        // Insert sample santri data
        $santri_data = [
            ['2024001', 'Muhammad Rizki Pratama', 1, 'Jakarta', '2010-01-15', 'Laki-laki', 'Jl. Kemerdekaan No. 123, Jakarta', '081234567101', 'Budi Santoso', '081234567201'],
            ['2024002', 'Fatimah Azzahra', 1, 'Bogor', '2010-03-20', 'Perempuan', 'Jl. Merdeka No. 456, Bogor', '081234567102', 'Ahmad Rahman', '081234567202'],
            ['2024003', 'Abdullah Al-Mahdi', 2, 'Depok', '2010-05-10', 'Laki-laki', 'Jl. Pancasila No. 789, Depok', '081234567103', 'Hasan Basri', '081234567203'],
            ['2024004', 'Khadijah binti Khuwailid', 2, 'Tangerang', '2010-07-25', 'Perempuan', 'Jl. Proklamasi No. 321, Tangerang', '081234567104', 'Omar Bakri', '081234567204'],
            ['2024005', 'Ali Zainal Abidin', 3, 'Bekasi', '2009-02-14', 'Laki-laki', 'Jl. Pahlawan No. 654, Bekasi', '081234567105', 'Yusuf Ibrahim', '081234567205'],
            ['2024006', 'Ahmad Fauzi Rahman', 3, 'Bandung', '2009-06-30', 'Laki-laki', 'Jl. Veteran No. 111, Bandung', '081234567106', 'Mahmud Fauzi', '081234567206'],
            ['2024007', 'Siti Nurhalimah', 4, 'Surabaya', '2009-08-12', 'Perempuan', 'Jl. Diponegoro No. 222, Surabaya', '081234567107', 'Slamet Riyadi', '081234567207'],
            ['2024008', 'Muhammad Ikhsan Hidayat', 4, 'Yogyakarta', '2009-10-05', 'Laki-laki', 'Jl. Gajah Mada No. 333, Yogyakarta', '081234567108', 'Hidayat Iman', '081234567208'],
            ['2024009', 'Zainab binti Jahsh', 5, 'Semarang', '2008-12-22', 'Perempuan', 'Jl. Sudirman No. 444, Semarang', '081234567109', 'Jahsh Ahmad', '081234567209'],
            ['2024010', 'Hamzah ibn Abdul Muttalib', 5, 'Medan', '2008-04-18', 'Laki-laki', 'Jl. Imam Bonjol No. 555, Medan', '081234567110', 'Abdul Muttalib', '081234567210'],
            ['2024011', 'Hafsah binti Umar', 6, 'Palembang', '2008-07-03', 'Perempuan', 'Jl. Ahmad Yani No. 666, Palembang', '081234567111', 'Umar Khattab', '081234567211'],
            ['2024012', 'Saad ibn Abi Waqqas', 6, 'Makassar', '2008-09-15', 'Laki-laki', 'Jl. Hasanuddin No. 777, Makassar', '081234567112', 'Abi Waqqas', '081234567212'],
            ['2024013', 'Ummu Salamah', 7, 'Balikpapan', '2007-11-08', 'Perempuan', 'Jl. Mulawarman No. 888, Balikpapan', '081234567113', 'Abu Salamah', '081234567213'],
            ['2024014', 'Khalid ibn Walid', 8, 'Pontianak', '2007-01-25', 'Laki-laki', 'Jl. Sultan Syarif No. 999, Pontianak', '081234567114', 'Walid Mughirah', '081234567214'],
            ['2024015', 'Safiyyah binti Huyay', 9, 'Banjarmasin', '2006-05-14', 'Perempuan', 'Jl. Lambung Mangkurat No. 101, Banjarmasin', '081234567115', 'Huyay ibn Akhtab', '081234567215']
        ];
        
        $santri_stmt = $pdo->prepare("INSERT INTO santri (nis, nama, kelas_id, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_hp, nama_wali, no_hp_wali) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($santri_data as $data) {
            $santri_stmt->execute($data);
        }
        
        // Insert sample jadwal pelajaran dengan lebih banyak data
        $jadwal_data = [
            // Senin
            [1, 1, 'Senin', '07:00:00', '08:30:00', 'Ruang A1'],
            [2, 2, 'Senin', '08:30:00', '10:00:00', 'Ruang A2'],
            [5, 3, 'Senin', '10:15:00', '11:45:00', 'Ruang B1'],
            [7, 4, 'Senin', '13:00:00', '14:30:00', 'Ruang B2'],
            [12, 7, 'Senin', '14:30:00', '16:00:00', 'Ruang C1'],
            
            // Selasa
            [3, 1, 'Selasa', '07:00:00', '08:30:00', 'Ruang A1'],
            [4, 2, 'Selasa', '08:30:00', '10:00:00', 'Ruang A2'],
            [8, 4, 'Selasa', '10:15:00', '11:45:00', 'Ruang B1'],
            [6, 5, 'Selasa', '13:00:00', '14:30:00', 'Ruang B2'],
            [13, 6, 'Selasa', '14:30:00', '16:00:00', 'Ruang C1'],
            
            // Rabu
            [5, 3, 'Rabu', '07:00:00', '08:30:00', 'Ruang A1'],
            [9, 4, 'Rabu', '08:30:00', '10:00:00', 'Ruang A2'],
            [1, 1, 'Rabu', '10:15:00', '11:45:00', 'Ruang B1'],
            [10, 5, 'Rabu', '13:00:00', '14:30:00', 'Ruang B2'],
            [14, 6, 'Rabu', '14:30:00', '16:00:00', 'Ruang C1'],
            
            // Kamis
            [11, 5, 'Kamis', '07:00:00', '08:30:00', 'Ruang A1'],
            [2, 2, 'Kamis', '08:30:00', '10:00:00', 'Ruang A2'],
            [6, 5, 'Kamis', '10:15:00', '11:45:00', 'Ruang B1'],
            [4, 2, 'Kamis', '13:00:00', '14:30:00', 'Ruang B2'],
            [12, 7, 'Kamis', '14:30:00', '16:00:00', 'Ruang C1'],
            
            // Jumat
            [7, 6, 'Jumat', '07:00:00', '08:30:00', 'Ruang A1'],
            [3, 1, 'Jumat', '08:30:00', '10:00:00', 'Ruang A2'],
            [8, 4, 'Jumat', '10:15:00', '11:45:00', 'Ruang B1'],
            
            // Sabtu
            [12, 7, 'Sabtu', '07:00:00', '08:30:00', 'Ruang C1'],
            [13, 6, 'Sabtu', '08:30:00', '10:00:00', 'Ruang C2'],
            [14, 6, 'Sabtu', '10:15:00', '11:45:00', 'Ruang C3']
        ];
        
        $jadwal_stmt = $pdo->prepare("INSERT INTO jadwal_pelajaran (mapel_id, ustadz_id, hari, jam_mulai, jam_selesai, ruangan) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($jadwal_data as $data) {
            $jadwal_stmt->execute($data);
        }
        
        // Insert sample nilai untuk berbagai santri dan mata pelajaran
        $nilai_data = [
            // Santri 1 - Muhammad Rizki Pratama
            [1, 1, 'UTS', 85.50, 'Ganjil', 2],
            [1, 2, 'UTS', 78.75, 'Ganjil', 2],
            [1, 5, 'UTS', 90.00, 'Ganjil', 3],
            [1, 8, 'Tugas', 88.25, 'Ganjil', 4],
            [1, 12, 'Quiz', 92.00, 'Ganjil', 7],
            
            // Santri 2 - Fatimah Azzahra
            [2, 1, 'UTS', 92.00, 'Ganjil', 2],
            [2, 3, 'UTS', 85.75, 'Ganjil', 1],
            [2, 6, 'Tugas', 89.50, 'Ganjil', 5],
            [2, 9, 'Quiz', 87.25, 'Ganjil', 4],
            [2, 13, 'UTS', 91.00, 'Ganjil', 6],
            
            // Santri 3 - Abdullah Al-Mahdi
            [3, 2, 'UTS', 76.50, 'Ganjil', 2],
            [3, 4, 'UTS', 82.25, 'Ganjil', 2],
            [3, 7, 'Tugas', 85.00, 'Ganjil', 6],
            [3, 10, 'Quiz', 79.75, 'Ganjil', 5],
            [3, 14, 'UTS', 88.50, 'Ganjil', 6],
            
            // Santri 4 - Khadijah binti Khuwailid
            [4, 1, 'UTS', 90.75, 'Ganjil', 2],
            [4, 3, 'UTS', 87.50, 'Ganjil', 1],
            [4, 8, 'Tugas', 92.25, 'Ganjil', 4],
            [4, 11, 'Quiz', 85.00, 'Ganjil', 5],
            [4, 12, 'UTS', 89.75, 'Ganjil', 7],
            
            // Santri 5 - Ali Zainal Abidin
            [5, 2, 'UTS', 82.00, 'Ganjil', 2],
            [5, 5, 'UTS', 88.25, 'Ganjil', 3],
            [5, 9, 'Tugas', 84.50, 'Ganjil', 4],
            [5, 12, 'Quiz', 90.00, 'Ganjil', 7],
            [5, 13, 'UTS', 86.75, 'Ganjil', 6],
            
            // Santri 6 - Ahmad Fauzi Rahman
            [6, 1, 'UTS', 87.25, 'Ganjil', 2],
            [6, 4, 'UTS', 83.50, 'Ganjil', 2],
            [6, 6, 'Tugas', 91.00, 'Ganjil', 5],
            [6, 10, 'Quiz', 88.75, 'Ganjil', 5],
            [6, 14, 'UTS', 85.25, 'Ganjil', 6],
            
            // Santri 7 - Siti Nurhalimah
            [7, 2, 'UTS', 94.00, 'Ganjil', 2],
            [7, 3, 'UTS', 89.25, 'Ganjil', 1],
            [7, 7, 'Tugas', 92.50, 'Ganjil', 6],
            [7, 11, 'Quiz', 87.75, 'Ganjil', 5],
            [7, 13, 'UTS', 93.25, 'Ganjil', 6]
        ];
        
        $nilai_stmt = $pdo->prepare("INSERT INTO nilai (santri_id, mapel_id, jenis_nilai, nilai, semester, dibuat_oleh) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($nilai_data as $data) {
            $nilai_stmt->execute($data);
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
