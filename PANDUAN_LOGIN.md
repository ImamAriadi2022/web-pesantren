# PANDUAN LENGKAP MENGATASI MASALAH LOGIN

## Langkah 1: Pastikan Database Terkoneksi
```bash
# Buka browser dan akses:
http://localhost/web-pesantren/backend/check_database.php
```

Script ini akan mengecek:
- ✓ Koneksi database berhasil
- ✓ Tabel 'users' ada
- ✓ Jumlah user di database
- ✓ Struktur tabel users
- ✓ Sample data users

## Langkah 2: Update Password dengan Hash yang Benar
```bash
# Buka browser dan akses:
http://localhost/web-pesantren/backend/update_passwords.php
```

Script ini akan:
- Generate hash password baru untuk 'secret123'
- Update semua user dengan hash yang benar
- Verifikasi hash yang tersimpan
- Tampilkan instruksi login

## Langkah 3: Test Login Langsung
```bash
# Buka browser dan akses:
http://localhost/web-pesantren/backend/test_login.php
```

Script ini akan:
- Test login untuk admin, pengajar, santri
- Verifikasi password dengan hash database
- Troubleshoot jika ada masalah

## Langkah 4: Test Login via Frontend
Setelah script berhasil, gunakan kredensial berikut di frontend:

### Admin
- Email: `admin@pesantren.com`
- Password: `secret123`

### Pengajar
- Email: `pengajar1@pesantren.com`
- Password: `secret123`

### Santri
- Email: `santri1@pesantren.com`
- Password: `secret123`

## Troubleshooting Umum

### Problem 1: Database tidak terkoneksi
**Solusi:**
1. Pastikan Laragon/XAMPP berjalan
2. Cek konfigurasi di `backend/config/database.php`
3. Buat database 'web_pesantren' di phpMyAdmin
4. Import file `backend/db/db.sql`

### Problem 2: Tabel users kosong
**Solusi:**
1. Re-import file `backend/db/db.sql`
2. Pastikan tidak ada error saat import
3. Refresh phpMyAdmin

### Problem 3: Hash password tidak valid
**Solusi:**
1. Jalankan `update_passwords.php` (ini akan fix masalah hash)
2. Jangan edit password manual di phpMyAdmin
3. Gunakan script PHP untuk generate hash

### Problem 4: Login masih gagal setelah update
**Solusi:**
1. Clear browser cache/cookies
2. Cek Network tab di Developer Tools browser
3. Lihat file `backend/api/debug.log` untuk error detail
4. Pastikan tidak ada spasi di email/password

## Debug Files yang Dibuat

1. **check_database.php** - Cek status database dan tabel
2. **update_passwords.php** - Update hash password semua user
3. **test_login.php** - Test login secara langsung
4. **generate_password.php** - Helper untuk generate dan verifikasi hash

## Catatan Penting

- **JANGAN** edit password manual di phpMyAdmin
- **GUNAKAN** script PHP untuk update password
- **PASTIKAN** tidak ada spasi di depan/belakang email/password
- **CEK** file debug.log jika ada error
- **GUNAKAN** password: `secret123` untuk semua user

## Setelah Login Berhasil

Jika login berhasil, Anda bisa:
1. Test fitur-fitur admin/pengajar/santri
2. Upload foto santri
3. Kelola data kelas, santri, dll
4. Generate laporan

## Backup dan Keamanan

Setelah semua berjalan:
1. Backup database yang sudah benar
2. Ganti password default 'secret123' dengan yang lebih aman
3. Hapus file debug script di production
