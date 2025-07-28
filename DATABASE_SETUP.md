# 🔧 **Panduan Setup Database**

## 📋 **Daftar Isi**
- [Overview Database](#overview-database)
- [Instalasi Database](#instalasi-database)
- [Struktur Tabel](#struktur-tabel)
- [Data Sample](#data-sample)
- [Maintenance](#maintenance)

## 📊 **Overview Database**

Database `web_pesantren` menggunakan MySQL 8.0+ dengan 18+ tabel yang saling terintegrasi untuk mendukung seluruh fitur sistem pesantren.

### **Fitur Database**
- ✅ **Foreign Key Constraints** untuk integritas data
- ✅ **ENUM Types** untuk validasi data
- ✅ **JSON Fields** untuk data fleksibel
- ✅ **Timestamps** otomatis
- ✅ **Unique Constraints** untuk mencegah duplikasi
- ✅ **Indexing** untuk performa optimal

## 🚀 **Instalasi Database**

### **1. Buat Database**
```sql
CREATE DATABASE web_pesantren CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE web_pesantren;
```

### **2. Import Schema**
```bash
# Via phpMyAdmin
1. Buka phpMyAdmin
2. Pilih database 'web_pesantren'
3. Tab Import → Choose File
4. Pilih file: backend/db/db.sql
5. Klik Go

# Via Command Line
mysql -u root -p web_pesantren < backend/db/db.sql
```

### **3. Setup User Database (Optional)**
```sql
-- Buat user khusus untuk aplikasi
CREATE USER 'pesantren_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON web_pesantren.* TO 'pesantren_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📋 **Struktur Tabel**

### **👤 Core Authentication**
```sql
-- Tabel Users (Login System)
users
├── id (PK)
├── email (UNIQUE)
├── password (HASHED)
├── role (admin/pengajar/santri)
├── status (active/inactive)
└── timestamps
```

### **🎓 Academic Management**

#### **Santri (Students)**
```sql
santri
├── id (PK)
├── user_id (FK → users.id)
├── nama, nis (UNIQUE)
├── jenis_kelamin, tanggal_lahir
├── alamat, telepon
├── nama_wali, no_hp_wali
├── pekerjaan_wali, alamat_wali
├── status (Aktif/Nonaktif/Lulus/Keluar)
└── timestamps
```

#### **Ustadz (Teachers)**
```sql
ustadz
├── id (PK)
├── user_id (FK → users.id)
├── nama, nik (UNIQUE)
├── jenis_kelamin, tempat_lahir, tanggal_lahir
├── alamat, telepon, email
├── pendidikan_terakhir, bidang_keahlian
├── tanggal_bergabung, tanggal_masuk
├── status (Aktif/Nonaktif)
└── timestamps
```

#### **Mata Pelajaran**
```sql
mata_pelajaran
├── id (PK)
├── kode_mapel (UNIQUE), nama_mapel
├── deskripsi, sks
├── kkm (Kriteria Ketuntasan Minimal) ⭐ NEW
├── kategori (Umum/Agama/Tahfidz/Keterampilan)
├── status (Aktif/Nonaktif)
└── timestamps
```

#### **Kelas**
```sql
kelas
├── id (PK)
├── kode_kelas (UNIQUE), nama_kelas
├── tingkat (1-6)
├── wali_kelas_id (FK → ustadz.id)
├── kapasitas, keterangan
├── status (Aktif/Nonaktif)
└── timestamps
```

### **📅 Scheduling System**

#### **Jadwal Pelajaran**
```sql
jadwal_pelajaran
├── id (PK)
├── kelas_id (FK → kelas.id)
├── mapel_id (FK → mata_pelajaran.id)
├── ustadz_id (FK → ustadz.id)
├── hari (Senin-Minggu)
├── jam_mulai, jam_selesai
├── ruangan, tahun_ajaran, semester
├── status (Aktif/Nonaktif)
└── timestamps

-- ⚠️ Constraint: Deteksi konflik jadwal otomatis
```

### **📊 Assessment System**

#### **Nilai**
```sql
nilai
├── id (PK)
├── santri_id (FK → santri.id)
├── mapel_id (FK → mata_pelajaran.id)
├── jenis_nilai (Tugas/UTS/UAS/Praktik/Hafalan)
├── nilai (DECIMAL 5,2)
├── bobot (DECIMAL 3,2)
├── keterangan, tahun_ajaran, semester
├── dibuat_oleh (FK → users.id)
└── timestamps

-- 🔔 Auto-trigger: Notifikasi saat input nilai baru
```

#### **Absensi**
```sql
absensi
├── id (PK)
├── santri_id (FK → santri.id)
├── tanggal (DATE)
├── status (Hadir/Izin/Sakit/Alpha)
├── keterangan
├── dibuat_oleh (FK → users.id)
└── timestamps

-- 🔒 Constraint: UNIQUE per santri per tanggal
```

### **💬 Communication System ⭐ NEW**

#### **Komunikasi**
```sql
komunikasi
├── id (PK)
├── pengirim_id (FK → users.id)
├── penerima_id (FK → users.id)
├── judul, pesan
├── tipe (Pribadi/Umum/Kelas/Pengumuman)
├── kelas_id (FK → kelas.id) [nullable]
├── lampiran [nullable]
├── status (Terkirim/Dibaca/Dibalas)
├── tanggal_baca [nullable]
└── timestamps
```

#### **Pengumuman**
```sql
pengumuman
├── id (PK)
├── judul, konten
├── prioritas (Rendah/Sedang/Tinggi/Urgent)
├── target_role (admin/pengajar/santri/all)
├── kelas_id (FK → kelas.id) [nullable]
├── lampiran [nullable]
├── tanggal_mulai, tanggal_selesai
├── dibuat_oleh (FK → users.id)
├── status (Draft/Aktif/Nonaktif)
└── timestamps
```

#### **Notifikasi Nilai ⭐ NEW**
```sql
notifikasi_nilai
├── id (PK)
├── santri_id (FK → santri.id)
├── nilai_id (FK → nilai.id)
├── pesan (TEXT)
├── status (Belum Dibaca/Sudah Dibaca)
└── timestamps

-- 🤖 Auto-generated saat ada nilai baru
```

### **🏠 Dormitory Management**

#### **Asrama**
```sql
asrama
├── id (PK)
├── nama_asrama, kode_asrama (UNIQUE)
├── kapasitas, lokasi
├── jenis (Putra/Putri)
├── penanggung_jawab_id (FK → ustadz.id)
├── fasilitas
├── status (Aktif/Nonaktif)
└── timestamps
```

#### **Santri Asrama**
```sql
santri_asrama
├── id (PK)
├── santri_id (FK → santri.id)
├── asrama_id (FK → asrama.id)
├── nomor_kamar
├── tanggal_masuk, tanggal_keluar [nullable]
├── status (Aktif/Pindah/Keluar)
└── timestamps
```

### **💰 Financial Management**

#### **Keuangan**
```sql
keuangan
├── id (PK)
├── santri_id (FK → santri.id) [nullable]
├── kode_transaksi (UNIQUE)
├── jenis_transaksi (Pemasukan/Pengeluaran)
├── kategori (SPP/Daftar Ulang/Seragam/Makan/Asrama/Lainnya)
├── jumlah (DECIMAL 15,2)
├── tanggal_transaksi
├── metode_pembayaran (Tunai/Transfer/Debit/Kredit)
├── keterangan, bukti_pembayaran
├── status (Pending/Berhasil/Gagal)
├── diproses_oleh (FK → users.id)
└── timestamps
```

### **📝 Additional Systems**

#### **Tahfidz (Quranic Memorization)**
```sql
tahfidz
├── id (PK)
├── santri_id (FK → santri.id)
├── surat, ayat_mulai, ayat_selesai
├── tanggal_mulai, tanggal_selesai, target_selesai
├── status (Belum Mulai/Sedang Hafalan/Selesai/Revisi)
├── nilai_hafalan (A/B/C/D/E)
├── keterangan
├── pembimbing_id (FK → ustadz.id)
└── timestamps
```

#### **Surat Izin Keluar**
```sql
surat_izin_keluar
├── id (PK)
├── nomor_surat (UNIQUE)
├── santri_id (FK → santri.id)
├── jenis_izin (Sakit/Keperluan Keluarga/Urusan Penting/Lainnya)
├── tanggal_keluar, tanggal_masuk
├── jam_keluar, jam_masuk
├── tujuan, keperluan
├── penanggung_jawab, telepon_penanggung_jawab
├── status (Diajukan/Disetujui/Ditolak/Selesai)
├── disetujui_oleh (FK → users.id)
├── catatan_persetujuan
└── timestamps
```

## 📋 **Data Sample**

### **🚀 Auto Data Generator (Recommended)**

**URL Generator**: `http://localhost/web-pesantren/backend/setup_data.php`

**One-Click Setup**:
```
✅ 14 User accounts (admin/pengajar/santri)
✅ 10 Mata pelajaran with KKM
✅ 6 Kelas dengan wali kelas
✅ 4 Asrama (putra/putri)
✅ 8 Santri dengan data lengkap
✅ 30+ Jadwal pelajaran
✅ Sample nilai dan absensi
✅ Tahfidz progress data
```

**Default Login Credentials**:
```
Admin: admin@pesantren.com / admin
Pengajar: ustadz1@pesantren.com / admin
Santri: santri1@pesantren.com / admin
```

> 📖 **Panduan Lengkap**: Lihat [DATA_SETUP_GUIDE.md](DATA_SETUP_GUIDE.md) untuk dokumentasi detail setup data template.

### **Manual SQL Insert (Alternative)**

#### **Default Users**
```sql
-- Password hash untuk "admin"
SET @password_hash = '$2y$10$eImiTXuWVxfM37uY4JANjOehXOBQjVLpyG8ZDFE2QlbIE9MZJFAbi';

-- Admin
INSERT INTO users (email, password, role) VALUES 
('admin@pesantren.com', @password_hash, 'admin');

-- Pengajar
INSERT INTO users (email, password, role) VALUES 
('ustadz1@pesantren.com', @password_hash, 'pengajar'),
('ustadz2@pesantren.com', @password_hash, 'pengajar'),
('ustadzah1@pesantren.com', @password_hash, 'pengajar');

-- Santri
INSERT INTO users (email, password, role) VALUES 
('santri1@pesantren.com', @password_hash, 'santri'),
('santri2@pesantren.com', @password_hash, 'santri'),
('santri3@pesantren.com', @password_hash, 'santri');
```

#### **Sample Mata Pelajaran dengan KKM**
```sql
INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, deskripsi, kkm, kategori, status) VALUES 
('AQD001', 'Akidah', 'Pelajaran dasar tentang keimanan Islam', 75, 'Agama', 'Aktif'),
('FIQ001', 'Fiqh', 'Pelajaran tentang hukum-hukum Islam', 75, 'Agama', 'Aktif'),
('THF001', 'Tahfidz Quran', 'Menghafal Al-Quran', 80, 'Tahfidz', 'Aktif'),
('HDT001', 'Hadits', 'Pelajaran tentang hadits Nabi SAW', 75, 'Agama', 'Aktif'),
('TFS001', 'Tafsir', 'Pelajaran tentang tafsir Al-Quran', 75, 'Agama', 'Aktif'),
('MTK001', 'Matematika', 'Pelajaran Matematika dasar', 70, 'Umum', 'Aktif'),
('IPA001', 'IPA Terpadu', 'Ilmu Pengetahuan Alam', 70, 'Umum', 'Aktif'),
('IPS001', 'IPS Terpadu', 'Ilmu Pengetahuan Sosial', 70, 'Umum', 'Aktif'),
('BIN001', 'Bahasa Indonesia', 'Bahasa Indonesia', 75, 'Umum', 'Aktif'),
('BAR001', 'Bahasa Arab', 'Bahasa Arab dasar', 70, 'Bahasa', 'Aktif');
```

#### **Sample Kelas**
```sql
INSERT INTO kelas (kode_kelas, nama_kelas, tingkat, wali_kelas_id, kapasitas, status) VALUES 
('K1A', 'Kelas 1 Alif', 1, 2, 25, 'Aktif'),
('K1B', 'Kelas 1 Ba', 1, 3, 25, 'Aktif'),
('K2A', 'Kelas 2 Alif', 2, 4, 30, 'Aktif'),
('K2B', 'Kelas 2 Ba', 2, 5, 30, 'Aktif'),
('K3A', 'Kelas 3 Alif', 3, 6, 25, 'Aktif'),
('K3B', 'Kelas 3 Ba', 3, 2, 25, 'Aktif');
```

#### **Sample Komunikasi**
```sql
-- Pesan pribadi pengajar ke santri
INSERT INTO komunikasi (pengirim_id, penerima_id, judul, pesan, tipe, status) VALUES 
(2, 7, 'Tugas Matematika', 'Silakan kerjakan tugas halaman 25-30', 'Pribadi', 'Terkirim'),
(3, 8, 'Reminder Hafalan', 'Jangan lupa hafalan surat Al-Fatihah besok', 'Pribadi', 'Terkirim');

-- Pengumuman untuk kelas
INSERT INTO komunikasi (pengirim_id, penerima_id, judul, pesan, tipe, kelas_id, status) VALUES 
(2, 0, 'Ujian Tengah Semester', 'UTS akan dilaksanakan minggu depan, silakan persiapkan diri', 'Kelas', 1, 'Terkirim'),
(3, 0, 'Libur Hari Raya', 'Pesantren libur selama 3 hari untuk perayaan Idul Fitri', 'Pengumuman', NULL, 'Terkirim');
```

#### **Sample Nilai dengan Auto-Notifikasi**
```sql
-- Insert nilai (akan auto-trigger notifikasi)
INSERT INTO nilai (santri_id, mapel_id, jenis_nilai, nilai, bobot, keterangan, tahun_ajaran, semester, dibuat_oleh) VALUES 
(1, 1, 'UTS', 85.5, 1.0, 'Ujian Tengah Semester Akidah', '2024/2025', 'Ganjil', 2),
(1, 1, 'UAS', 88.0, 1.0, 'Ujian Akhir Semester Akidah', '2024/2025', 'Ganjil', 2),
(1, 6, 'UTS', 78.5, 1.0, 'Ujian Tengah Semester Matematika', '2024/2025', 'Ganjil', 3),
(1, 6, 'Tugas', 82.0, 0.5, 'Tugas Harian Matematika', '2024/2025', 'Ganjil', 3);

-- Notifikasi akan otomatis dibuat di tabel notifikasi_nilai
```

## 🔧 **Maintenance Database**

### **Backup Database**
```bash
# Backup lengkap
mysqldump -u root -p web_pesantren > backup_pesantren_$(date +%Y%m%d).sql

# Backup hanya struktur
mysqldump -u root -p --no-data web_pesantren > schema_backup.sql

# Backup hanya data
mysqldump -u root -p --no-create-info web_pesantren > data_backup.sql
```

### **Restore Database**
```bash
# Restore dari backup
mysql -u root -p web_pesantren < backup_pesantren_20250714.sql
```

### **Optimasi Performa**
```sql
-- Analyze table untuk optimasi
ANALYZE TABLE santri, ustadz, nilai, komunikasi;

-- Check table integrity
CHECK TABLE santri, ustadz, nilai, komunikasi;

-- Repair table jika diperlukan
REPAIR TABLE table_name;

-- Optimize table
OPTIMIZE TABLE santri, ustadz, nilai, komunikasi;
```

### **Monitoring Database**
```sql
-- Ukuran database
SELECT 
    table_schema AS "Database",
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS "Size (MB)"
FROM information_schema.tables 
WHERE table_schema = 'web_pesantren'
GROUP BY table_schema;

-- Tabel terbesar
SELECT 
    table_name AS "Table",
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES 
WHERE table_schema = 'web_pesantren'
ORDER BY (data_length + index_length) DESC;

-- Statistik record per tabel
SELECT 
    table_name AS "Table",
    table_rows AS "Record Count"
FROM information_schema.tables
WHERE table_schema = 'web_pesantren'
ORDER BY table_rows DESC;
```

## 🛡️ **Security Best Practices**

### **User Privileges**
```sql
-- Buat user dengan privilege minimal
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON web_pesantren.* TO 'app_user'@'localhost';
-- Jangan berikan DROP, CREATE, ALTER ke aplikasi
```

### **Data Protection**
- ✅ Password di-hash menggunakan `password_hash()` PHP
- ✅ Prepared statements untuk mencegah SQL injection
- ✅ Input validation di backend dan frontend
- ✅ Foreign key constraints untuk data integrity

### **Monitoring**
```sql
-- Log aktivitas user (tabel log_aktivitas)
-- Monitor failed login attempts
-- Track sensitive operations (CREATE, UPDATE, DELETE)
```

## 🔍 **Troubleshooting**

### **Error: Table doesn't exist**
```sql
-- Pastikan database sudah diimport
SHOW TABLES;
-- Jika kosong, import ulang db.sql
```

### **Error: Foreign key constraint**
```sql
-- Disable foreign key check sementara
SET FOREIGN_KEY_CHECKS = 0;
-- Import data
SET FOREIGN_KEY_CHECKS = 1;
```

### **Error: Connection refused**
```bash
# Check MySQL service
sudo systemctl status mysql  # Linux
net start mysql              # Windows

# Check port
netstat -an | grep 3306
```

---

**📝 Note**: Database ini dirancang untuk mendukung hingga 10,000+ santri dengan performa optimal menggunakan indexing yang tepat.
