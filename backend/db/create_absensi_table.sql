-- Script untuk membuat tabel absensi
-- Sesuai dengan schema sistem yang ada dan API yang sudah dibuat

USE web_pesantren;

-- Tabel absensi
CREATE TABLE IF NOT EXISTS absensi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    tanggal DATE NOT NULL,
    status ENUM('Hadir', 'Izin', 'Sakit', 'Alpha') NOT NULL,
    keterangan TEXT,
    dibuat_oleh INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    UNIQUE KEY unique_santri_tanggal (santri_id, tanggal)
);

-- Insert sample data for testing
INSERT INTO absensi (santri_id, tanggal, status, keterangan, dibuat_oleh) VALUES
(1, '2025-08-27', 'Hadir', '', 1),
(1, '2025-08-26', 'Hadir', '', 1),
(1, '2025-08-25', 'Izin', 'Sakit demam', 1),
(2, '2025-08-27', 'Hadir', '', 1),
(2, '2025-08-26', 'Alpha', 'Tanpa keterangan', 1),
(2, '2025-08-25', 'Hadir', '', 1),
(3, '2025-08-27', 'Sakit', 'Demam tinggi', 1),
(3, '2025-08-26', 'Hadir', '', 1),
(3, '2025-08-25', 'Hadir', '', 1),
(4, '2025-08-27', 'Hadir', '', 1),
(4, '2025-08-26', 'Hadir', '', 1),
(4, '2025-08-25', 'Izin', 'Keperluan keluarga', 1),
(5, '2025-08-27', 'Hadir', '', 1),
(5, '2025-08-26', 'Hadir', '', 1),
(5, '2025-08-25', 'Hadir', '', 1);

-- Create index for better performance
CREATE INDEX idx_absensi_santri ON absensi(santri_id);
CREATE INDEX idx_absensi_tanggal ON absensi(tanggal);
CREATE INDEX idx_absensi_status ON absensi(status);
