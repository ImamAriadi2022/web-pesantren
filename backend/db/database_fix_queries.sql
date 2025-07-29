-- ======================================================================
-- QUERY PERBAIKAN DATABASE UNTUK WEB PESANTREN
-- File ini berisi query untuk memperbaiki masalah-masalah yang ditemukan
-- ======================================================================

-- Perbaikan 1: Menambahkan kolom user_id ke tabel ustadz yang hilang
-- (Seharusnya sudah ada tapi untuk memastikan konsistensi)
ALTER TABLE `ustadz` 
ADD COLUMN IF NOT EXISTS `user_id` int NOT NULL AFTER `id`,
ADD INDEX IF NOT EXISTS `user_id` (`user_id`);

-- Perbaikan 2: Memastikan foreign key constraint untuk ustadz.user_id
-- (Menghapus yang lama jika ada, lalu tambah yang baru)
SET foreign_key_checks = 0;
ALTER TABLE `ustadz` DROP FOREIGN KEY IF EXISTS `ustadz_ibfk_1`;
ALTER TABLE `ustadz` ADD CONSTRAINT `ustadz_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
SET foreign_key_checks = 1;

-- Perbaikan 3: Memastikan kolom tanggal_bergabung ada di tabel ustadz
ALTER TABLE `ustadz` 
ADD COLUMN IF NOT EXISTS `tanggal_bergabung` date DEFAULT NULL AFTER `bidang_keahlian`;

-- Perbaikan 4: Menambahkan kolom bidang_keahlian jika belum ada
ALTER TABLE `ustadz` 
ADD COLUMN IF NOT EXISTS `bidang_keahlian` varchar(100) DEFAULT NULL AFTER `pendidikan_terakhir`;

-- Perbaikan 5: Memastikan kolom tempat_lahir ada di tabel ustadz
ALTER TABLE `ustadz` 
ADD COLUMN IF NOT EXISTS `tempat_lahir` varchar(100) DEFAULT NULL AFTER `jenis_kelamin`;

-- Perbaikan 6: Update data ustadz yang belum memiliki user_id
-- (Membuat user account untuk ustadz yang belum punya)
INSERT IGNORE INTO users (email, password, role) 
SELECT CONCAT('ustadz', u.id, '@pesantren.com'), '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.', 'pengajar'
FROM ustadz u 
WHERE u.user_id IS NULL OR u.user_id = 0;

-- Update user_id untuk ustadz yang belum memiliki user_id
UPDATE ustadz u 
SET user_id = (
    SELECT us.id FROM users us 
    WHERE us.email = CONCAT('ustadz', u.id, '@pesantren.com') 
    LIMIT 1
) 
WHERE u.user_id IS NULL OR u.user_id = 0;

-- Perbaikan 7: Memastikan enum status surat izin konsisten
ALTER TABLE `surat_izin_keluar` 
MODIFY COLUMN `status` enum('Diajukan','Disetujui','Ditolak','Selesai') DEFAULT 'Diajukan';

-- Perbaikan 8: Memastikan semua password di users table ter-hash dengan benar
-- (Update password yang masih plain text jika ada)
UPDATE users 
SET password = '$2y$10$Qp9hpZHDOoH1qBxFqPphCuJWhAfrYGK7gLvl5gmtk1EKGVngTAEe.' 
WHERE LENGTH(password) < 60 AND password != '';

-- Perbaikan 9: Memastikan data tanggal_masuk santri tidak null
UPDATE santri 
SET tanggal_masuk = COALESCE(tanggal_masuk, created_at, CURDATE()) 
WHERE tanggal_masuk IS NULL;

-- Perbaikan 10: Memastikan data tanggal_bergabung ustadz tidak null
UPDATE ustadz 
SET tanggal_bergabung = COALESCE(tanggal_bergabung, tanggal_masuk, created_at, CURDATE()) 
WHERE tanggal_bergabung IS NULL;

-- Perbaikan 11: Menambahkan index untuk performa yang lebih baik
ALTER TABLE `santri` ADD INDEX IF NOT EXISTS `idx_nama` (`nama`);
ALTER TABLE `santri` ADD INDEX IF NOT EXISTS `idx_status` (`status`);
ALTER TABLE `ustadz` ADD INDEX IF NOT EXISTS `idx_nama` (`nama`);
ALTER TABLE `ustadz` ADD INDEX IF NOT EXISTS `idx_status` (`status`);
ALTER TABLE `mata_pelajaran` ADD INDEX IF NOT EXISTS `idx_nama_mapel` (`nama_mapel`);
ALTER TABLE `asrama` ADD INDEX IF NOT EXISTS `idx_nama_asrama` (`nama_asrama`);

-- Perbaikan 12: Membersihkan data yang tidak konsisten
-- Menghapus data santri yang tidak memiliki user_id yang valid
DELETE FROM santri WHERE user_id NOT IN (SELECT id FROM users);

-- Menghapus data ustadz yang tidak memiliki user_id yang valid
DELETE FROM ustadz WHERE user_id NOT IN (SELECT id FROM users);

-- Perbaikan 13: Memastikan konsistensi role di tabel users
UPDATE users u 
INNER JOIN santri s ON u.id = s.user_id 
SET u.role = 'santri' 
WHERE u.role != 'santri';

UPDATE users u 
INNER JOIN ustadz us ON u.id = us.user_id 
SET u.role = 'pengajar' 
WHERE u.role != 'pengajar';

-- Perbaikan 14: Menambahkan auto increment yang terlewat
ALTER TABLE `surat_izin_keluar` AUTO_INCREMENT = 1;

-- ======================================================================
-- QUERY VERIFIKASI - Jalankan untuk memastikan perbaikan berhasil
-- ======================================================================

-- Verifikasi 1: Cek apakah semua ustadz memiliki user_id
SELECT 'Ustadz tanpa user_id' as check_name, COUNT(*) as count 
FROM ustadz WHERE user_id IS NULL OR user_id = 0;

-- Verifikasi 2: Cek apakah semua santri memiliki user_id yang valid
SELECT 'Santri dengan user_id tidak valid' as check_name, COUNT(*) as count 
FROM santri s LEFT JOIN users u ON s.user_id = u.id WHERE u.id IS NULL;

-- Verifikasi 3: Cek konsistensi role
SELECT 'Users dengan role tidak sesuai' as check_name, COUNT(*) as count
FROM users u 
LEFT JOIN santri s ON u.id = s.user_id 
LEFT JOIN ustadz us ON u.id = us.user_id 
WHERE (s.id IS NOT NULL AND u.role != 'santri') 
   OR (us.id IS NOT NULL AND u.role != 'pengajar')
   OR (s.id IS NULL AND us.id IS NULL AND u.role NOT IN ('admin'));

-- Verifikasi 4: Cek password yang ter-hash dengan benar
SELECT 'Password yang belum ter-hash' as check_name, COUNT(*) as count 
FROM users WHERE LENGTH(password) < 60;

-- ======================================================================
-- CATATAN PENTING:
-- 1. Backup database sebelum menjalankan query ini
-- 2. Jalankan query satu per satu untuk memastikan tidak ada error
-- 3. Verifikasi hasil dengan query verifikasi di bagian akhir
-- ======================================================================