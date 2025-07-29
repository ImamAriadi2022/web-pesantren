-- ======================================================================
-- QUERY PERBAIKAN DATABASE UNTUK WEB PESANTREN (KOMPATIBEL MYSQL)
-- ======================================================================

-- Perbaikan 1: Menambahkan kolom user_id ke tabel ustadz jika belum ada
SET @col_user_id := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ustadz' AND COLUMN_NAME = 'user_id'
);
SET @q_user_id := IF(@col_user_id = 0, 
  'ALTER TABLE ustadz ADD COLUMN user_id INT NOT NULL AFTER id', 
  'SELECT "Kolom user_id sudah ada"');
PREPARE stmt FROM @q_user_id;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Tambahkan index untuk user_id jika belum ada
SET @idx_user_id := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ustadz' AND INDEX_NAME = 'user_id'
);
SET @q_idx_user := IF(@idx_user_id = 0,
  'ALTER TABLE ustadz ADD INDEX user_id (user_id)',
  'SELECT "Index user_id sudah ada"');
PREPARE stmt FROM @q_idx_user;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Perbaikan 2: Menambahkan foreign key constraint user_id jika belum ada
-- (Tidak bisa pakai IF EXISTS, maka drop manual jika tahu nama FK-nya)
SET foreign_key_checks = 0;
-- Cek apakah foreign key ada
SET @fk_exists := (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'ustadz' AND CONSTRAINT_NAME = 'ustadz_ibfk_1'
);
-- Drop jika ada
SET @drop_fk := IF(@fk_exists > 0, 
  'ALTER TABLE ustadz DROP FOREIGN KEY ustadz_ibfk_1', 
  'SELECT "Foreign key tidak ditemukan"');
PREPARE stmt FROM @drop_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
-- Tambahkan FK baru
ALTER TABLE ustadz 
  ADD CONSTRAINT ustadz_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
SET foreign_key_checks = 1;

-- Perbaikan 3: Menambahkan kolom tanggal_bergabung jika belum ada
SET @col_tg := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ustadz' AND COLUMN_NAME = 'tanggal_bergabung'
);
SET @q_tg := IF(@col_tg = 0, 
  'ALTER TABLE ustadz ADD COLUMN tanggal_bergabung DATE DEFAULT NULL AFTER bidang_keahlian', 
  'SELECT "Kolom tanggal_bergabung sudah ada"');
PREPARE stmt FROM @q_tg;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Perbaikan 4: Tambah kolom bidang_keahlian jika belum ada
SET @col_bk := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ustadz' AND COLUMN_NAME = 'bidang_keahlian'
);
SET @q_bk := IF(@col_bk = 0, 
  'ALTER TABLE ustadz ADD COLUMN bidang_keahlian VARCHAR(100) DEFAULT NULL AFTER pendidikan_terakhir', 
  'SELECT "Kolom bidang_keahlian sudah ada"');
PREPARE stmt FROM @q_bk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Perbaikan 5: Tambah kolom tempat_lahir jika belum ada
SET @col_tl := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ustadz' AND COLUMN_NAME = 'tempat_lahir'
);
SET @q_tl := IF(@col_tl = 0, 
  'ALTER TABLE ustadz ADD COLUMN tempat_lahir VARCHAR(100) DEFAULT NULL AFTER jenis_kelamin', 
  'SELECT "Kolom tempat_lahir sudah ada"');
PREPARE stmt FROM @q_tl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Perbaikan 6: Tambah akun user untuk ustadz yang belum punya user_id
INSERT IGNORE INTO users (email, password, role) 
SELECT CONCAT('ustadz', u.id, '@pesantren.com'), 
  '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 
  'pengajar'
FROM ustadz u 
WHERE u.user_id IS NULL OR u.user_id = 0;

-- Update user_id di ustadz
UPDATE ustadz u 
SET user_id = (
  SELECT id FROM users us 
  WHERE us.email = CONCAT('ustadz', u.id, '@pesantren.com') 
  LIMIT 1
) 
WHERE u.user_id IS NULL OR u.user_id = 0;

-- Perbaikan 7: Perbarui enum status surat_izin_keluar
ALTER TABLE surat_izin_keluar 
MODIFY COLUMN status ENUM('Diajukan','Disetujui','Ditolak','Selesai') DEFAULT 'Diajukan';

-- Perbaikan 8: Pastikan password user sudah ter-hash (panjang >= 60)
UPDATE users 
SET password = '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.' 
WHERE LENGTH(password) < 60 AND password != '';

-- Perbaikan 9: Isi tanggal_masuk santri jika null
UPDATE santri 
SET tanggal_masuk = COALESCE(tanggal_masuk, created_at, CURDATE()) 
WHERE tanggal_masuk IS NULL;

