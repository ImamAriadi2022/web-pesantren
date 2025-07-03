# 🏫 PANDUAN SETUP DATABASE PESANTREN WALISONGO

## 📋 Langkah-Langkah Setup

### 1. Persiapan Database
1. **Buka phpMyAdmin** di browser: `http://localhost/phpmyadmin`
2. **Buat database baru** dengan nama: `web_pesantren`
3. **Import file** `backend/db/db.sql` ke database tersebut
   - Klik database `web_pesantren`
   - Pilih tab **Import**
   - Pilih file `db.sql`
   - Klik **Go**

### 2. Setup Data dengan PHP
1. **Buka halaman setup** di browser:
   ```
   http://localhost/web-pesantren/backend/setup_data.php
   ```

2. **Jalankan setup sesuai urutan:**
   - ✅ **Setup Users** - Membuat user admin, pengajar, santri
   - ✅ **Setup Data Master** - Mata pelajaran, ustadz, kelas, asrama
   - ✅ **Setup Data Santri** - Data santri dan penempatan
   - ✅ **Setup Data Akademik** - Jadwal, absensi, nilai, tahfidz
   - ✅ **Setup Pengaturan** - Pengaturan website

3. **ATAU klik "Setup Semua Data"** untuk setup sekaligus

### 3. Test Login
Setelah setup selesai, test login dengan kredensial:

**Admin:**
- Email: `admin@pesantren.com`
- Password: `secret123`

**Pengajar:**
- Email: `ustadz1@pesantren.com`
- Password: `secret123`

**Santri:**
- Email: `santri1@pesantren.com`
- Password: `secret123`

## 🔧 Fitur Setup Data

### ✅ Keunggulan Setup PHP vs SQL Manual

**❌ Masalah SQL Manual:**
- Hash password sering rusak karena encoding
- Copy-paste error dari editor
- Tidak ada validasi data
- Sulit untuk debugging

**✅ Keunggulan Setup PHP:**
- Hash password dibuat dengan `password_hash()` yang benar
- Validasi data otomatis
- Error handling yang jelas
- Mudah untuk troubleshooting
- Bisa reset dan setup ulang kapan saja

### 🔐 Password Management
- Semua user menggunakan password: `secret123`
- Hash dibuat dengan PHP `password_hash()`
- Kompatible 100% dengan `password_verify()`
- Password bisa diubah setelah login

## 🛠️ Troubleshooting

### Problem: Setup Gagal
**Solusi:**
1. Pastikan Laragon/XAMPP berjalan
2. Cek database `web_pesantren` sudah dibuat
3. Cek konfigurasi di `backend/config/database.php`
4. Import ulang file `db.sql`

### Problem: Login Gagal
**Solusi:**
1. Jalankan "Test Login" di halaman setup
2. Pastikan setup users sudah berhasil
3. Clear browser cache/cookies
4. Cek Network tab di Developer Tools

### Problem: Error Database
**Solusi:**
1. Reset database dengan tombol "Reset Database"
2. Setup ulang dari awal
3. Cek file `backend/api/debug.log` untuk error detail

## 📁 File yang Dibuat

### Database & Setup
- `backend/db/db.sql` - Struktur database (CREATE TABLE only)
- `backend/setup_data.php` - Interface setup data
- `backend/setup_actions.php` - Backend setup actions

### Debugging & Tools
- `backend/check_database.php` - Cek koneksi database
- `backend/test_login.php` - Test login manual
- `backend/update_passwords.php` - Update password manual
- `backend/generate_password.php` - Helper generate hash

## 🚀 Setelah Setup Berhasil

1. **Login ke frontend** dengan kredensial di atas
2. **Test fitur-fitur:**
   - Data santri, ustadz, kelas
   - Upload foto santri
   - Input nilai dan absensi
   - Generate laporan
3. **Ubah password default** untuk keamanan
4. **Hapus file debug** di production

## 📊 Data yang Dibuat

- **14 users** (1 admin, 5 pengajar, 8 santri)
- **5 ustadz/ustadzah** dengan profile lengkap
- **10 mata pelajaran** (Agama, Umum, Tahfidz, Keterampilan)
- **7 kelas** tingkat 1-3 putra dan putri
- **5 asrama** dengan fasilitas lengkap
- **8 santri** dengan data lengkap dan wali
- **10 jadwal pelajaran** sample
- **10 data absensi** sample
- **10 nilai** UTS/UAS sample
- **7 data tahfidz** dengan progress hafalan
- **1 pengaturan web** lengkap
- **1 periode PSB** 2024/2025
- **4 transaksi keuangan** sample

## 🔒 Keamanan

- Password hash menggunakan bcrypt
- Validasi input di semua form
- Foreign key constraints
- Error handling yang aman
- Session management yang benar

---

**Selamat! Database Pesantren Walisongo siap digunakan! 🎉**
