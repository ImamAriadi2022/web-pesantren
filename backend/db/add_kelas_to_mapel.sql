-- Add kelas_id column to mata_pelajaran table
ALTER TABLE mata_pelajaran 
ADD COLUMN kelas_id INT AFTER nama_mapel,
ADD FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE SET NULL;

-- Update existing mata pelajaran with sample kelas_id (optional - can be NULL for general subjects)
-- Note: kelas_id can be NULL for subjects that apply to all classes
