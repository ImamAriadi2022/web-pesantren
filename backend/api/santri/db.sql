CREATE TABLE santri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    foto TEXT,
    nama VARCHAR(100) NOT NULL,
    nis VARCHAR(30) NOT NULL UNIQUE,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    asal_sekolah VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);