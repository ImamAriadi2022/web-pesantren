# Setup Database Web Pesantren

## Langkah-langkah Setup

### 1. Import Schema Database
1. Buka phpMyAdmin di Laragon (http://localhost/phpmyadmin)
2. Buat database baru dengan nama `web_pesantren`
3. Import file `schema_clean.sql` ke database tersebut

# Setup Database Web Pesantren

## Langkah-langkah Setup

### 1. Import Schema Database
1. Buka phpMyAdmin di Laragon (http://localhost/phpmyadmin)
2. Buat database baru dengan nama `web_pesantren`
3. Import file `schema_clean.sql` ke database tersebut

### 2. Setup Data Dummy (Recommended)
**Gunakan Interface Web untuk Setup yang Mudah:**

1. Buka browser dan navigasi ke: 
   ```
   http://localhost/web-pesantren/backend/db/setup.html
   ```

2. **Kustomisasi Kredensial Admin:**
   - Username: `admin` (atau sesuai keinginan Anda)
   - Password: `admin123` (atau password yang lebih kuat)
   - Nama: `Administrator Pesantren` (atau nama lengkap admin)

3. **Contoh Username/Password yang Disarankan:**
   ```
   Username: admin
   Password: pesantren2024
   Nama: Ahmad Dahlan

   Atau:
   Username: administrator
   Password: mySecurePass123
   Nama: Siti Aisyah

   Atau:
   Username: pesantren_admin
   Password: Al-Hikmah123!
   Nama: Muhammad Abdullah
   ```

4. Klik tombol **"🚀 Mulai Setup Data Dummy"**

5. Tunggu proses selesai (progress bar akan menunjukkan status)

### 3. Setup Via CLI (Alternatif)
Jika Anda prefer menggunakan command line:
```bash
cd backend/db/
# Edit file setup_data.php terlebih dahulu untuk uncomment kode setup
php setup_data.php
```

### 4. Konfigurasi Database
Pastikan file `backend/config/database.php` sudah dikonfigurasi:
```php
$host = 'localhost';
$dbname = 'web_pesantren';
$username = 'root';
$password = '';
```

## Struktur Database Terbaru

### Perubahan yang Dilakukan:
1. **Tabel santri**: 
   - ❌ Dihapus: field `email`
   - ✅ Ditambah: field `kelas_id`

2. **Tabel ustadz**: 
   - ❌ Dihapus: field `email`

3. **Tabel mata_pelajaran**: 
   - ❌ Dihapus: field `sks`, `kkm`, `kategori`
   - ✅ Diubah: field `deskripsi` → `keterangan`

4. **Tabel jadwal_pelajaran**: 
   - ❌ Dihapus: field `kelas_id`, `status`, `semester`, `tahun_ajaran`

5. **Tabel nilai**: 
   - ❌ Dihapus: field `kkm`, `bobot`, `tahun_ajaran`, `keterangan`

6. **Tabel surat_izin_keluar**: 
   - ❌ Dihapus: field `status`

7. **Tabel users**: 
   - ✅ Diubah: menggunakan `username` instead of `email`

## Login Default
Setelah menjalankan setup dengan interface web:
- **URL Admin**: http://localhost:3000/admin
- **Username**: Sesuai yang Anda input saat setup (default: admin)
- **Password**: Sesuai yang Anda input saat setup (default: admin123)
- **Role**: Admin

## Fitur Setup Interface
✅ **Setup dengan tombol** - Tidak perlu command line  
✅ **Kustomisasi kredensial** - Username/password sesuai keinginan  
✅ **Progress bar real-time** - Lihat status setup  
✅ **Log detail** - Monitor proses setup  
✅ **Reset database** - Hapus semua data jika diperlukan  
✅ **Validasi input** - Pastikan data valid sebelum setup  
✅ **API Tester terintegrasi** - Test API langsung setelah setup

## Testing
Setelah setup selesai, Anda dapat:
1. Login ke sistem menggunakan kredensial yang sudah Anda buat
2. Test semua fitur CRUD yang telah disederhanakan
3. Verifikasi bahwa data dummy telah tersimpan dengan benar
4. Gunakan API Tester: http://localhost/web-pesantren/backend/test_api.html
