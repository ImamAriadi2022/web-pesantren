# 🗂️ **Panduan Setup Data Template - Sistem Pesantren v2.0**

## 📋 **Daftar Isi**
- [Overview](#overview)
- [Auto Data Generator](#auto-data-generator)
- [Manual User Insert](#manual-user-insert)
- [Template Data](#template-data)
- [Debug Tools](#debug-tools)
- [Troubleshooting](#troubleshooting)

## 🎯 **Overview**

Sistem Pesantren v2.0 menyediakan **auto data generator** untuk mengisi database dengan data template yang siap pakai. Ini sangat berguna untuk:

- 🚀 **Quick Setup** - Setup development environment dalam hitungan menit
- 🧪 **Testing** - Data sample untuk testing fitur-fitur baru
- 📚 **Demo** - Presentasi sistem dengan data realistic
- 🎓 **Training** - Training user dengan data yang mudah dipahami

---

## 🤖 **Auto Data Generator**

### **🌐 Akses Web Interface**

**URL Setup**: `http://localhost/web-pesantren/backend/setup_data.php`

![Data Setup Interface](setup_interface.png)

### **📋 Fitur Auto Generator**

#### **1. Setup Users & Password**
```
✅ 14 User Accounts
✅ 3 Role berbeda (admin/pengajar/santri)
✅ Password seragam: "admin"
✅ Auto hash dengan bcrypt
```

**Default Accounts**:
```
👤 Admin
- admin@pesantren.com / admin

👨‍🏫 Pengajar (5 accounts)
- ustadz1@pesantren.com / admin
- ustadz2@pesantren.com / admin  
- ustadz3@pesantren.com / admin
- ustadzah1@pesantren.com / admin
- ustadzah2@pesantren.com / admin

🎓 Santri (8 accounts)
- santri1@pesantren.com / admin
- santri2@pesantren.com / admin
- ...
- santri8@pesantren.com / admin
```

#### **2. Setup Data Master**
```
📚 Mata Pelajaran (10 mapel)
- Akidah, Fiqh, Tahfidz, Hadits, Tafsir
- Matematika, IPA, IPS, Bahasa Indonesia, Bahasa Arab

🏫 Kelas (6 kelas)
- Kelas 1A, 1B, 2A, 2B, 3A, 3B
- Kapasitas 25-30 santri per kelas

🏠 Asrama (4 asrama)
- Asrama Putra A & B
- Asrama Putri A & B
- Kapasitas 50 santri per asrama
```

#### **3. Setup Data Santri**
```
🎓 Santri Profile (8 santri)
- Data lengkap dengan NIS auto-generated
- Jenis kelamin seimbang (putra/putri)
- Alamat dan data wali realistic
- Auto penempatan kelas dan asrama
```

#### **4. Setup Data Akademik**
```
📅 Jadwal Pelajaran
- 30+ jadwal per minggu
- Conflict detection otomatis
- Jam 07:00 - 16:00

📊 Nilai Sample
- UTS dan UAS per mata pelajaran
- Nilai realistic (70-95)
- Auto trigger notifikasi

📋 Absensi
- Data kehadiran 30 hari terakhir
- Status realistic (hadir/izin/sakit)

📖 Tahfidz Progress
- Progress hafalan Al-Qur'an
- Target surat dan ayat
```

#### **5. Setup Pengaturan Web**
```
⚙️ Website Settings
- Logo dan nama pesantren
- Kontak dan alamat
- Konfigurasi sistem
```

### **🚀 One-Click Setup**

**Setup Semua Data Sekaligus**:
```javascript
// Klik tombol "Setup Semua Data"
// Script akan menjalankan:
1. Create all tables
2. Insert sample users  
3. Insert master data
4. Insert santri data
5. Insert academic data
6. Insert website settings
```

**Progress Indicator**:
```
⏳ Memproses setup users...
✅ Users berhasil dibuat! (14 accounts)

⏳ Memproses setup master data...
✅ Master data berhasil dibuat! (10 mapel, 6 kelas, 4 asrama)

⏳ Memproses setup santri...
✅ Data santri berhasil dibuat! (8 santri dengan penempatan)

⏳ Memproses setup akademik...
✅ Data akademik berhasil dibuat! (30+ jadwal, nilai, absensi)

⏳ Memproses setup pengaturan...
✅ Pengaturan web berhasil dibuat!

🎉 SETUP LENGKAP! Database siap digunakan.
```

---

## 👤 **Manual User Insert**

### **🌐 Single User Creator**

**URL**: `http://localhost/web-pesantren/backend/insert/user.php`

**Form Features**:
- ✅ Email validation
- ✅ Password dengan show/hide toggle
- ✅ Role selector (admin/pengajar/santri)
- ✅ Duplicate email detection
- ✅ Auto password hashing

**Usage**:
```html
<!-- Form Interface -->
Email: user@example.com
Password: [••••••••] 👁️
Role: [Dropdown: admin/pengajar/santri]
[Tambah User]
```

**API Endpoint**:
```php
POST /backend/insert/user.php
Content-Type: application/x-www-form-urlencoded

email=newuser@pesantren.com
password=userpassword123
role=santri
```

**Response Success**:
```json
{
  "success": true,
  "message": "Data berhasil ditambahkan"
}
```

**Response Error**:
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

---

## 📊 **Template Data Specifications**

### **👤 Users Template**
```sql
-- Admin Users (1)
INSERT INTO users VALUES 
(1, 'admin@pesantren.com', '[BCRYPT_HASH]', 'admin', 'Aktif', NOW(), NOW());

-- Pengajar Users (5) 
INSERT INTO users VALUES
(2, 'ustadz1@pesantren.com', '[BCRYPT_HASH]', 'pengajar', 'Aktif', NOW(), NOW()),
(3, 'ustadz2@pesantren.com', '[BCRYPT_HASH]', 'pengajar', 'Aktif', NOW(), NOW()),
(4, 'ustadz3@pesantren.com', '[BCRYPT_HASH]', 'pengajar', 'Aktif', NOW(), NOW()),
(5, 'ustadzah1@pesantren.com', '[BCRYPT_HASH]', 'pengajar', 'Aktif', NOW(), NOW()),
(6, 'ustadzah2@pesantren.com', '[BCRYPT_HASH]', 'pengajar', 'Aktif', NOW(), NOW());

-- Santri Users (8)
INSERT INTO users VALUES
(7, 'santri1@pesantren.com', '[BCRYPT_HASH]', 'santri', 'Aktif', NOW(), NOW()),
...
(14, 'santri8@pesantren.com', '[BCRYPT_HASH]', 'santri', 'Aktif', NOW(), NOW());
```

### **📚 Mata Pelajaran Template**
```sql
INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, deskripsi, kkm, kategori) VALUES
('AQD001', 'Akidah', 'Pelajaran dasar tentang keimanan Islam', 75, 'Agama'),
('FQH001', 'Fiqh', 'Pelajaran tentang hukum-hukum Islam', 75, 'Agama'),
('THF001', 'Tahfidz Quran', 'Menghafal Al-Quran', 80, 'Tahfidz'),
('HDT001', 'Hadits', 'Pelajaran tentang hadits Nabi SAW', 75, 'Agama'),
('TFS001', 'Tafsir', 'Pelajaran tentang tafsir Al-Quran', 75, 'Agama'),
('MTK001', 'Matematika', 'Pelajaran Matematika dasar', 70, 'Umum'),
('IPA001', 'IPA Terpadu', 'Ilmu Pengetahuan Alam', 70, 'Umum'),
('IPS001', 'IPS Terpadu', 'Ilmu Pengetahuan Sosial', 70, 'Umum'),
('BIN001', 'Bahasa Indonesia', 'Bahasa Indonesia', 75, 'Umum'),
('BAR001', 'Bahasa Arab', 'Bahasa Arab dasar', 70, 'Bahasa');
```

### **🏫 Kelas Template**
```sql
INSERT INTO kelas (kode_kelas, nama_kelas, tingkat, wali_kelas_id, kapasitas) VALUES
('K1A', 'Kelas 1 Alif', 1, 2, 25),
('K1B', 'Kelas 1 Ba', 1, 3, 25),
('K2A', 'Kelas 2 Alif', 2, 4, 30),
('K2B', 'Kelas 2 Ba', 2, 5, 30),
('K3A', 'Kelas 3 Alif', 3, 6, 25),
('K3B', 'Kelas 3 Ba', 3, 2, 25);
```

### **🏠 Asrama Template**
```sql
INSERT INTO asrama (nama_asrama, kode_asrama, kapasitas, lokasi, jenis, penanggung_jawab_id, fasilitas) VALUES
('Asrama Putra A', 'PA01', 50, 'Blok Utara', 'Putra', 2, 'AC, WiFi, Kamar Mandi Dalam'),
('Asrama Putra B', 'PA02', 50, 'Blok Selatan', 'Putra', 3, 'AC, WiFi, Kamar Mandi Dalam'),
('Asrama Putri A', 'PI01', 50, 'Blok Timur', 'Putri', 5, 'AC, WiFi, Kamar Mandi Dalam'),
('Asrama Putri B', 'PI02', 50, 'Blok Barat', 'Putri', 6, 'AC, WiFi, Kamar Mandi Dalam');
```

### **🎓 Santri Template**
```sql
INSERT INTO santri (user_id, nama, nis, jenis_kelamin, asal_sekolah, tanggal_lahir, alamat, nama_wali, no_hp_wali, tanggal_masuk) VALUES
(7, 'Ahmad Fauzi', '2024001', 'Laki-laki', 'SDN 1 Jakarta', '2010-03-15', 'Jl. Melati No. 123, Jakarta', 'Bapak Fauzi', '081234567001', '2024-07-01'),
(8, 'Siti Aisyah', '2024002', 'Perempuan', 'SDN 2 Bogor', '2010-05-20', 'Jl. Mawar No. 456, Bogor', 'Ibu Aisyah', '081234567002', '2024-07-01'),
(9, 'Muhammad Rizki', '2024003', 'Laki-laki', 'SDN 3 Bandung', '2010-01-10', 'Jl. Kenanga No. 789, Bandung', 'Bapak Rizki', '081234567003', '2024-07-01'),
(10, 'Fatimah Zahra', '2024004', 'Perempuan', 'SDN 4 Semarang', '2010-07-25', 'Jl. Tulip No. 321, Semarang', 'Ibu Zahra', '081234567004', '2024-07-01'),
(11, 'Ali Akbar', '2024005', 'Laki-laki', 'SDN 5 Surabaya', '2010-02-14', 'Jl. Anggrek No. 654, Surabaya', 'Bapak Akbar', '081234567005', '2024-07-01'),
(12, 'Khadijah', '2024006', 'Perempuan', 'SDN 6 Yogya', '2010-09-30', 'Jl. Dahlia No. 987, Yogyakarta', 'Ibu Khadijah', '081234567006', '2024-07-01'),
(13, 'Usman bin Affan', '2024007', 'Laki-laki', 'SDN 7 Solo', '2010-04-18', 'Jl. Cempaka No. 147, Solo', 'Bapak Usman', '081234567007', '2024-07-01'),
(14, 'Hafsah', '2024008', 'Perempuan', 'SDN 8 Malang', '2010-11-05', 'Jl. Sakura No. 258, Malang', 'Ibu Hafsah', '081234567008', '2024-07-01');
```

### **📅 Jadwal Template (Sample)**
```sql
-- Senin
INSERT INTO jadwal_pelajaran (kelas_id, mapel_id, ustadz_id, hari, jam_mulai, jam_selesai, ruangan, tahun_ajaran, semester) VALUES
(1, 1, 2, 'Senin', '07:00', '08:30', 'R101', '2024/2025', 'Ganjil'),  -- Kelas 1A - Akidah
(1, 6, 3, 'Senin', '08:45', '10:15', 'R101', '2024/2025', 'Ganjil'),  -- Kelas 1A - Matematika
(2, 2, 4, 'Senin', '07:00', '08:30', 'R102', '2024/2025', 'Ganjil'),  -- Kelas 1B - Fiqh
(2, 7, 5, 'Senin', '08:45', '10:15', 'R102', '2024/2025', 'Ganjil');  -- Kelas 1B - IPA
```

### **📊 Nilai Template (Sample)**
```sql
INSERT INTO nilai (santri_id, mapel_id, jenis_nilai, nilai, bobot, keterangan, tahun_ajaran, semester, dibuat_oleh) VALUES
-- Ahmad Fauzi (santri_id = 1)
(1, 1, 'UTS', 85.5, 1.0, 'Ujian Tengah Semester Akidah', '2024/2025', 'Ganjil', 2),
(1, 1, 'UAS', 88.0, 1.0, 'Ujian Akhir Semester Akidah', '2024/2025', 'Ganjil', 2),
(1, 6, 'UTS', 78.5, 1.0, 'Ujian Tengah Semester Matematika', '2024/2025', 'Ganjil', 3),
(1, 6, 'UAS', 82.0, 1.0, 'Ujian Akhir Semester Matematika', '2024/2025', 'Ganjil', 3);
```

---

## 🔧 **Debug Tools**

### **🔍 Database Checker**

**URL**: `http://localhost/web-pesantren/backend/check_database.php`

**Output**:
```
=== CEK DATABASE ===

✓ Koneksi database berhasil
Host: localhost
Database: web_pesantren
User: root

✓ Tabel 'users' ditemukan
✓ Jumlah user: 14

=== STRUKTUR TABEL USERS ===
- id: int(11)
- email: varchar(255)
- password: varchar(255)
- role: enum('admin','pengajar','santri')
- status: enum('active','inactive')
- created_at: timestamp
- updated_at: timestamp

=== SAMPLE DATA USERS ===
ID: 1 | Email: admin@pesantren.com | Role: admin | Password: $2y$10$eImiTXuWVxfM...
ID: 2 | Email: ustadz1@pesantren.com | Role: pengajar | Password: $2y$10$eImiTXuWVxfM...
ID: 7 | Email: santri1@pesantren.com | Role: santri | Password: $2y$10$eImiTXuWVxfM...

=== DAFTAR SEMUA TABEL ===
✓ users (14 records)
✓ santri (8 records)
✓ ustadz (5 records)
✓ mata_pelajaran (10 records)
✓ kelas (6 records)
✓ asrama (4 records)
✓ jadwal_pelajaran (30+ records)
✓ nilai (40+ records)
✓ absensi (200+ records)
```

### **🔑 Password Generator**

**URL**: `http://localhost/web-pesantren/backend/generate_password.php`

**Output**:
```
=== PASSWORD HASH GENERATOR ===

Admin Password Hash (admin): $2y$10$eImiTXuWVxfM37uY4JANjO...
Ustadz Password Hash (admin): $2y$10$eImiTXuWVxfM37uY4JANjO...
Santri Password Hash (admin): $2y$10$eImiTXuWVxfM37uY4JANjO...

=== LOGIN CREDENTIALS YANG BENAR ===

Admin: admin@pesantren.com / admin
Ustadz: ustadz1@pesantren.com / admin  
Santri: santri1@pesantren.com / admin

!!! SEMUA AKUN MENGGUNAKAN PASSWORD: admin !!!
```

### **🔄 Password Reset Tool**

**Feature**: Reset semua password ke "admin"
```php
// Akses via setup_data.php -> Debug section
// Button: "Reset All Passwords ke 'admin'"

// Script akan:
1. Update semua password ke hash "admin"
2. Test login admin account
3. Konfirmasi password berhasil di-reset
```

---

## 🚨 **Troubleshooting**

### **❌ Error: Table 'users' doesn't exist**

**Solusi 1**: Import database schema
```bash
# Via phpMyAdmin
1. Buka phpMyAdmin
2. Create database 'web_pesantren'
3. Import file: backend/db/db.sql

# Via command line
mysql -u root -p
CREATE DATABASE web_pesantren;
USE web_pesantren;
SOURCE backend/db/db.sql;
```

**Solusi 2**: Auto-create via setup
```
1. Akses: http://localhost/web-pesantren/backend/setup_data.php
2. Klik "Setup Semua Data"
3. Script akan auto-create tables dan data
```

### **❌ Error: Access denied for user**

**Solusi**: Update database config
```php
// Edit: backend/config/database.php
$host = 'localhost';
$dbname = 'web_pesantren';
$username = 'root';        // Sesuaikan dengan setting MySQL
$password = '';            // Sesuaikan dengan password MySQL

// Untuk XAMPP: password = ''
// Untuk LARAGON: password = ''
// Untuk custom: password = 'your_mysql_password'
```

### **❌ Error: Foreign key constraint fails**

**Solusi**: Disable foreign key check
```sql
SET FOREIGN_KEY_CHECKS = 0;
-- Run your INSERT statements
SET FOREIGN_KEY_CHECKS = 1;
```

### **❌ Error: Duplicate entry for key 'email'**

**Solusi 1**: Reset database
```
1. Akses setup_data.php
2. Klik "Reset Database" (DANGER)
3. Klik "Setup Semua Data"
```

**Solusi 2**: Manual cleanup
```sql
DELETE FROM users WHERE email LIKE '%@pesantren.com';
ALTER TABLE users AUTO_INCREMENT = 1;
```

### **❌ Login gagal setelah setup**

**Diagnosis**:
```
1. Akses: backend/check_database.php
   - Cek apakah users exist
   - Cek password hash format

2. Akses: backend/generate_password.php  
   - Cek password credentials yang benar
   - Test password verification

3. Manual test login:
   - Email: admin@pesantren.com
   - Password: admin
```

**Solusi**:
```
1. Via setup_data.php -> Debug section
2. Klik "Reset All Passwords ke 'admin'"
3. Test login lagi dengan password: admin
```

---

## 📚 **Best Practices**

### **🔒 Security Guidelines**

1. **Ganti Password Default**
```
⚠️ PENTING: Password default "admin" hanya untuk development!
✅ Ganti password setelah setup production
✅ Gunakan password yang kuat untuk production
```

2. **Remove Setup Files**
```bash
# Untuk production, hapus file setup:
rm backend/setup_data.php
rm backend/setup_actions.php
rm backend/generate_password.php
rm backend/check_database.php
```

3. **Database Backup**
```bash
# Backup setelah setup data template
mysqldump -u root -p web_pesantren > backup_template_data.sql
```

### **🎯 Development Workflow**

1. **Fresh Development Setup**
```
1. Clone project
2. Create database 'web_pesantren'
3. Akses: /backend/setup_data.php
4. Klik "Setup Semua Data"
5. Login dengan: admin@pesantren.com / admin
6. Start development!
```

2. **Testing Workflow**
```
1. Reset database (via setup_data.php)
2. Setup fresh template data
3. Test new features
4. Repeat as needed
```

3. **Demo Preparation**
```
1. Setup template data
2. Customize sample data untuk demo
3. Test all user roles
4. Prepare demo scenarios
```

---

## 🎉 **Quick Start Commands**

### **🚀 One-Liner Setup**
```
URL: http://localhost/web-pesantren/backend/setup_data.php
Action: Klik "Setup Semua Data"
Result: ✅ 14 users, 10 mapel, 6 kelas, 4 asrama, 8 santri + data akademik lengkap
Time: ~30 seconds
```

### **🔑 Default Login Credentials**
```
👤 Admin Portal:
   Email: admin@pesantren.com
   Password: admin
   URL: http://localhost:3000 → Login → Admin Dashboard

👨‍🏫 Pengajar Portal:
   Email: ustadz1@pesantren.com  
   Password: admin
   URL: http://localhost:3000 → Login → Pengajar Panel

🎓 Santri Portal:
   Email: santri1@pesantren.com
   Password: admin
   URL: http://localhost:3000 → Login → Santri Dashboard
```

### **📊 Quick Verify**
```bash
# Cek database
http://localhost/web-pesantren/backend/check_database.php

# Test login
http://localhost:3000 → Login dengan credentials di atas

# Cek fitur baru v2.0:
- ✅ KKM pada mata pelajaran
- ✅ Komunikasi real-time
- ✅ Notifikasi nilai otomatis  
- ✅ Smart scheduling
- ✅ Enhanced dashboard
```

---

**🎯 Ready untuk Development & Testing!**  
*Template data siap, login credentials tersedia, semua fitur v2.0 ter-setup dengan sempurna.*
