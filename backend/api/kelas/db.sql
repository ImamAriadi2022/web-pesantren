
CREATE TABLE kelas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_kelas VARCHAR(20) UNIQUE,
    nama_kelas VARCHAR(100),
    keterangan VARCHAR(255)
);

