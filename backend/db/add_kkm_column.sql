-- Script untuk menambahkan kolom KKM ke tabel nilai
-- Jalankan script ini di database MySQL

-- Tambahkan kolom KKM ke tabel nilai jika belum ada
ALTER TABLE nilai ADD COLUMN IF NOT EXISTS kkm INT DEFAULT 75 AFTER nilai;

-- Update data yang sudah ada dengan KKM dari mata_pelajaran
UPDATE nilai n 
JOIN mata_pelajaran mp ON n.mapel_id = mp.id 
SET n.kkm = mp.kkm 
WHERE n.kkm IS NULL OR n.kkm = 0;

-- Tampilkan hasil
SELECT 'Kolom KKM berhasil ditambahkan ke tabel nilai' as status;