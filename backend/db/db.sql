CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pengajar', 'siswa') NOT NULL
);

-- ini buat inssert
-- INSERT INTO users (email, password, role) VALUES
-- ('admin@example.com', PASSWORD('password123'), 'admin'),
-- ('pengajar@example.com', PASSWORD('password123'), 'pengajar'),
-- ('siswa@example.com', PASSWORD('password123'), 'siswa');


CREATE TABLE pengaturan_web (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul_web VARCHAR(255),
    tagline_web VARCHAR(255),
    caption_web TEXT,
    tentang_web TEXT,
    footer_web TEXT,
    logo_web TEXT,
    nama_instansi VARCHAR(255),
    nama_pimpinan VARCHAR(255),
    nik_pimpinan VARCHAR(50),
    alamat_instansi TEXT,
    email_instansi VARCHAR(255),
    telp VARCHAR(20),
    whatsapp VARCHAR(20),
    psb_pdf TEXT
);