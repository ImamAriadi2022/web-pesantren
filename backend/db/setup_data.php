<?php
// File untuk setup data dummy untuk testing
// JANGAN JALANKAN LANGSUNG - Gunakan setup.html untuk interface yang lebih baik

echo "⚠️  PERHATIAN!\n";
echo "=====================================\n";
echo "File ini tidak untuk dijalankan langsung.\n";
echo "Gunakan interface web yang lebih user-friendly:\n\n";
echo "🌐 Buka: http://localhost/web-pesantren/backend/db/setup.html\n\n";
echo "Interface tersebut menyediakan:\n";
echo "✅ Setup dengan tombol yang mudah\n";
echo "✅ Kustomisasi username/password admin\n";
echo "✅ Progress bar dan log real-time\n";
echo "✅ Validasi input yang lebih baik\n";
echo "✅ Fitur reset database\n\n";
echo "=====================================\n";

// Jika tetap ingin menjalankan setup via CLI, uncomment kode dibawah:

/*
require_once '../config/database.php';

try {
    echo "Starting data setup...\n";
    
    // Default credentials
    $admin_username = 'admin';
    $admin_password = 'admin123';
    $admin_name = 'Administrator Pesantren';
    
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
    echo "✓ Pengaturan default berhasil diinsert\n";
    
    // Insert default admin user
    $password_hash = password_hash($admin_password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, password, nama, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$admin_username, $password_hash, $admin_name, 'Admin']);
    echo "✓ User admin default berhasil dibuat (username: $admin_username, password: $admin_password)\n";
    
    // ... rest of the setup code would go here
    
    echo "\n🎉 Setup data dummy berhasil!\n";
    echo "========================================\n";
    echo "Login Admin:\n";
    echo "Username: $admin_username\n";
    echo "Password: $admin_password\n";
    echo "========================================\n";
    
} catch (Exception $e) {
    echo "❌ Error during setup: " . $e->getMessage() . "\n";
}
*/
    
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
    echo "✓ Data kelas sample berhasil diinsert\n";
    
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
    echo "✓ Data mata pelajaran sample berhasil diinsert\n";
    
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
    echo "✓ Data ustadz sample berhasil diinsert\n";
    
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
    echo "✓ Data santri sample berhasil diinsert\n";
    
    // Insert sample jadwal pelajaran
    $jadwal_data = [
        [1, 1, 'Senin', '07:00:00', '08:30:00', 'Ruang A1'],  // Al-Quran Hadits - Ustadz Ahmad
        [2, 2, 'Senin', '08:30:00', '10:00:00', 'Ruang A2'],  // Akidah Akhlak - Ustadz Abduh
        [5, 3, 'Selasa', '07:00:00', '08:30:00', 'Ruang B1'], // Bahasa Arab - Ustadzah Fatimah
        [7, 4, 'Selasa', '08:30:00', '10:00:00', 'Ruang B2'], // Matematika - Ustadz Ali
        [6, 5, 'Rabu', '07:00:00', '08:30:00', 'Ruang C1'],   // Bahasa Indonesia - Ustadzah Aisyah
        [3, 1, 'Rabu', '08:30:00', '10:00:00', 'Ruang C2'],   // Fiqh - Ustadz Ahmad
        [8, 4, 'Kamis', '07:00:00', '08:30:00', 'Ruang D1'],  // IPA - Ustadz Ali
        [10, 5, 'Kamis', '08:30:00', '10:00:00', 'Ruang D2'], // PKN - Ustadzah Aisyah
        [4, 2, 'Jumat', '07:00:00', '08:30:00', 'Ruang E1'],  // SKI - Ustadz Abduh
        [9, 5, 'Jumat', '08:30:00', '10:00:00', 'Ruang E2']   // IPS - Ustadzah Aisyah
    ];
    
    $stmt = $pdo->prepare("INSERT INTO jadwal_pelajaran (mapel_id, ustadz_id, hari, jam_mulai, jam_selesai, ruangan) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($jadwal_data as $data) {
        $stmt->execute($data);
    }
    echo "✓ Data jadwal pelajaran sample berhasil diinsert\n";
    
    // Insert sample nilai
    $nilai_data = [
        [1, 1, 'UTS', 85.50, 'Ganjil', 1],    // Rizki - Al-Quran Hadits
        [1, 2, 'UTS', 78.75, 'Ganjil', 1],    // Rizki - Akidah Akhlak
        [2, 1, 'UTS', 92.00, 'Ganjil', 1],    // Fatimah - Al-Quran Hadits
        [2, 5, 'UTS', 88.25, 'Ganjil', 1],    // Fatimah - Bahasa Arab
        [3, 7, 'UTS', 76.50, 'Ganjil', 1],    // Abdullah - Matematika
        [4, 6, 'UTS', 90.75, 'Ganjil', 1],    // Khadijah - Bahasa Indonesia
        [5, 8, 'UTS', 82.00, 'Ganjil', 1]     // Ali - IPA
    ];
    
    $stmt = $pdo->prepare("INSERT INTO nilai (santri_id, mapel_id, jenis_nilai, nilai, semester, dibuat_oleh) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($nilai_data as $data) {
        $stmt->execute($data);
    }
    echo "✓ Data nilai sample berhasil diinsert\n";
    
    echo "\n🎉 Setup data dummy berhasil!\n";
    echo "========================================\n";
    echo "Login Admin:\n";
    echo "Username: admin\n";
    echo "Password: admin123\n";
    echo "========================================\n";
    
} catch (Exception $e) {
    echo "❌ Error during setup: " . $e->getMessage() . "\n";
}
