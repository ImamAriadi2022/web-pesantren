CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pengajar', 'siswa') NOT NULL
);

-- ini buat inssert
INSERT INTO users (email, password, role) VALUES
('admin@example.com', PASSWORD('password123'), 'admin'),
('pengajar@example.com', PASSWORD('password123'), 'pengajar'),
('siswa@example.com', PASSWORD('password123'), 'siswa');