-- Perbaikan 10: Isi tanggal_bergabung ustadz jika null
UPDATE ustadz 
SET tanggal_bergabung = COALESCE(tanggal_bergabung, tanggal_masuk, created_at, CURDATE()) 
WHERE tanggal_bergabung IS NULL;

-- Perbaikan 11: Tambah index manual (hanya jika belum ada)
-- (nama index disamakan agar mudah cek)
-- santri.nama
SET @idx1 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'santri' AND INDEX_NAME = 'idx_nama');
SET @q_idx1 := IF(@idx1 = 0, 
  'ALTER TABLE santri ADD INDEX idx_nama (nama)', 
  'SELECT "Index idx_nama sudah ada"');
PREPARE stmt FROM @q_idx1;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- santri.status
SET @idx2 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'santri' AND INDEX_NAME = 'idx_status');
SET @q_idx2 := IF(@idx2 = 0, 
  'ALTER TABLE santri ADD INDEX idx_status (status)', 
  'SELECT "Index idx_status sudah ada"');
PREPARE stmt FROM @q_idx2;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ustadz.nama
SET @idx3 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ustadz' AND INDEX_NAME = 'idx_nama');
SET @q_idx3 := IF(@idx3 = 0, 
  'ALTER TABLE ustadz ADD INDEX idx_nama (nama)', 
  'SELECT "Index idx_nama sudah ada"');
PREPARE stmt FROM @q_idx3;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ustadz.status
SET @idx4 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ustadz' AND INDEX_NAME = 'idx_status');
SET @q_idx4 := IF(@idx4 = 0, 
  'ALTER TABLE ustadz ADD INDEX idx_status (status)', 
  'SELECT "Index idx_status sudah ada"');
PREPARE stmt FROM @q_idx4;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- mata_pelajaran.nama_mapel
SET @idx5 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'mata_pelajaran' AND INDEX_NAME = 'idx_nama_mapel');
SET @q_idx5 := IF(@idx5 = 0, 
  'ALTER TABLE mata_pelajaran ADD INDEX idx_nama_mapel (nama_mapel)', 
  'SELECT "Index idx_nama_mapel sudah ada"');
PREPARE stmt FROM @q_idx5;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- asrama.nama_asrama
SET @idx6 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'asrama' AND INDEX_NAME = 'idx_nama_asrama');
SET @q_idx6 := IF(@idx6 = 0, 
  'ALTER TABLE asrama ADD INDEX idx_nama_asrama (nama_asrama)', 
  'SELECT "Index idx_nama_asrama sudah ada"');
PREPARE stmt FROM @q_idx6;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Perbaikan 12: Hapus data santri/ustadz dengan user_id tidak valid
DELETE FROM santri WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM ustadz WHERE user_id NOT IN (SELECT id FROM users);

-- Perbaikan 13: Sinkronisasi role user
UPDATE users u 
INNER JOIN santri s ON u.id = s.user_id 
SET u.role = 'santri' 
WHERE u.role != 'santri';

UPDATE users u 
INNER JOIN ustadz us ON u.id = us.user_id 
SET u.role = 'pengajar' 
WHERE u.role != 'pengajar';

-- Perbaikan 14: Set ulang auto_increment jika diperlukan
ALTER TABLE surat_izin_keluar AUTO_INCREMENT = 1;

-- ======================================================================
-- VERIFIKASI PERBAIKAN
-- ======================================================================

-- Ustadz tanpa user_id
SELECT 'Ustadz tanpa user_id' AS check_name, COUNT(*) AS count 
FROM ustadz WHERE user_id IS NULL OR user_id = 0;

-- Santri dengan user_id tidak valid
SELECT 'Santri dengan user_id tidak valid' AS check_name, COUNT(*) AS count 
FROM santri s LEFT JOIN users u ON s.user_id = u.id WHERE u.id IS NULL;

-- Konsistensi role
SELECT 'Users dengan role tidak sesuai' AS check_name, COUNT(*) AS count
FROM users u 
LEFT JOIN santri s ON u.id = s.user_id 
LEFT JOIN ustadz us ON u.id = us.user_id 
WHERE (s.id IS NOT NULL AND u.role != 'santri') 
   OR (us.id IS NOT NULL AND u.role != 'pengajar')
   OR (s.id IS NULL AND us.id IS NULL AND u.role NOT IN ('admin'));

-- Password yang belum ter-hash
SELECT 'Password yang belum ter-hash' AS check_name, COUNT(*) AS count 
FROM users WHERE LENGTH(password) < 60;
