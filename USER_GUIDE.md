# 🎯 **User Guide - Sistem Pesantren v2.0**

## 👋 **Selamat Datang!**

Panduan lengkap penggunaan Sistem Manajemen Pesantren untuk semua pengguna.

## 📋 **Daftar Isi**
- [Login & Akses](#login--akses)
- [Dashboard Admin](#dashboard-admin)
- [Panel Pengajar](#panel-pengajar)
- [Portal Santri](#portal-santri)
- [Fitur Baru v2.0](#fitur-baru-v20)
- [FAQ](#faq)

## 🔐 **Login & Akses**

### **Cara Login**
1. Buka browser dan akses: `http://localhost:3000`
2. Klik tombol "Login" di pojok kanan atas
3. Masukkan email dan password
4. Sistem akan mengarahkan sesuai role Anda

### **Role & Akses**
| Role | Email Default | Password | Akses |
|------|---------------|----------|-------|
| **Admin** | admin@pesantren.com | admin123 | Semua fitur |
| **Pengajar** | pengajar@pesantren.com | pengajar123 | Data mengajar |
| **Santri** | santri@pesantren.com | santri123 | Data pribadi |

> 📝 **Tip**: Ganti password default setelah login pertama!

## 🎛️ **Dashboard Admin**

### **Menu Utama**
![Dashboard Admin](dashboard_overview.png)

#### **📊 Statistik Real-time**
- **Total Pengguna**: Admin, Pengajar, Santri
- **Data Santri**: Jumlah santri aktif
- **Data Pengajar**: Ustadz/Ustadzah
- **Asrama**: Kapasitas dan okupansi
- **Aktivitas Terbaru**: Nilai dan absensi

#### **🔧 Menu Manajemen**

### **1. Kelola Pengguna**
**Fitur**: Tambah, edit, hapus pengguna sistem

**Langkah-langkah**:
1. Klik **"Kelola Pengguna"** di sidebar
2. **Tambah Pengguna**: Klik tombol hijau "+"
   - Isi form: Email, Password, Role, Nama
   - Klik "Simpan"
3. **Edit Pengguna**: Klik ikon pensil
   - Ubah data yang diperlukan
   - Klik "Update"
4. **Hapus Pengguna**: Klik ikon tempat sampah
   - Konfirmasi penghapusan

### **2. Data Santri**
**Fitur**: Manajemen data lengkap santri

**Form Input**:
- **Data Pribadi**: Nama, NIS, Jenis Kelamin
- **Kontak**: Alamat, No. HP Wali
- **Akademik**: Tanggal Masuk, Status
- **Upload Foto**: Format JPG/PNG (max 2MB)

**Filter & Search**:
- Cari berdasarkan nama atau NIS
- Filter: Status, Jenis Kelamin, Kelas

### **3. Kelola Kelas**
**Fitur**: Atur kelas dan kapasitas

**Cara Membuat Kelas**:
1. Klik **"Kelola Kelas"**
2. Klik "Tambah Kelas"
3. Isi data:
   - Kode Kelas (contoh: K001)
   - Nama Kelas (contoh: Kelas 1 Alif)
   - Tingkat (1-6)
   - Wali Kelas
   - Kapasitas maksimal

### **4. 🆕 Kelola Mata Pelajaran**
**Fitur Baru**: Input KKM untuk setiap mapel

**Form Mata Pelajaran**:
- **Kode Mapel**: MTK001, BIN001, dll
- **Nama Mapel**: Matematika, Bahasa Indonesia
- **SKS**: Satuan Kredit Semester
- **🎯 KKM**: Kriteria Ketuntasan Minimal (0-100)
- **Kategori**: Umum, Agama, Ekskul
- **Status**: Aktif/Tidak Aktif

### **5. Kelola Asrama**
**Manajemen tempat tinggal santri**

**Data Asrama**:
- Nama & Kode Asrama
- Kapasitas santri
- Jenis: Putra/Putri
- Penanggung jawab
- Fasilitas

### **6. Kelola Keuangan**
**Sistem pembayaran dan transaksi**

**Jenis Transaksi**:
- **Pemasukan**: SPP, Uang Gedung, Kursus
- **Pengeluaran**: Operasional, Pemeliharaan
- **Metode**: Tunai, Transfer, E-Wallet

### **7. Data Tahfidz**
**Progress hafalan Al-Qur'an**

**Tracking**:
- Surat yang dihafal
- Range ayat
- Target selesai
- Status hafalan
- Pembimbing

### **8. 🆕 Pengaturan Web**
**Kustomisasi tampilan website**

**Settings**:
- Logo pesantren
- Nama institusi
- Kontak & alamat
- Warna tema
- Banner utama

### **9. Laporan**
**Generate berbagai laporan**

**Jenis Laporan**:
- Rekap nilai per periode
- Absensi bulanan
- Keuangan per bulan
- Progress tahfidz
- Export ke PDF/Excel

## 👨‍🏫 **Panel Pengajar**

### **Menu Pengajar**

#### **1. 🆕 Komunikasi**
**Fitur chat dengan santri dan sesama pengajar**

**Jenis Pesan**:
- **Pribadi**: Chat 1-on-1 dengan santri
- **Kelas**: Broadcast ke seluruh kelas
- **Pengumuman**: Info penting

**Cara Mengirim**:
1. Klik **"Komunikasi"**
2. Pilih "Kirim Pesan"
3. Pilih penerima:
   - Santri tertentu
   - Seluruh kelas
4. Tulis judul dan pesan
5. Klik "Kirim"

**Status Pesan**:
- ✅ Terkirim
- 👁️ Dibaca
- ⏰ Pending

#### **2. 🆕 Kelola Jadwal**
**Sistem penjadwalan otomatis dengan deteksi konflik**

**Membuat Jadwal**:
1. Klik **"Kelola Jadwal"**
2. Pilih "Tambah Jadwal"
3. Isi form:
   - **Kelas**: Pilih dari dropdown
   - **Mata Pelajaran**: Sesuai mapel yang diampu
   - **Hari**: Senin - Minggu
   - **Jam**: Format 24 jam (08:00-09:30)
   - **Ruangan**: Kode ruang
   - **Semester**: Ganjil/Genap

**🚨 Deteksi Konflik**:
- Sistem otomatis cek jadwal bentrok
- Peringatan jika:
  - Ustadz mengajar di 2 kelas bersamaan
  - Ruangan dipakai di jam yang sama
  - Kelas sudah ada mapel lain

#### **3. Input Nilai**
**Sistem nilai dengan notifikasi otomatis**

**Jenis Nilai**:
- UTS (Ujian Tengah Semester)
- UAS (Ujian Akhir Semester)
- Tugas Harian
- Praktek/Hafalan

**Cara Input**:
1. Pilih kelas dan mata pelajaran
2. Pilih santri dari list
3. Input nilai (0-100)
4. Cek dengan KKM yang telah ditetapkan
5. Tambah keterangan (opsional)
6. **Simpan** → 🔔 Notifikasi otomatis ke santri!

**🎯 Indikator KKM**:
- 🟢 **Hijau**: Nilai ≥ KKM (Tuntas)
- 🔴 **Merah**: Nilai < KKM (Belum Tuntas)

#### **4. Absensi**
**Presensi harian santri**

**Status Absensi**:
- ✅ Hadir
- ❌ Tidak Hadir
- 🏥 Sakit
- 📋 Izin
- ⏰ Terlambat

#### **5. Data Kelas**
**Informasi kelas yang diampu**

**Info Kelas**:
- List santri per kelas
- Wali kelas
- Jadwal lengkap
- Statistik kehadiran

## 🎓 **Portal Santri**

### **Menu Santri**

#### **1. 🆕 Notifikasi Nilai**
**Update nilai real-time dari pengajar**

**Tampilan Notifikasi**:
- 🔔 **Badge** merah untuk notif baru
- **List nilai** terbaru dengan:
  - Mata pelajaran
  - Jenis nilai (UTS/UAS/Tugas)
  - Skor yang diperoleh
  - Status KKM (Tuntas/Belum)
  - Tanggal input
  - Keterangan pengajar

**Cara Cek**:
1. Login sebagai santri
2. Badge notifikasi muncul otomatis
3. Klik "Notifikasi" untuk detail
4. Mark as read setelah dibaca

#### **2. 🆕 Komunikasi**
**Chat dengan pengajar dan teman**

**Fitur Chat**:
- Terima pesan dari pengajar
- Reply pesan pribadi
- Baca pengumuman kelas
- History chat tersimpan

**Type Pesan**:
- 📨 **Pribadi**: Dari pengajar langsung
- 📢 **Kelas**: Broadcast ke semua
- 📋 **Pengumuman**: Info penting

#### **3. Profil Saya**
**Data pribadi dan akademik**

**Info Profil**:
- Data personal
- Foto profil
- Kontak wali
- Status akademik
- Kelas saat ini

#### **4. Jadwal Kelas**
**Jadwal pelajaran harian/mingguan**

**View Jadwal**:
- Per hari
- Per minggu
- Per mata pelajaran
- Export ke kalender

#### **5. Nilai Saya**
**Rekap semua nilai**

**Filter Nilai**:
- Per mata pelajaran
- Per semester
- Per jenis nilai
- Grafik progress

#### **6. Absensi Saya**
**Rekap kehadiran**

**Statistik**:
- Persentase kehadiran
- Detail per hari
- Alasan ketidakhadiran

#### **7. Progress Tahfidz**
**Tracking hafalan Al-Qur'an**

**Info Progress**:
- Surat yang sedang dihafal
- Target completion
- Evaluasi pembimbing
- Sertifikat digital

## 🆕 **Fitur Baru v2.0**

### **🎯 KKM (Kriteria Ketuntasan Minimal)**
- Setiap mata pelajaran memiliki KKM
- Indikator visual hijau/merah
- Alert otomatis untuk nilai di bawah KKM

### **💬 Sistem Komunikasi Real-time**
- Chat pribadi pengajar-santri
- Broadcast pesan ke kelas
- Status baca/belum baca
- History chat tersimpan

### **🔔 Notifikasi Nilai Otomatis**
- Notif langsung saat nilai diinput
- Badge counter untuk notif baru
- Detail nilai dengan status KKM
- Push notification (coming soon)

### **📅 Smart Scheduling**
- Deteksi konflik jadwal otomatis
- Validasi bentrok ruangan/pengajar
- Visual calendar interface
- Export jadwal ke PDF

### **📊 Enhanced Dashboard**
- Real-time statistics
- Role-based user count
- Activity indicators
- Visual charts

## ❓ **FAQ (Frequently Asked Questions)**

### **🔐 Login & Akses**

**Q: Lupa password, bagaimana reset?**
A: Klik "Lupa Password" di halaman login → Masukkan email → Cek email untuk link reset

**Q: Akun ter-suspend, bagaimana mengatasinya?**
A: Hubungi admin untuk reaktivasi akun

### **👨‍🏫 Untuk Pengajar**

**Q: Bagaimana cara mengubah KKM mata pelajaran?**
A: Admin yang mengatur KKM di menu "Kelola Mata Pelajaran"

**Q: Nilai santri tidak muncul di notifikasi?**
A: Pastikan data santri sudah lengkap dan aktif

**Q: Jadwal bentrok terus, kenapa?**
A: Sistem akan memberi peringatan, sesuaikan jam atau ruangan

### **🎓 Untuk Santri**

**Q: Notifikasi nilai tidak masuk?**
A: Refresh halaman atau logout-login ulang

**Q: Cara reply pesan pengajar?**
A: Buka menu "Komunikasi" → Pilih pesan → Klik "Reply"

**Q: Nilai tidak sesuai dengan yang diumumkan?**
A: Hubungi pengajar mata pelajaran terkait

### **🎛️ Untuk Admin**

**Q: Cara backup data sistem?**
A: Export database MySQL secara berkala + backup folder uploads

**Q: Sistem lambat, bagaimana mengoptimalkan?**
A: Bersihkan log files, optimalkan database, upgrade server

**Q: Cara menambah role baru?**
A: Modifikasi database table `users` dan update sistem autentikasi

## 📞 **Support & Bantuan**

### **Tim Teknis**
- **Email**: support@pesantren.com
- **WhatsApp**: +62 812-3456-7890
- **Jam Kerja**: 08:00 - 17:00 WIB

### **Training & Workshop**
- Training admin: Setiap awal tahun ajaran
- Workshop pengajar: Bulanan
- Panduan santri: Masa orientasi

### **Update System**
- **Version check**: Otomatis
- **Security update**: Mingguan
- **Feature update**: Per semester

---

**🎉 Selamat menggunakan Sistem Pesantren v2.0!**
*Mudah, Cepat, Terintegrasi*
