-- Tabel untuk data pendaftar PSB (Penerimaan Santri Baru)

CREATE TABLE IF NOT EXISTS pendaftar_psb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    tempat_lahir VARCHAR(50) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    alamat TEXT NOT NULL,
    nama_ayah VARCHAR(100),
    nama_ibu VARCHAR(100),
    pekerjaan_ayah VARCHAR(100),
    pekerjaan_ibu VARCHAR(100),
    no_hp_wali VARCHAR(20) NOT NULL,
    email_wali VARCHAR(100),
    asal_sekolah VARCHAR(100),
    kelas_tujuan VARCHAR(50),
    berkas_pendukung TEXT, -- JSON untuk menyimpan info berkas yang diupload
    status_pendaftaran ENUM('Baru', 'Diproses', 'Diterima', 'Ditolak') DEFAULT 'Baru',
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    catatan_admin TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX idx_pendaftar_psb_status ON pendaftar_psb(status_pendaftaran);
CREATE INDEX idx_pendaftar_psb_tanggal ON pendaftar_psb(tanggal_daftar);
CREATE INDEX idx_pendaftar_psb_nama ON pendaftar_psb(nama_lengkap);
