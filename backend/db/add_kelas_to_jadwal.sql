-- Add kelas_id column to jadwal_pelajaran table
ALTER TABLE jadwal_pelajaran 
ADD COLUMN kelas_id INT AFTER ustadz_id,
ADD FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE;

-- Update existing jadwal records with sample kelas_id (assuming we have kelas with id 1-3)
UPDATE jadwal_pelajaran SET kelas_id = 1 WHERE id BETWEEN 1 AND 8;
UPDATE jadwal_pelajaran SET kelas_id = 2 WHERE id BETWEEN 9 AND 16;
UPDATE jadwal_pelajaran SET kelas_id = 3 WHERE id BETWEEN 17 AND 26;
