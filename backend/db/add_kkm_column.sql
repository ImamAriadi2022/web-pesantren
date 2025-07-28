-- Script untuk menambahkan kolom KKM ke tabel nilai (kompatibel dengan MySQL)
-- Jalankan script ini di database MySQL

-- Cek apakah kolom kkm sudah ada
SET @kkm_exists := (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'nilai' 
      AND COLUMN_NAME = 'kkm'
);

-- Siapkan perintah ALTER TABLE hanya jika kolom belum ada
SET @alter_sql := IF(@kkm_exists = 0, 
    'ALTER TABLE nilai ADD COLUMN kkm INT DEFAULT 75 AFTER nilai;', 
    'SELECT "Kolom kkm sudah ada, tidak perlu ditambahkan." as status;'
);

-- Jalankan perintah ALTER TABLE atau pemberitahuan
PREPARE stmt FROM @alter_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update data yang sudah ada dengan nilai KKM dari tabel mata_pelajaran
UPDATE nilai n 
JOIN mata_pelajaran mp ON n.mapel_id = mp.id 
SET n.kkm = mp.kkm 
WHERE n.kkm IS NULL OR n.kkm = 0;

-- Tampilkan status akhir
SELECT 'Kolom KKM berhasil dipastikan ada dan data telah diperbarui' AS status;
