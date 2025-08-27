-- Tambahan untuk tabel asrama di schema_clean.sql

-- Tabel asrama
CREATE TABLE IF NOT EXISTS asrama (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_asrama VARCHAR(100) NOT NULL,
    kode_asrama VARCHAR(20) NOT NULL UNIQUE,
    kapasitas INT NOT NULL DEFAULT 0,
    lokasi VARCHAR(255),
    jenis ENUM('Putra', 'Putri') NOT NULL,
    penanggung_jawab VARCHAR(100),
    fasilitas TEXT,
    status ENUM('Aktif', 'Tidak Aktif', 'Renovasi') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel santri_asrama untuk relasi many-to-many antara santri dan asrama
CREATE TABLE IF NOT EXISTS santri_asrama (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    asrama_id INT NOT NULL,
    tanggal_masuk DATE NOT NULL,
    tanggal_keluar DATE NULL,
    status ENUM('Aktif', 'Pindah', 'Keluar') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    FOREIGN KEY (asrama_id) REFERENCES asrama(id) ON DELETE CASCADE,
    UNIQUE KEY unique_santri_asrama_aktif (santri_id, asrama_id, status)
);

-- Index untuk performa
CREATE INDEX idx_santri_asrama_santri ON santri_asrama(santri_id);
CREATE INDEX idx_santri_asrama_asrama ON santri_asrama(asrama_id);
CREATE INDEX idx_santri_asrama_status ON santri_asrama(status);
