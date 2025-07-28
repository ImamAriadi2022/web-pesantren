-- Database untuk Sistem Pesantren Walisongo
-- Created: 2025
-- 
-- CATATAN: File ini hanya berisi struktur tabel (CREATE TABLE)
-- Untuk insert data, gunakan setup_data.php di backend

-- Tabel Users untuk sistem login
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pengajar', 'santri') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Santri
CREATE TABLE santri (
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
    no_hp_wali VARCHAR(20),
    pekerjaan_wali VARCHAR(100),
    alamat_wali TEXT,
    telepon_wali VARCHAR(20),
    status ENUM('Aktif', 'Nonaktif', 'Lulus', 'Keluar') DEFAULT 'Aktif',
    tanggal_masuk DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Ustadz/Ustadzah
CREATE TABLE ustadz (
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
    tanggal_masuk DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Kelas
CREATE TABLE kelas (
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
);

-- Tabel Mata Pelajaran
CREATE TABLE mata_pelajaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mapel VARCHAR(20) UNIQUE NOT NULL,
    nama_mapel VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    sks INT DEFAULT 1,
    kkm INT DEFAULT 75,
    kategori ENUM('Umum', 'Agama', 'Tahfidz', 'Keterampilan') DEFAULT 'Umum',
    status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Jadwal Pelajaran
CREATE TABLE jadwal_pelajaran (
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
);

-- Tabel Asrama
CREATE TABLE asrama (
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
);

-- Tabel Penempatan Santri di Asrama
CREATE TABLE santri_asrama (
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
);

-- Tabel Penempatan Santri di Kelas
CREATE TABLE santri_kelas (
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
);

-- Tabel Absensi
CREATE TABLE absensi (
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
);

-- Tabel Nilai
CREATE TABLE nilai (
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
);

-- Tabel Tahfidz
CREATE TABLE tahfidz (
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
);

-- Tabel Surat Izin Keluar
CREATE TABLE surat_izin_keluar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomor_surat VARCHAR(50) UNIQUE NOT NULL,
    santri_id INT NOT NULL,
    jenis_izin ENUM('Sakit', 'Keperluan Keluarga', 'Urusan Penting', 'Lainnya') NOT NULL,
    tanggal_keluar DATE NOT NULL,
    tanggal_masuk DATE,
    jam_keluar TIME,
    jam_masuk TIME,
    tujuan TEXT,
    keperluan TEXT NOT NULL,
    penanggung_jawab VARCHAR(100),
    telepon_penanggung_jawab VARCHAR(20),
    status ENUM('Diajukan', 'Disetujui', 'Ditolak', 'Selesai') DEFAULT 'Diajukan',
    disetujui_oleh INT,
    catatan_persetujuan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    FOREIGN KEY (disetujui_oleh) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel Pelanggaran
CREATE TABLE pelanggaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    jenis_pelanggaran VARCHAR(200) NOT NULL,
    deskripsi TEXT NOT NULL,
    tanggal_pelanggaran DATE NOT NULL,
    sanksi TEXT,
    poin_pelanggaran INT DEFAULT 0,
    status ENUM('Ringan', 'Sedang', 'Berat') DEFAULT 'Ringan',
    dilaporkan_oleh INT,
    ditangani_oleh INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    FOREIGN KEY (dilaporkan_oleh) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (ditangani_oleh) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel Keuangan (SPP, Pembayaran)
CREATE TABLE keuangan (
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
);

-- Tabel PSB (Penerimaan Santri Baru)
CREATE TABLE psb (
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
);

-- Tabel Pendaftar PSB
CREATE TABLE pendaftar_psb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    psb_id INT NOT NULL,
    nomor_pendaftaran VARCHAR(50) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    alamat TEXT,
    telepon VARCHAR(20),
    asal_sekolah VARCHAR(100),
    nama_ayah VARCHAR(100),
    nama_ibu VARCHAR(100),
    pekerjaan_ayah VARCHAR(100),
    pekerjaan_ibu VARCHAR(100),
    penghasilan_orangtua ENUM('< 1 Juta', '1-3 Juta', '3-5 Juta', '> 5 Juta'),
    foto TEXT,
    berkas_pendukung TEXT,
    status ENUM('Daftar', 'Lulus Seleksi', 'Tidak Lulus', 'Diterima', 'Tidak Diterima') DEFAULT 'Daftar',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (psb_id) REFERENCES psb(id) ON DELETE CASCADE
);

-- Tabel Pengaturan Web
CREATE TABLE pengaturan_web (
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
);

-- Tabel Laporan (untuk generate laporan khusus)
CREATE TABLE laporan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jenis_laporan ENUM('Santri', 'Ustadz', 'Asrama', 'Keuangan', 'Absensi', 'Nilai', 'Tahfidz') NOT NULL,
    periode_dari DATE NOT NULL,
    periode_sampai DATE NOT NULL,
    filter_data JSON,
    data_laporan JSON,
    dibuat_oleh INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dibuat_oleh) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel Log Aktivitas (untuk audit trail)
CREATE TABLE log_aktivitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    aksi VARCHAR(100) NOT NULL,
    tabel_target VARCHAR(50),
    id_target INT,
    data_lama JSON,
    data_baru JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel Komunikasi (untuk komunikasi guru-santri)
CREATE TABLE komunikasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pengirim_id INT NOT NULL,
    penerima_id INT NOT NULL,
    judul VARCHAR(200) NOT NULL,
    pesan TEXT NOT NULL,
    tipe ENUM('Pribadi', 'Umum', 'Kelas', 'Pengumuman') DEFAULT 'Pribadi',
    kelas_id INT NULL,
    lampiran TEXT NULL,
    status ENUM('Terkirim', 'Dibaca', 'Dibalas') DEFAULT 'Terkirim',
    tanggal_baca TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pengirim_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (penerima_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE SET NULL
);

-- Tabel Pengumuman
CREATE TABLE pengumuman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    konten TEXT NOT NULL,
    prioritas ENUM('Rendah', 'Sedang', 'Tinggi', 'Urgent') DEFAULT 'Sedang',
    target_role ENUM('admin', 'pengajar', 'santri', 'all') DEFAULT 'all',
    kelas_id INT NULL,
    lampiran TEXT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    dibuat_oleh INT NOT NULL,
    status ENUM('Draft', 'Aktif', 'Nonaktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dibuat_oleh) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE SET NULL
);

-- Tabel Notifikasi Nilai (untuk pemberitahuan ketika ada nilai baru)
CREATE TABLE notifikasi_nilai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    nilai_id INT NOT NULL,
    pesan TEXT NOT NULL,
    status ENUM('Belum Dibaca', 'Sudah Dibaca') DEFAULT 'Belum Dibaca',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    FOREIGN KEY (nilai_id) REFERENCES nilai(id) ON DELETE CASCADE
);

-- File ini hanya berisi struktur database.
-- Untuk insert data, akses: http://localhost/web-pesantren/backend/setup_data.php
