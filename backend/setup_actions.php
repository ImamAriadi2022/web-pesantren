<?php
header('Content-Type: application/json');
require_once 'config/database.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

try {
    switch ($action) {
        case 'setup_users':
            $result = setupUsers($pdo);
            break;
        case 'setup_master':
            $result = setupMaster($pdo);
            break;
        case 'setup_santri':
            $result = setupSantri($pdo);
            break;
        case 'setup_akademik':
            $result = setupAkademik($pdo);
            break;
        case 'setup_pengaturan':
            $result = setupPengaturan($pdo);
            break;
        case 'setup_all':
            $result = setupAll($pdo);
            break;
        case 'reset_database':
            $result = resetDatabase($pdo);
            break;
        default:
            $result = ['success' => false, 'message' => 'Action tidak valid'];
    }
    
    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

function setupUsers($pdo) {
    try {
        // Hapus data users lama jika ada
        try {
            $pdo->exec("DELETE FROM users");
            $pdo->exec("ALTER TABLE users AUTO_INCREMENT = 1");
        } catch (Exception $e) {
            // Table mungkin belum ada, buat dulu
            createUsersTable($pdo);
        }
        
        $pdo->beginTransaction();
        
        $password = 'admin';
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert users
        $users = [
            ['admin@pesantren.com', $hashedPassword, 'admin'],
            ['ustadz1@pesantren.com', $hashedPassword, 'pengajar'],
            ['ustadz2@pesantren.com', $hashedPassword, 'pengajar'],
            ['ustadz3@pesantren.com', $hashedPassword, 'pengajar'],
            ['ustadzah1@pesantren.com', $hashedPassword, 'pengajar'],
            ['ustadzah2@pesantren.com', $hashedPassword, 'pengajar'],
            ['santri1@pesantren.com', $hashedPassword, 'santri'],
            ['santri2@pesantren.com', $hashedPassword, 'santri'],
            ['santri3@pesantren.com', $hashedPassword, 'santri'],
            ['santri4@pesantren.com', $hashedPassword, 'santri'],
            ['santri5@pesantren.com', $hashedPassword, 'santri'],
            ['santri6@pesantren.com', $hashedPassword, 'santri'],
            ['santri7@pesantren.com', $hashedPassword, 'santri'],
            ['santri8@pesantren.com', $hashedPassword, 'santri']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
        foreach ($users as $user) {
            $stmt->execute($user);
        }
        
        $pdo->commit();
        
        // Test password
        $testStmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $testStmt->execute(['admin@pesantren.com']);
        $testUser = $testStmt->fetch(PDO::FETCH_ASSOC);
        
        $passwordTest = password_verify($password, $testUser['password']);
        
        return [
            'success' => true, 
            'message' => "✅ Users berhasil dibuat!\n\n" .
                        "Total users: " . count($users) . "\n" .
                        "Password untuk semua user: $password\n" .
                        "Test password admin: " . ($passwordTest ? '✅ Berhasil' : '❌ Gagal') . "\n\n" .
                        "Login credentials:\n" .
                        "- admin@pesantren.com / $password\n" .
                        "- ustadz1@pesantren.com / $password\n" .
                        "- santri1@pesantren.com / $password"
        ];
    } catch (Exception $e) {
        $pdo->rollBack();
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function setupMaster($pdo) {
    try {
        // Cek dan buat tabel jika belum ada
        createMasterTables($pdo);
        
        $pdo->beginTransaction();
        
        // Insert mata pelajaran
        $pdo->exec("DELETE FROM mata_pelajaran");
        $mataPelajaran = [
            ['AL001', 'Al-Quran dan Hadits', 'Pembelajaran Al-Quran dan Hadits', 'Agama'],
            ['FIQ001', 'Fiqih', 'Pembelajaran Fiqih', 'Agama'],
            ['AKH001', 'Akhlaq', 'Pembelajaran Akhlaq dan Tasawuf', 'Agama'],
            ['THF001', 'Tahfidz Quran', 'Hafalan Al-Quran', 'Tahfidz'],
            ['MTK001', 'Matematika', 'Pembelajaran Matematika', 'Umum'],
            ['BIN001', 'Bahasa Indonesia', 'Pembelajaran Bahasa Indonesia', 'Umum'],
            ['BING001', 'Bahasa Inggris', 'Pembelajaran Bahasa Inggris', 'Umum'],
            ['IPA001', 'IPA', 'Ilmu Pengetahuan Alam', 'Umum'],
            ['IPS001', 'IPS', 'Ilmu Pengetahuan Sosial', 'Umum'],
            ['KTK001', 'Keterampilan', 'Pembelajaran Keterampilan Hidup', 'Keterampilan']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, deskripsi, kategori) VALUES (?, ?, ?, ?)");
        foreach ($mataPelajaran as $mapel) {
            $stmt->execute($mapel);
        }
        
        // Insert ustadz
        $pdo->exec("DELETE FROM ustadz");
        $ustadz = [
            [2, 'Ustadz Ahmad Fauzi', '3518041985121001', 'Laki-laki', 'Lampung', '1985-12-10', 'Jl. Pesantren No. 10', '081234567891', 'ustadz1@pesantren.com', 'S1 Pendidikan Agama Islam', 'Al-Quran dan Hadits', '2020-01-01'],
            [3, 'Ustadz Muhammad Rizki', '3518041987091002', 'Laki-laki', 'Palembang', '1987-09-15', 'Jl. Pesantren No. 11', '081234567892', 'ustadz2@pesantren.com', 'S2 Studi Islam', 'Fiqih dan Ushul Fiqih', '2020-02-01'],
            [4, 'Ustadz Abdullah Hakim', '3518041983051003', 'Laki-laki', 'Bandar Lampung', '1983-05-20', 'Jl. Pesantren No. 12', '081234567893', 'ustadz3@pesantren.com', 'S1 Matematika', 'Matematika dan IPA', '2019-08-01'],
            [5, 'Ustadzah Siti Aminah', '3518044988071004', 'Perempuan', 'Metro', '1988-07-25', 'Jl. Pesantren No. 13', '081234567894', 'ustadzah1@pesantren.com', 'S1 Pendidikan Bahasa', 'Bahasa Indonesia dan Inggris', '2020-03-01'],
            [6, 'Ustadzah Fatimah Zahra', '3518044990111005', 'Perempuan', 'Way Kanan', '1990-11-12', 'Jl. Pesantren No. 14', '081234567895', 'ustadzah2@pesantren.com', 'S1 Tahfidz Quran', 'Tahfidz dan Qiroah', '2021-01-01']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO ustadz (user_id, nama, nik, jenis_kelamin, tempat_lahir, tanggal_lahir, alamat, telepon, email, pendidikan_terakhir, bidang_keahlian, tanggal_bergabung) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($ustadz as $ustad) {
            $stmt->execute($ustad);
        }
        
        // Insert kelas
        $pdo->exec("DELETE FROM kelas");
        $kelas = [
            ['K001', 'Kelas 1A', '1', 1, 25, 'Kelas tingkat 1 putra'],
            ['K002', 'Kelas 1B', '1', 2, 25, 'Kelas tingkat 1 putra'],
            ['K003', 'Kelas 1C', '1', 4, 25, 'Kelas tingkat 1 putri'],
            ['K004', 'Kelas 2A', '2', 3, 30, 'Kelas tingkat 2 putra'],
            ['K005', 'Kelas 2B', '2', 5, 30, 'Kelas tingkat 2 putri'],
            ['K006', 'Kelas 3A', '3', 1, 28, 'Kelas tingkat 3 putra'],
            ['K007', 'Kelas 3B', '3', 4, 28, 'Kelas tingkat 3 putri']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO kelas (kode_kelas, nama_kelas, tingkat, wali_kelas_id, kapasitas, keterangan) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($kelas as $k) {
            $stmt->execute($k);
        }
        
        // Insert asrama
        $pdo->exec("DELETE FROM asrama");
        $asrama = [
            ['Asrama Al-Ikhlas', 'ASR001', 50, 'Blok A Lantai 1', 'Putra', 1, 'AC, WiFi, Kamar Mandi Dalam, Lemari'],
            ['Asrama At-Taqwa', 'ASR002', 45, 'Blok A Lantai 2', 'Putra', 2, 'AC, WiFi, Kamar Mandi Dalam, Lemari'],
            ['Asrama Ar-Rahman', 'ASR003', 40, 'Blok B Lantai 1', 'Putri', 4, 'AC, WiFi, Kamar Mandi Dalam, Lemari, Cermin'],
            ['Asrama As-Sakinah', 'ASR004', 42, 'Blok B Lantai 2', 'Putri', 5, 'AC, WiFi, Kamar Mandi Dalam, Lemari, Cermin'],
            ['Asrama Al-Barokah', 'ASR005', 35, 'Blok C', 'Putra', 3, 'Kipas Angin, WiFi, Kamar Mandi Luar, Lemari']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO asrama (nama_asrama, kode_asrama, kapasitas, lokasi, jenis, penanggung_jawab_id, fasilitas) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($asrama as $a) {
            $stmt->execute($a);
        }
        
        $pdo->commit();
        
        return [
            'success' => true, 
            'message' => "✅ Data master berhasil dibuat!\n\n" .
                        "- " . count($mataPelajaran) . " mata pelajaran\n" .
                        "- " . count($ustadz) . " ustadz/ustadzah\n" .
                        "- " . count($kelas) . " kelas\n" .
                        "- " . count($asrama) . " asrama"
        ];
    } catch (Exception $e) {
        $pdo->rollBack();
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function setupSantri($pdo) {
    try {
        // Cek dan buat tabel jika belum ada
        createSantriTables($pdo);
        
        $pdo->beginTransaction();
        
        // Insert santri
        $pdo->exec("DELETE FROM santri");
        $santri = [
            [7, 'Ahmad Fauzi Santoso', '2023001', 'Laki-laki', 'SMP Negeri 1 Metro', '2008-05-15', 'Jl. Merdeka No. 123, Metro', '081234567801', 'Budi Santoso', 'Petani', 'Jl. Merdeka No. 123, Metro', '081234567801', '2023-07-01'],
            [8, 'Muhammad Rizki Pratama', '2023002', 'Laki-laki', 'SMP Negeri 2 Bandar Lampung', '2008-08-20', 'Jl. Kartini No. 45, Bandar Lampung', '081234567802', 'Andi Pratama', 'Pedagang', 'Jl. Kartini No. 45, Bandar Lampung', '081234567802', '2023-07-01'],
            [9, 'Siti Aminah Putri', '2023003', 'Perempuan', 'SMP Negeri 3 Way Kanan', '2008-03-10', 'Jl. Diponegoro No. 67, Way Kanan', '081234567803', 'Hasan Basri', 'Guru', 'Jl. Diponegoro No. 67, Way Kanan', '081234567803', '2023-07-01'],
            [10, 'Fatimah Zahra', '2023004', 'Perempuan', 'SMP Islam Terpadu', '2008-12-05', 'Jl. Ahmad Yani No. 89, Lampung Utara', '081234567804', 'Abdullah Rahman', 'Wiraswasta', 'Jl. Ahmad Yani No. 89, Lampung Utara', '081234567804', '2023-07-01'],
            [11, 'Ali Akbar Maulana', '2023005', 'Laki-laki', 'SMP Negeri 4 Tulang Bawang', '2009-01-18', 'Jl. Sudirman No. 12, Tulang Bawang', '081234567805', 'Maulana Malik', 'Buruh', 'Jl. Sudirman No. 12, Tulang Bawang', '081234567805', '2023-07-01'],
            [12, 'Khadijah Aisyah', '2023006', 'Perempuan', 'SMP Negeri 5 Pringsewu', '2008-09-22', 'Jl. Gajah Mada No. 34, Pringsewu', '081234567806', 'Umar Faruq', 'PNS', 'Jl. Gajah Mada No. 34, Pringsewu', '081234567806', '2023-07-01'],
            [13, 'Ibrahim Khalil', '2023007', 'Laki-laki', 'SMP Negeri 6 Lampung Selatan', '2008-11-30', 'Jl. Pahlawan No. 56, Lampung Selatan', '081234567807', 'Khalil Ahmad', 'Petani', 'Jl. Pahlawan No. 56, Lampung Selatan', '081234567807', '2023-07-01'],
            [14, 'Maryam Salsabila', '2023008', 'Perempuan', 'SMP Negeri 7 Tanggamus', '2008-07-14', 'Jl. Veteran No. 78, Tanggamus', '081234567808', 'Salim Usman', 'Sopir', 'Jl. Veteran No. 78, Tanggamus', '081234567808', '2023-07-01']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO santri (user_id, nama, nis, jenis_kelamin, asal_sekolah, tanggal_lahir, alamat, telepon, nama_wali, pekerjaan_wali, alamat_wali, telepon_wali, tanggal_masuk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($santri as $s) {
            $stmt->execute($s);
        }
        
        // Insert penempatan asrama
        $pdo->exec("DELETE FROM santri_asrama");
        $santriAsrama = [
            [1, 1, 'A101', '2023-07-01'],
            [2, 1, 'A102', '2023-07-01'],
            [3, 3, 'B101', '2023-07-01'],
            [4, 3, 'B102', '2023-07-01'],
            [5, 2, 'A201', '2023-07-01'],
            [6, 4, 'B201', '2023-07-01'],
            [7, 5, 'C101', '2023-07-01'],
            [8, 4, 'B202', '2023-07-01']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO santri_asrama (santri_id, asrama_id, nomor_kamar, tanggal_masuk) VALUES (?, ?, ?, ?)");
        foreach ($santriAsrama as $sa) {
            $stmt->execute($sa);
        }
        
        // Insert penempatan kelas
        $pdo->exec("DELETE FROM santri_kelas");
        $santriKelas = [
            [1, 1, '2023/2024', 'Ganjil', '2023-07-01'],
            [2, 1, '2023/2024', 'Ganjil', '2023-07-01'],
            [3, 3, '2023/2024', 'Ganjil', '2023-07-01'],
            [4, 3, '2023/2024', 'Ganjil', '2023-07-01'],
            [5, 2, '2023/2024', 'Ganjil', '2023-07-01'],
            [6, 5, '2023/2024', 'Ganjil', '2023-07-01'],
            [7, 4, '2023/2024', 'Ganjil', '2023-07-01'],
            [8, 5, '2023/2024', 'Ganjil', '2023-07-01']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO santri_kelas (santri_id, kelas_id, tahun_ajaran, semester, tanggal_masuk) VALUES (?, ?, ?, ?, ?)");
        foreach ($santriKelas as $sk) {
            $stmt->execute($sk);
        }
        
        $pdo->commit();
        
        return [
            'success' => true, 
            'message' => "✅ Data santri berhasil dibuat!\n\n" .
                        "- " . count($santri) . " santri\n" .
                        "- " . count($santriAsrama) . " penempatan asrama\n" .
                        "- " . count($santriKelas) . " penempatan kelas"
        ];
    } catch (Exception $e) {
        $pdo->rollBack();
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function setupAkademik($pdo) {
    try {
        // Cek dan buat tabel jika belum ada
        createAkademikTables($pdo);
        
        $pdo->beginTransaction();
        
        // Insert jadwal pelajaran
        $pdo->exec("DELETE FROM jadwal_pelajaran");
        $jadwal = [
            [1, 1, 1, 'Senin', '07:00:00', '08:30:00', 'Ruang 101', '2023/2024', 'Ganjil'],
            [1, 5, 3, 'Senin', '08:45:00', '10:15:00', 'Ruang 101', '2023/2024', 'Ganjil'],
            [1, 6, 4, 'Senin', '10:30:00', '12:00:00', 'Ruang 101', '2023/2024', 'Ganjil'],
            [1, 4, 5, 'Senin', '13:00:00', '14:30:00', 'Ruang 101', '2023/2024', 'Ganjil'],
            [1, 2, 2, 'Selasa', '07:00:00', '08:30:00', 'Ruang 101', '2023/2024', 'Ganjil'],
            [1, 7, 4, 'Selasa', '08:45:00', '10:15:00', 'Ruang 101', '2023/2024', 'Ganjil'],
            [1, 8, 3, 'Selasa', '10:30:00', '12:00:00', 'Ruang 101', '2023/2024', 'Ganjil'],
            [1, 3, 1, 'Rabu', '07:00:00', '08:30:00', 'Ruang 101', '2023/2024', 'Ganjil'],
            [1, 9, 3, 'Rabu', '08:45:00', '10:15:00', 'Ruang 101', '2023/2024', 'Ganjil'],
            [1, 10, 4, 'Rabu', '10:30:00', '12:00:00', 'Ruang 101', '2023/2024', 'Ganjil']
        ];
        
        $stmt = $pdo->prepare("INSERT INTO jadwal_pelajaran (kelas_id, mapel_id, ustadz_id, hari, jam_mulai, jam_selesai, ruangan, tahun_ajaran, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($jadwal as $j) {
            $stmt->execute($j);
        }
        
        // Insert absensi
        $pdo->exec("DELETE FROM absensi");
        $absensi = [
            [1, '2025-01-01', 'Hadir', 'Hadir tepat waktu', 2],
            [1, '2025-01-02', 'Hadir', 'Hadir tepat waktu', 2],
            [1, '2025-01-03', 'Izin', 'Izin sakit demam', 2],
            [1, '2025-01-04', 'Hadir', 'Hadir tepat waktu', 2],
            [1, '2025-01-05', 'Hadir', 'Hadir tepat waktu', 2],
            [2, '2025-01-01', 'Hadir', 'Hadir tepat waktu', 2],
            [2, '2025-01-02', 'Alpha', 'Tidak ada keterangan', 2],
            [2, '2025-01-03', 'Hadir', 'Hadir tepat waktu', 2],
            [2, '2025-01-04', 'Sakit', 'Sakit flu', 2],
            [2, '2025-01-05', 'Hadir', 'Hadir tepat waktu', 2]
        ];
        
        $stmt = $pdo->prepare("INSERT INTO absensi (santri_id, tanggal, status, keterangan, dibuat_oleh) VALUES (?, ?, ?, ?, ?)");
        foreach ($absensi as $a) {
            $stmt->execute($a);
        }
        
        // Insert nilai
        $pdo->exec("DELETE FROM nilai");
        $nilai = [
            [1, 1, 'UTS', 85.00, '2023/2024', 'Ganjil', 1],
            [1, 1, 'UAS', 88.00, '2023/2024', 'Ganjil', 1],
            [1, 5, 'UTS', 78.00, '2023/2024', 'Ganjil', 3],
            [1, 5, 'UAS', 82.00, '2023/2024', 'Ganjil', 3],
            [1, 6, 'UTS', 90.00, '2023/2024', 'Ganjil', 4],
            [1, 6, 'UAS', 92.00, '2023/2024', 'Ganjil', 4],
            [2, 1, 'UTS', 75.00, '2023/2024', 'Ganjil', 1],
            [2, 1, 'UAS', 80.00, '2023/2024', 'Ganjil', 1],
            [2, 5, 'UTS', 85.00, '2023/2024', 'Ganjil', 3],
            [2, 5, 'UAS', 87.00, '2023/2024', 'Ganjil', 3]
        ];
        
        $stmt = $pdo->prepare("INSERT INTO nilai (santri_id, mapel_id, jenis_nilai, nilai, tahun_ajaran, semester, dibuat_oleh) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($nilai as $n) {
            $stmt->execute($n);
        }
        
        // Insert tahfidz
        $pdo->exec("DELETE FROM tahfidz");
        $tahfidz = [
            [1, 'Al-Baqarah', 1, 50, '2023-08-01', '2023-09-15', 'Selesai', 'A', 5],
            [1, 'Al-Baqarah', 51, 100, '2023-09-16', '2023-11-01', 'Selesai', 'B', 5],
            [1, 'Al-Baqarah', 101, 150, '2023-11-02', null, 'Sedang Hafalan', null, 5],
            [2, 'Al-Fatihah', 1, 7, '2023-08-01', '2023-08-15', 'Selesai', 'A', 5],
            [2, 'Al-Baqarah', 1, 25, '2023-08-16', '2023-09-30', 'Selesai', 'B', 5],
            [3, 'Al-Fatihah', 1, 7, '2023-08-01', '2023-08-20', 'Selesai', 'A', 5],
            [3, 'Al-Baqarah', 1, 30, '2023-08-21', null, 'Sedang Hafalan', null, 5]
        ];
        
        $stmt = $pdo->prepare("INSERT INTO tahfidz (santri_id, surat, ayat_mulai, ayat_selesai, tanggal_mulai, tanggal_selesai, status, nilai_hafalan, pembimbing_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($tahfidz as $t) {
            $stmt->execute($t);
        }
        
        $pdo->commit();
        
        return [
            'success' => true, 
            'message' => "✅ Data akademik berhasil dibuat!\n\n" .
                        "- " . count($jadwal) . " jadwal pelajaran\n" .
                        "- " . count($absensi) . " data absensi\n" .
                        "- " . count($nilai) . " data nilai\n" .
                        "- " . count($tahfidz) . " data tahfidz"
        ];
    } catch (Exception $e) {
        $pdo->rollBack();
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function setupPengaturan($pdo) {
    try {
        // Cek dan buat tabel jika belum ada
        createPengaturanTables($pdo);
        
        $pdo->beginTransaction();
        
        // Insert pengaturan web
        $pdo->exec("DELETE FROM pengaturan_web");
        $stmt = $pdo->prepare("INSERT INTO pengaturan_web (judul_web, tagline_web, caption_web, tentang_web, footer_web, nama_instansi, nama_pimpinan, nik_pimpinan, alamat_instansi, email_instansi, telp, whatsapp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $pengaturan = [
            'Pondok Pesantren Walisongo',
            'Mendidik Generasi Qurani dan Berkarakter',
            'Membentuk santri yang beriman, bertaqwa, dan berakhlak mulia',
            'Pondok Pesantren Walisongo adalah lembaga pendidikan Islam yang berdedikasi untuk membentuk generasi yang beriman, bertaqwa, dan berakhlak mulia.',
            'Copyright © 2025 Pondok Pesantren Walisongo. All rights reserved.',
            'Pondok Pesantren Walisongo',
            'KH. Abdullah Walisongo',
            '1234567890123456',
            'Jl. Pesantren No. 123, Lampung Utara',
            'info@pesantrenwalisongo.com',
            '0724-123456',
            '081234567890'
        ];
        
        $stmt->execute($pengaturan);
        
        // Insert PSB
        $pdo->exec("DELETE FROM psb");
        $stmt = $pdo->prepare("INSERT INTO psb (tahun_ajaran, tanggal_buka, tanggal_tutup, kuota_putra, kuota_putri, biaya_pendaftaran, persyaratan, kontak_panitia, email_panitia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $psb = [
            '2024/2025',
            '2024-03-01',
            '2024-06-30',
            100,
            80,
            250000.00,
            "1. Fotokopi ijazah SD/MI yang telah dilegalisir\n2. Fotokopi SKHUN yang telah dilegalisir\n3. Fotokopi akta kelahiran\n4. Fotokopi kartu keluarga\n5. Pas foto 3x4 sebanyak 4 lembar\n6. Surat keterangan sehat dari dokter\n7. Surat pernyataan sanggup mengikuti peraturan pesantren",
            '081234567890',
            'psb@pesantrenwalisongo.com'
        ];
        
        $stmt->execute($psb);
        
        // Insert keuangan sample
        $pdo->exec("DELETE FROM keuangan");
        $keuangan = [
            [1, 'TRX20250101001', 'Pemasukan', 'SPP', 500000.00, '2025-01-01', 'Transfer', 'Pembayaran SPP Januari 2025', 'Berhasil', 1],
            [1, 'TRX20250101002', 'Pemasukan', 'Makan', 300000.00, '2025-01-01', 'Transfer', 'Pembayaran makan Januari 2025', 'Berhasil', 1],
            [2, 'TRX20250101003', 'Pemasukan', 'SPP', 500000.00, '2025-01-02', 'Tunai', 'Pembayaran SPP Januari 2025', 'Berhasil', 1],
            [3, 'TRX20250101004', 'Pemasukan', 'Daftar Ulang', 1000000.00, '2025-01-01', 'Transfer', 'Daftar ulang tahun ajaran 2024/2025', 'Berhasil', 1]
        ];
        
        $stmt = $pdo->prepare("INSERT INTO keuangan (santri_id, kode_transaksi, jenis_transaksi, kategori, jumlah, tanggal_transaksi, metode_pembayaran, keterangan, status, diproses_oleh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($keuangan as $k) {
            $stmt->execute($k);
        }
        
        $pdo->commit();
        
        return [
            'success' => true, 
            'message' => "✅ Pengaturan berhasil dibuat!\n\n" .
                        "- Pengaturan web\n" .
                        "- Data PSB 2024/2025\n" .
                        "- " . count($keuangan) . " sample transaksi keuangan"
        ];
    } catch (Exception $e) {
        $pdo->rollBack();
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function setupAll($pdo) {
    try {
        $results = [];
        
        // Buat semua tabel dulu
        createUsersTable($pdo);
        createMasterTables($pdo);
        createSantriTables($pdo);
        createAkademikTables($pdo);
        createPengaturanTables($pdo);
        
        $results[] = setupUsers($pdo);
        $results[] = setupMaster($pdo);
        $results[] = setupSantri($pdo);
        $results[] = setupAkademik($pdo);
        $results[] = setupPengaturan($pdo);
        
        $success = true;
        $messages = [];
        
        foreach ($results as $result) {
            if (!$result['success']) {
                $success = false;
            }
            $messages[] = $result['message'];
        }
        
        return [
            'success' => $success,
            'message' => "🚀 SETUP LENGKAP SELESAI!\n\n" . implode("\n\n", $messages) . "\n\n" .
                        "✅ Database siap digunakan!\n" .
                        "Login ke frontend dengan:\n" .
                        "- admin@pesantren.com / admin\n" .
                        "- ustadz1@pesantren.com / admin\n" .
                        "- santri1@pesantren.com / admin"
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function resetDatabase($pdo) {
    try {
        $pdo->beginTransaction();
        
        // Disable foreign key checks
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
        
        // List of tables to truncate
        $tables = [
            'keuangan', 'pendaftar_psb', 'psb', 'pelanggaran', 'surat_izin_keluar',
            'tahfidz', 'nilai', 'absensi', 'santri_kelas', 'santri_asrama',
            'jadwal_pelajaran', 'santri', 'ustadz', 'kelas', 'asrama',
            'mata_pelajaran', 'pengaturan_web', 'users'
        ];
        
        foreach ($tables as $table) {
            $pdo->exec("TRUNCATE TABLE $table");
        }
        
        // Re-enable foreign key checks
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
        
        $pdo->commit();
        
        return [
            'success' => true,
            'message' => "🗑️ Database berhasil direset!\n\n" .
                        "Semua data telah dihapus.\n" .
                        "Silakan jalankan setup ulang untuk menambah data."
        ];
    } catch (Exception $e) {
        $pdo->rollBack();
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

// Fungsi untuk membuat tabel jika belum ada
function createUsersTable($pdo) {
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'pengajar', 'santri') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
}

function createMasterTables($pdo) {
    // Tabel mata pelajaran
    $sql = "CREATE TABLE IF NOT EXISTS mata_pelajaran (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kode_mapel VARCHAR(20) UNIQUE NOT NULL,
        nama_mapel VARCHAR(100) NOT NULL,
        deskripsi TEXT,
        sks INT DEFAULT 1,
        kategori ENUM('Umum', 'Agama', 'Tahfidz', 'Keterampilan') DEFAULT 'Umum',
        status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    
    // Tabel ustadz
    $sql = "CREATE TABLE IF NOT EXISTS ustadz (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        foto TEXT,
        nama VARCHAR(100) NOT NULL,
        nik VARCHAR(20) UNIQUE,
        jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
        tempat_lahir VARCHAR(100),
        tanggal_lahir DATE,
        alamat TEXT,
        telepon VARCHAR(20),
        email VARCHAR(100),
        pendidikan_terakhir VARCHAR(100),
        bidang_keahlian VARCHAR(100),
        status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
        tanggal_bergabung DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )";
    $pdo->exec($sql);
    
    // Tabel kelas
    $sql = "CREATE TABLE IF NOT EXISTS kelas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kode_kelas VARCHAR(20) UNIQUE NOT NULL,
        nama_kelas VARCHAR(100) NOT NULL,
        tingkat ENUM('1', '2', '3', '4', '5', '6') NOT NULL,
        wali_kelas_id INT,
        kapasitas INT DEFAULT 30,
        keterangan TEXT,
        status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (wali_kelas_id) REFERENCES ustadz(id) ON DELETE SET NULL
    )";
    $pdo->exec($sql);
    
    // Tabel asrama
    $sql = "CREATE TABLE IF NOT EXISTS asrama (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_asrama VARCHAR(100) NOT NULL,
        kode_asrama VARCHAR(20) UNIQUE NOT NULL,
        kapasitas INT NOT NULL,
        lokasi VARCHAR(200),
        jenis ENUM('Putra', 'Putri') NOT NULL,
        penanggung_jawab_id INT,
        fasilitas TEXT,
        status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (penanggung_jawab_id) REFERENCES ustadz(id) ON DELETE SET NULL
    )";
    $pdo->exec($sql);
}

function createSantriTables($pdo) {
    // Tabel santri
    $sql = "CREATE TABLE IF NOT EXISTS santri (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        foto TEXT,
        nama VARCHAR(100) NOT NULL,
        nis VARCHAR(30) NOT NULL UNIQUE,
        jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
        asal_sekolah VARCHAR(100),
        tanggal_lahir DATE,
        alamat TEXT,
        telepon VARCHAR(20),
        nama_wali VARCHAR(100),
        pekerjaan_wali VARCHAR(100),
        alamat_wali TEXT,
        telepon_wali VARCHAR(20),
        status ENUM('Aktif', 'Nonaktif', 'Lulus', 'Keluar') DEFAULT 'Aktif',
        tanggal_masuk DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )";
    $pdo->exec($sql);
    
    // Tabel santri_asrama
    $sql = "CREATE TABLE IF NOT EXISTS santri_asrama (
        id INT AUTO_INCREMENT PRIMARY KEY,
        santri_id INT NOT NULL,
        asrama_id INT NOT NULL,
        nomor_kamar VARCHAR(10),
        tanggal_masuk DATE NOT NULL,
        tanggal_keluar DATE NULL,
        status ENUM('Aktif', 'Pindah', 'Keluar') DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
        FOREIGN KEY (asrama_id) REFERENCES asrama(id) ON DELETE CASCADE
    )";
    $pdo->exec($sql);
    
    // Tabel santri_kelas
    $sql = "CREATE TABLE IF NOT EXISTS santri_kelas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        santri_id INT NOT NULL,
        kelas_id INT NOT NULL,
        tahun_ajaran VARCHAR(10) NOT NULL,
        semester ENUM('Ganjil', 'Genap') NOT NULL,
        tanggal_masuk DATE NOT NULL,
        tanggal_keluar DATE NULL,
        status ENUM('Aktif', 'Pindah', 'Lulus', 'Keluar') DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
        FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE,
        UNIQUE KEY unique_santri_kelas_tahun (santri_id, kelas_id, tahun_ajaran, semester)
    )";
    $pdo->exec($sql);
}

function createAkademikTables($pdo) {
    // Tabel jadwal pelajaran
    $sql = "CREATE TABLE IF NOT EXISTS jadwal_pelajaran (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kelas_id INT NOT NULL,
        mapel_id INT NOT NULL,
        ustadz_id INT NOT NULL,
        hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
        jam_mulai TIME NOT NULL,
        jam_selesai TIME NOT NULL,
        ruangan VARCHAR(50),
        tahun_ajaran VARCHAR(10),
        semester ENUM('Ganjil', 'Genap') NOT NULL,
        status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE,
        FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
        FOREIGN KEY (ustadz_id) REFERENCES ustadz(id) ON DELETE CASCADE
    )";
    $pdo->exec($sql);
    
    // Tabel absensi
    $sql = "CREATE TABLE IF NOT EXISTS absensi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        santri_id INT NOT NULL,
        tanggal DATE NOT NULL,
        status ENUM('Hadir', 'Izin', 'Sakit', 'Alpha') NOT NULL,
        keterangan TEXT,
        dibuat_oleh INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
        FOREIGN KEY (dibuat_oleh) REFERENCES users(id) ON DELETE SET NULL,
        UNIQUE KEY unique_santri_tanggal (santri_id, tanggal)
    )";
    $pdo->exec($sql);
    
    // Tabel nilai
    $sql = "CREATE TABLE IF NOT EXISTS nilai (
        id INT AUTO_INCREMENT PRIMARY KEY,
        santri_id INT NOT NULL,
        mapel_id INT NOT NULL,
        jenis_nilai ENUM('Tugas', 'UTS', 'UAS', 'Praktik', 'Hafalan') NOT NULL,
        nilai DECIMAL(5,2) NOT NULL,
        bobot DECIMAL(3,2) DEFAULT 1.00,
        keterangan TEXT,
        tahun_ajaran VARCHAR(10),
        semester ENUM('Ganjil', 'Genap') NOT NULL,
        dibuat_oleh INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
        FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
        FOREIGN KEY (dibuat_oleh) REFERENCES users(id) ON DELETE SET NULL
    )";
    $pdo->exec($sql);
    
    // Tabel tahfidz
    $sql = "CREATE TABLE IF NOT EXISTS tahfidz (
        id INT AUTO_INCREMENT PRIMARY KEY,
        santri_id INT NOT NULL,
        surat VARCHAR(100) NOT NULL,
        ayat_mulai INT NOT NULL,
        ayat_selesai INT NOT NULL,
        tanggal_mulai DATE NOT NULL,
        tanggal_selesai DATE,
        target_selesai DATE,
        status ENUM('Belum Mulai', 'Sedang Hafalan', 'Selesai', 'Revisi') DEFAULT 'Belum Mulai',
        nilai_hafalan ENUM('A', 'B', 'C', 'D', 'E') NULL,
        keterangan TEXT,
        pembimbing_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
        FOREIGN KEY (pembimbing_id) REFERENCES ustadz(id) ON DELETE SET NULL
    )";
    $pdo->exec($sql);
}

function createPengaturanTables($pdo) {
    // Tabel pengaturan web
    $sql = "CREATE TABLE IF NOT EXISTS pengaturan_web (
        id INT AUTO_INCREMENT PRIMARY KEY,
        judul_web VARCHAR(255),
        tagline_web VARCHAR(255),
        caption_web TEXT,
        tentang_web TEXT,
        footer_web TEXT,
        logo_web LONGTEXT,
        nama_instansi VARCHAR(255),
        nama_pimpinan VARCHAR(255),
        nik_pimpinan VARCHAR(50),
        alamat_instansi TEXT,
        email_instansi VARCHAR(255),
        telp VARCHAR(20),
        whatsapp VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    
    // Tabel PSB
    $sql = "CREATE TABLE IF NOT EXISTS psb (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tahun_ajaran VARCHAR(10) NOT NULL,
        tanggal_buka DATE NOT NULL,
        tanggal_tutup DATE NOT NULL,
        kuota_putra INT DEFAULT 0,
        kuota_putri INT DEFAULT 0,
        biaya_pendaftaran DECIMAL(15,2),
        persyaratan TEXT,
        kontak_panitia VARCHAR(20),
        email_panitia VARCHAR(100),
        status ENUM('Dibuka', 'Ditutup', 'Selesai') DEFAULT 'Dibuka',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);
    
    // Tabel keuangan
    $sql = "CREATE TABLE IF NOT EXISTS keuangan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        santri_id INT,
        kode_transaksi VARCHAR(50) UNIQUE NOT NULL,
        jenis_transaksi ENUM('Pemasukan', 'Pengeluaran') NOT NULL,
        kategori ENUM('SPP', 'Daftar Ulang', 'Seragam', 'Makan', 'Asrama', 'Lainnya') NOT NULL,
        jumlah DECIMAL(15,2) NOT NULL,
        tanggal_transaksi DATE NOT NULL,
        metode_pembayaran ENUM('Tunai', 'Transfer', 'Debit', 'Kredit') DEFAULT 'Tunai',
        keterangan TEXT,
        bukti_pembayaran TEXT,
        status ENUM('Pending', 'Berhasil', 'Gagal') DEFAULT 'Pending',
        diproses_oleh INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE SET NULL,
        FOREIGN KEY (diproses_oleh) REFERENCES users(id) ON DELETE SET NULL
    )";
    $pdo->exec($sql);
}
?>
