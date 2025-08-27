-- Schema Database Web Pesantren (Clean Version)
-- Tanpa data dummy, hanya struktur tabel

-- Database: web_pesantren
CREATE DATABASE IF NOT EXISTS web_pesantren;
USE web_pesantren;

-- Tabel kelas
CREATE TABLE IF NOT EXISTS kelas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kelas VARCHAR(100) NOT NULL,
    kode_kelas VARCHAR(20) NOT NULL UNIQUE,
    kapasitas INT DEFAULT 30,
    status ENUM('Aktif', 'Tidak Aktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel santri (removed email, added kelas_id)
CREATE TABLE IF NOT EXISTS santri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nis VARCHAR(20) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    kelas_id INT,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    alamat TEXT,
    no_hp VARCHAR(20),
    nama_wali VARCHAR(100),
    no_hp_wali VARCHAR(20),
    foto VARCHAR(255),
    status ENUM('Aktif', 'Tidak Aktif', 'Alumni') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE SET NULL
);

-- Tabel ustadz (removed email)
CREATE TABLE IF NOT EXISTS ustadz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nip VARCHAR(20) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    alamat TEXT,
    no_hp VARCHAR(20),
    pendidikan_terakhir VARCHAR(100),
    mata_pelajaran VARCHAR(255),
    foto VARCHAR(255),
    status ENUM('Aktif', 'Tidak Aktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel mata_pelajaran (removed SKS, KKM, kategori, changed deskripsi to keterangan)
CREATE TABLE IF NOT EXISTS mata_pelajaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mapel VARCHAR(20) NOT NULL UNIQUE,
    nama_mapel VARCHAR(100) NOT NULL,
    keterangan TEXT,
    status ENUM('Aktif', 'Tidak Aktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel jadwal_pelajaran (removed kelas_id, status, semester, tahun_ajaran)
CREATE TABLE IF NOT EXISTS jadwal_pelajaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mapel_id INT NOT NULL,
    ustadz_id INT NOT NULL,
    hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruangan VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
    FOREIGN KEY (ustadz_id) REFERENCES ustadz(id) ON DELETE CASCADE
);

-- Tabel nilai (removed KKM, bobot, tahun_ajaran, keterangan)
CREATE TABLE IF NOT EXISTS nilai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    mapel_id INT NOT NULL,
    jenis_nilai ENUM('UTS', 'UAS', 'Tugas', 'Quiz', 'Praktek') NOT NULL,
    nilai DECIMAL(5,2) NOT NULL,
    semester ENUM('Ganjil', 'Genap') NOT NULL,
    dibuat_oleh INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE
);

-- Tabel users (using username instead of email)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    role ENUM('Admin', 'Ustadz', 'Santri') NOT NULL,
    status ENUM('Aktif', 'Tidak Aktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel surat_izin_keluar (removed status)
CREATE TABLE IF NOT EXISTS surat_izin_keluar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    tanggal_keluar DATE NOT NULL,
    jam_keluar TIME NOT NULL,
    tanggal_kembali DATE NOT NULL,
    jam_kembali TIME NOT NULL,
    keperluan TEXT NOT NULL,
    alamat_tujuan TEXT NOT NULL,
    nama_penjemput VARCHAR(100),
    no_hp_penjemput VARCHAR(20),
    disetujui_oleh INT,
    tanggal_disetujui TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    FOREIGN KEY (disetujui_oleh) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel notifikasi_nilai (updated for simplified structure)
CREATE TABLE IF NOT EXISTS notifikasi_nilai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    nilai_id INT NOT NULL,
    pesan TEXT NOT NULL,
    dibaca TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    FOREIGN KEY (nilai_id) REFERENCES nilai(id) ON DELETE CASCADE
);

-- Tabel pengaturan
CREATE TABLE IF NOT EXISTS pengaturan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_setting VARCHAR(100) NOT NULL UNIQUE,
    nilai_setting TEXT,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_santri_kelas ON santri(kelas_id);
CREATE INDEX idx_santri_status ON santri(status);
CREATE INDEX idx_jadwal_hari ON jadwal_pelajaran(hari);
CREATE INDEX idx_jadwal_ustadz ON jadwal_pelajaran(ustadz_id);
CREATE INDEX idx_nilai_santri ON nilai(santri_id);
CREATE INDEX idx_nilai_mapel ON nilai(mapel_id);
CREATE INDEX idx_notifikasi_santri ON notifikasi_nilai(santri_id);
