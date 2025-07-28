# 🕌 **Sistem Manajemen Pesantren Walisongo**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/ImamAriadi2022/web-pesantren)
[![PHP](https://img.shields.io/badge/PHP-8.0+-purple.svg)](https://php.net)
[![React](https://img.shields.io/badge/React-18.0+-61dafb.svg)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://mysql.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.0+-7952b3.svg)](https://getbootstrap.com)

## 📋 **Deskripsi Project**

Sistem Manajemen Pesantren Walisongo adalah aplikasi web modern yang dirancang khusus untuk mengelola seluruh aspek operasional pesantren. Sistem ini mengintegrasikan manajemen santri, pengajar, pembelajaran, keuangan, dan komunikasi dalam satu platform yang user-friendly.

## ✨ **Fitur Utama**

### 🔐 **Sistem Autentikasi & Role Management**
- Login multi-role (Admin, Pengajar, Santri)
- Dashboard khusus untuk setiap role
- Statistik real-time berdasarkan role

### 👥 **Manajemen Pengguna**
- **Admin**: Kontrol penuh sistem, kelola semua user
- **Pengajar**: Kelola nilai, jadwal, komunikasi dengan santri
- **Santri**: Akses nilai, jadwal, notifikasi, komunikasi

### 🎓 **Manajemen Akademik**
- **Mata Pelajaran**: CRUD dengan KKM (Kriteria Ketuntasan Minimal)
- **Jadwal Dinamis**: Sistem penjadwalan dengan deteksi konflik otomatis
- **Nilai & Rapor**: Input nilai real-time dengan notifikasi otomatis
- **Absensi**: Tracking kehadiran santri
- **Tahfidz**: Monitoring hafalan Al-Qur'an

### 🏠 **Manajemen Asrama**
- Penempatan santri di asrama
- Manajemen kamar dan fasilitas
- Penanggung jawab asrama

### 💬 **Sistem Komunikasi Terintegrasi**
- **Pesan Pribadi**: Chat langsung pengajar ↔ santri
- **Pesan Kelas**: Broadcast ke seluruh kelas
- **Pengumuman**: Notifikasi untuk semua pengguna
- **Status Baca**: Tracking pesan dibaca/belum

### 🔔 **Notifikasi Real-time**
- Notifikasi otomatis saat ada nilai baru
- Sistem status baca/belum baca
- Dashboard notifikasi untuk santri

### 💰 **Manajemen Keuangan**
- Pembayaran SPP dan biaya lainnya
- Tracking transaksi keuangan
- Laporan keuangan

### 📋 **Surat & Perizinan**
- Surat izin keluar santri
- Workflow persetujuan
- Tracking status surat

### ⚖️ **Manajemen Pelanggaran**
- Pencatatan pelanggaran santri
- Sistem poin pelanggaran
- Kategori sanksi

### 📊 **Sistem Pelaporan**
- Laporan akademik komprehensif
- Export data dalam berbagai format
- Statistik dan analytics

## 🛠️ **Teknologi yang Digunakan**

### **Backend**
- **PHP 8.0+** dengan PDO
- **MySQL 8.0+** sebagai database
- **RESTful API** architecture
- **JSON** untuk data exchange

### **Frontend** 
- **React.js 18+** dengan hooks
- **Bootstrap 5** untuk UI/UX
- **Font Awesome** untuk icons
- **Responsive Design** untuk semua device

### **Fitur Teknis**
- **Real-time Notifications**
- **Conflict Detection** untuk jadwal
- **Auto-notification** saat input nilai
- **Role-based Access Control**
- **Data Validation** di frontend & backend

## 📁 **Struktur Project**

```
web-pesantren/
├── 📁 backend/
│   ├── 📁 api/
│   │   ├── 📁 komunikasi/         # API komunikasi guru-santri
│   │   ├── 📁 dashboard/          # API statistik dashboard
│   │   ├── 📁 jadwal/             # API jadwal dengan deteksi konflik
│   │   ├── 📁 mapel/              # API mata pelajaran dengan KKM
│   │   ├── 📁 notifikasi/         # API notifikasi nilai
│   │   ├── 📁 santri/             # API manajemen santri
│   │   ├── 📁 ustadz/             # API manajemen pengajar
│   │   ├── 📁 nilai/              # API nilai dengan auto-notifikasi
│   │   ├── 📁 absensi/            # API absensi
│   │   ├── 📁 asrama/             # API manajemen asrama
│   │   ├── 📁 keuangan/           # API keuangan
│   │   ├── 📁 tahfidz/            # API tahfidz
│   │   ├── 📁 kelas/              # API manajemen kelas
│   │   └── 📁 users/              # API manajemen user
│   ├── 📁 config/
│   │   └── database.php           # Konfigurasi database
│   └── 📁 db/
│       └── db.sql                 # Schema database lengkap
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 admin/          # Komponen untuk admin
│   │   │   │   ├── Dashboard.js   # Dashboard admin dengan statistik role
│   │   │   │   ├── KelolaMapel.js # Kelola mata pelajaran & KKM
│   │   │   │   ├── Komunikasi.js  # Sistem komunikasi
│   │   │   │   ├── KelolaJadwal.js # Jadwal dinamis
│   │   │   │   └── ...
│   │   │   ├── 📁 pengajar/       # Komponen untuk pengajar
│   │   │   ├── 📁 siswa/          # Komponen untuk santri
│   │   │   │   ├── NotifikasiNilai.js # Dashboard notifikasi
│   │   │   │   └── ...
│   │   │   └── 📁 shared/         # Komponen shared
│   │   └── ...
│   └── 📁 public/
└── 📄 README.md                   # Dokumentasi ini
```

## 🚀 **Instalasi & Setup**

### **Prasyarat**
- XAMPP/Laragon (PHP 8.0+, MySQL 8.0+)
- Node.js 16+ & npm
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/ImamAriadi2022/web-pesantren.git
cd web-pesantren
```

### **2. Setup Backend**
```bash
# Letakkan folder project di htdocs/www
# Contoh: C:\laragon\www\web-pesantren\
```

**🚀 Auto Setup Database (Recommended)**:
```
1. Buka phpMyAdmin → Buat database 'web_pesantren'
2. Akses: http://localhost/web-pesantren/backend/setup_data.php
3. Klik: "Setup Semua Data"
4. Login: admin@pesantren.com / admin
```

**Manual Setup Database** (jika diperlukan):
```bash
# Import database schema
# Buka phpMyAdmin → Buat database 'web_pesantren'
# Import file: backend/db/db.sql
```

> 📖 **Dokumentasi Setup Data**: 
> - [DATABASE_SETUP.md](DATABASE_SETUP.md) - Schema database dan SQL scripts
> - [DATA_SETUP_GUIDE.md](DATA_SETUP_GUIDE.md) - Panduan setup data template auto-generator

### **3. Konfigurasi Database**
Edit `backend/config/database.php`:
```php
$host = 'localhost';
$dbname = 'web_pesantren';
$username = 'root';
$password = '';  // Sesuaikan dengan setup MySQL Anda
```

### **4. Setup Frontend**
```bash
cd frontend
npm install
npm start
```

### **5. Akses Aplikasi**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost/web-pesantren/backend/api/

## 👤 **Default Login Credentials**

Setelah import database, gunakan kredensial berikut:

### **Admin**
- Email: `admin@pesantren.com`
- Password: `admin123`

### **Pengajar**
- Email: `pengajar@pesantren.com` 
- Password: `pengajar123`

### **Santri**
- Email: `santri@pesantren.com`
- Password: `santri123`

## 🔧 **Konfigurasi Environment**

### **Backend Environment**
Pastikan PHP extensions berikut aktif:
- `pdo_mysql`
- `mysqli`
- `json`
- `mbstring`

### **Frontend Environment**
File `.env` di folder frontend:
```
REACT_APP_API_URL=http://localhost/web-pesantren/backend/api
REACT_APP_BASE_URL=http://localhost/web-pesantren/backend
```

## 📱 **Panduan Penggunaan**

### **Untuk Admin**
1. **Dashboard**: Lihat statistik user roles dan aktivitas sistem
2. **Kelola Pengguna**: Tambah/edit admin, pengajar, santri
3. **Kelola Mata Pelajaran**: Set KKM untuk setiap mapel
4. **Kelola Jadwal**: Buat jadwal tanpa konflik waktu
5. **Komunikasi**: Monitor komunikasi dalam sistem

### **Untuk Pengajar**
1. **Input Nilai**: Masukkan nilai dengan notifikasi otomatis ke santri
2. **Kelola Jadwal**: Lihat dan kelola jadwal mengajar
3. **Komunikasi**: Chat dengan santri atau broadcast ke kelas
4. **Absensi**: Input kehadiran santri
5. **Mata Pelajaran**: Set KKM sesuai bidang keahlian

### **Untuk Santri**
1. **Dashboard**: Lihat ringkasan nilai dan aktivitas
2. **Notifikasi**: Terima notifikasi real-time untuk nilai baru
3. **Komunikasi**: Chat dengan pengajar
4. **Jadwal**: Lihat jadwal pelajaran
5. **Nilai**: Monitor perkembangan akademik

## 🔄 **Fitur Baru v2.0.0**

### ✅ **Bug Fixes**
- **Fixed**: Admin role reading issues pada dashboard
- **Fixed**: Database schema improvements untuk support fitur baru
- **Improved**: Error handling dan loading states

### 🆕 **New Features**
- **KKM Management**: Input dan kelola Kriteria Ketuntasan Minimal
- **Communication System**: Chat terintegrasi guru-santri dengan status baca
- **Auto Notifications**: Notifikasi otomatis saat ada nilai baru
- **Smart Scheduling**: Jadwal dinamis dengan deteksi konflik otomatis
- **Enhanced Dashboard**: Statistik user roles dan aktivitas real-time

### 🛠️ **Technical Improvements**
- **New APIs**: 5+ endpoint baru untuk fitur komunikasi dan notifikasi
- **Database Schema**: 3 tabel baru (komunikasi, pengumuman, notifikasi_nilai)
- **Frontend Components**: 5 komponen baru dengan UI/UX modern
- **Real-time Features**: Auto-refresh dan instant notifications

## 🐛 **Troubleshooting**

### **Database Connection Error**
```bash
# Periksa konfigurasi database.php
# Pastikan MySQL service aktif
# Cek nama database sudah benar
```

### **API Not Working**
```bash
# Pastikan Apache/Nginx aktif
# Cek file path API sudah benar
# Periksa CORS headers di API
```

### **Frontend Build Error**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

## 🤝 **Kontribusi**

Kami menyambut kontribusi dari developer lain! 

### **Cara Berkontribusi**
1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### **Development Guidelines**
- Ikuti coding standards PHP PSR-4 dan React best practices
- Tulis test untuk fitur baru
- Update dokumentasi untuk perubahan API
- Gunakan commit message yang deskriptif

## 📄 **License**

Project ini menggunakan [MIT License](LICENSE) - lihat file LICENSE untuk detail lengkap.

## 👨‍💻 **Tim Pengembang**

- **Lead Developer**: [ImamAriadi2022](https://github.com/ImamAriadi2022)
- **Project Type**: Islamic Education Management System
- **Development Period**: 2024-2025

## 📞 **Support & Contact**

- **GitHub Issues**: [Issues Page](https://github.com/ImamAriadi2022/web-pesantren/issues)
- **Documentation**: [Wiki](https://github.com/ImamAriadi2022/web-pesantren/wiki)
- **Email**: imam.ariadi.dev@gmail.com

## 📚 **Dokumentasi Lengkap**

- 📖 [README.md](README.md) - Panduan utama dan overview
- 🗃️ [DATABASE_SETUP.md](DATABASE_SETUP.md) - Schema database dan SQL setup
- 🗂️ [DATA_SETUP_GUIDE.md](DATA_SETUP_GUIDE.md) - Auto data generator & template
- 🔗 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Dokumentasi lengkap API endpoints
- 👥 [USER_GUIDE.md](USER_GUIDE.md) - Panduan penggunaan untuk user
- 📋 [RELEASE_NOTES.md](RELEASE_NOTES.md) - Changelog dan release notes
- 🚀 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Panduan deployment production

## 🔮 **Roadmap**

### **v2.1.0 (Coming Soon)**
- [ ] Mobile App (React Native)
- [ ] WhatsApp Integration untuk notifikasi
- [ ] Sistem backup otomatis
- [ ] Advanced reporting dengan charts

### **v2.2.0**
- [ ] E-learning module
- [ ] Video conference integration
- [ ] Parent portal
- [ ] Alumni tracking

---

## 📊 **Statistik Project**

- **Total Lines of Code**: 15,000+
- **Backend APIs**: 20+ endpoints
- **Frontend Components**: 30+ komponen
- **Database Tables**: 15+ tabel
- **Supported Users**: 1000+ concurrent users

---

**🎉 Terima kasih telah menggunakan Sistem Manajemen Pesantren Walisongo!**

*Semoga sistem ini bermanfaat untuk kemajuan pendidikan pesantren di Indonesia* 🇮🇩
