# 🚀 **API Documentation - Sistem Pesantren v2.0**

## 📋 **Daftar Isi**
- [Overview](#overview)
- [Authentication](#authentication)
- [Core APIs](#core-apis)
- [New APIs v2.0](#new-apis-v20)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

## 🌐 **Overview**

Base URL: `http://localhost/web-pesantren/backend/api/`

All APIs menggunakan:
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Content-Type**: `application/json`
- **CORS**: Enabled untuk development
- **Encoding**: UTF-8

## 🔐 **Authentication**

### **Login System**
```http
POST /login.php
Content-Type: application/json

{
  "email": "admin@pesantren.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user_id": 1,
    "email": "admin@pesantren.com",
    "role": "admin",
    "nama": "Administrator"
  }
}
```

## 📚 **Core APIs**

### **👤 Users Management**
```http
# Get all users
GET /users/getUsers.php

# Create user
POST /users/createUser.php
{
  "email": "user@example.com",
  "password": "password123",
  "role": "santri",
  "nama": "Nama User"
}

# Update user
PUT /users/updateUser.php
{
  "id": 1,
  "email": "updated@example.com",
  "role": "pengajar"
}

# Delete user
DELETE /users/deleteUser.php?id=1
```

### **🎓 Santri Management**
```http
# Get all santri
GET /santri/getSantri.php

# Get santri by ID
GET /santri/getSantri.php?id=1

# Create santri
POST /santri/createSantri.php
{
  "user_id": 2,
  "nama": "Ahmad Santri",
  "nis": "2024001",
  "jenis_kelamin": "Laki-laki",
  "tanggal_lahir": "2010-01-15",
  "alamat": "Jl. Pesantren No. 1",
  "nama_wali": "Bapak Ahmad",
  "no_hp_wali": "08123456789"
}

# Update santri
PUT /santri/updateSantri.php
{
  "id": 1,
  "nama": "Ahmad Santri Updated",
  "alamat": "Alamat Baru"
}

# Delete santri
DELETE /santri/deleteSantri.php?id=1
```

### **👨‍🏫 Ustadz Management**
```http
# Get all ustadz
GET /ustadz/getUstadz.php

# Create ustadz
POST /ustadz/saveUstadz.php
{
  "user_id": 3,
  "nama": "Ahmad Ustadz",
  "nik": "1234567890123456",
  "jenis_kelamin": "Laki-laki",
  "bidang_keahlian": "Fiqh",
  "tanggal_bergabung": "2024-01-01"
}

# Delete ustadz
DELETE /ustadz/deleteUstadz.php?id=1
```

### **🏫 Kelas Management**
```http
# Get all kelas
GET /kelas/getAllClass.php

# Create kelas
POST /kelas/createClass.php
{
  "kode_kelas": "K001",
  "nama_kelas": "Kelas 1 Alif",
  "tingkat": "1",
  "wali_kelas_id": 1,
  "kapasitas": 30
}

# Update kelas
PUT /kelas/updateClass.php
{
  "id": 1,
  "nama_kelas": "Kelas 1 Alif Updated",
  "kapasitas": 35
}

# Delete kelas
DELETE /kelas/deleteClass.php?id=1
```

## 🆕 **New APIs v2.0**

### **📚 Mata Pelajaran with KKM**
```http
# Get all mata pelajaran
GET /mapel/mapel.php

# Get mata pelajaran by ID
GET /mapel/mapel.php?id=1

# Create mata pelajaran
POST /mapel/mapel.php
{
  "kode_mapel": "MTK001",
  "nama_mapel": "Matematika",
  "deskripsi": "Matematika Dasar",
  "sks": 2,
  "kkm": 75,
  "kategori": "Umum",
  "status": "Aktif"
}

# Update mata pelajaran
PUT /mapel/mapel.php
{
  "id": 1,
  "kode_mapel": "MTK001",
  "nama_mapel": "Matematika Lanjut",
  "kkm": 80
}

# Delete mata pelajaran
DELETE /mapel/mapel.php?id=1
```

### **💬 Komunikasi System**
```http
# Get messages for user
GET /komunikasi/komunikasi.php?user_id=1

# Get messages by type
GET /komunikasi/komunikasi.php?tipe=Kelas&kelas_id=1

# Send private message
POST /komunikasi/komunikasi.php
{
  "pengirim_id": 1,
  "penerima_id": 2,
  "judul": "Tugas Matematika",
  "pesan": "Silakan kerjakan tugas halaman 25-30",
  "tipe": "Pribadi"
}

# Send class broadcast
POST /komunikasi/komunikasi.php
{
  "pengirim_id": 1,
  "judul": "Pengumuman Ujian",
  "pesan": "UTS akan dilaksanakan minggu depan",
  "tipe": "Kelas",
  "kelas_id": 1
}

# Mark as read
PUT /komunikasi/komunikasi.php
{
  "id": 1,
  "status": "Dibaca"
}

# Delete message
DELETE /komunikasi/komunikasi.php?id=1
```

### **🔔 Notifikasi Nilai**
```http
# Get notifications for santri
GET /notifikasi/notifikasi_nilai.php?santri_id=1

# Get unread notifications
GET /notifikasi/notifikasi_nilai.php?santri_id=1&status=Belum Dibaca

# Mark notification as read
PUT /notifikasi/notifikasi_nilai.php
{
  "id": 1,
  "status": "Sudah Dibaca"
}

# Delete notification
DELETE /notifikasi/notifikasi_nilai.php?id=1
```

### **📅 Smart Jadwal System**
```http
# Get all jadwal
GET /jadwal/jadwal.php

# Get jadwal by kelas
GET /jadwal/jadwal.php?kelas_id=1

# Get jadwal by ustadz
GET /jadwal/jadwal.php?ustadz_id=1

# Get jadwal by hari
GET /jadwal/jadwal.php?hari=Senin

# Create jadwal (with conflict detection)
POST /jadwal/jadwal.php
{
  "kelas_id": 1,
  "mapel_id": 1,
  "ustadz_id": 1,
  "hari": "Senin",
  "jam_mulai": "08:00",
  "jam_selesai": "09:30",
  "ruangan": "R101",
  "tahun_ajaran": "2024/2025",
  "semester": "Ganjil"
}

# Update jadwal
PUT /jadwal/jadwal.php
{
  "id": 1,
  "jam_mulai": "08:30",
  "jam_selesai": "10:00"
}

# Delete jadwal
DELETE /jadwal/jadwal.php?id=1
```

### **📊 Enhanced Dashboard Stats**
```http
# Get user statistics by role
GET /dashboard/getUserStats.php

Response:
{
  "success": true,
  "data": {
    "userRoles": {
      "admin": 5,
      "pengajar": 25,
      "santri": 200
    },
    "totalSantri": 200,
    "totalPengajar": 25,
    "totalAsrama": 8,
    "totalKelas": 12,
    "recentActivities": {
      "nilai": 45,
      "absensi": 120
    }
  }
}
```

## 📝 **Nilai with Auto-Notification**
```http
# Get all nilai
GET /nilai/getNilai.php

# Create nilai (triggers auto-notification)
POST /nilai/saveNilai.php
{
  "santri_id": 1,
  "mapel_id": 1,
  "jenis_nilai": "UTS",
  "nilai": 85,
  "bobot": 1.0,
  "keterangan": "Ujian Tengah Semester",
  "tahun_ajaran": "2024/2025",
  "semester": "Ganjil"
}

# Update nilai
PUT /nilai/saveNilai.php
{
  "id": 1,
  "nilai": 90,
  "keterangan": "Nilai direvisi"
}

# Delete nilai
DELETE /nilai/deleteNilai.php?id=1
```

## 🏠 **Asrama Management**
```http
# Get all asrama
GET /asrama/getAsrama.php

# Create asrama
POST /asrama/saveAsrama.php
{
  "nama_asrama": "Asrama Putra 1",
  "kode_asrama": "AP001",
  "kapasitas": 50,
  "lokasi": "Blok A",
  "jenis": "Putra",
  "penanggung_jawab_id": 1,
  "fasilitas": "AC, WiFi, Kamar Mandi Dalam"
}

# Delete asrama
DELETE /asrama/deleteAsrama.php?id=1
```

## 💰 **Keuangan Management**
```http
# Get all transaksi
GET /keuangan/getKeuangan.php

# Create transaksi
POST /keuangan/saveKeuangan.php
{
  "santri_id": 1,
  "kode_transaksi": "TRX001",
  "jenis_transaksi": "Pemasukan",
  "kategori": "SPP",
  "jumlah": 500000,
  "tanggal_transaksi": "2024-07-14",
  "metode_pembayaran": "Transfer",
  "keterangan": "SPP Bulan Juli 2024"
}

# Delete transaksi
DELETE /keuangan/deleteKeuangan.php?id=1
```

## 📖 **Tahfidz Management**
```http
# Get tahfidz progress
GET /tahfidz/getTahfidz.php

# Create tahfidz record
POST /tahfidz/saveTahfidz.php
{
  "santri_id": 1,
  "surat": "Al-Fatihah",
  "ayat_mulai": 1,
  "ayat_selesai": 7,
  "tanggal_mulai": "2024-07-01",
  "target_selesai": "2024-07-14",
  "status": "Sedang Hafalan",
  "pembimbing_id": 1
}

# Delete tahfidz record
DELETE /tahfidz/deleteTahfidz.php?id=1
```

## 📊 **Response Format**

### **Success Response**
```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {
    // Data response
  }
}
```

### **Error Response**
```json
{
  "success": false,
  "error": "Pesan error",
  "code": 400
}
```

### **Pagination Response**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

## ⚠️ **Error Handling**

### **HTTP Status Codes**
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict (jadwal bentrok)
- **422**: Validation Error
- **500**: Internal Server Error

### **Common Errors**

#### **Validation Error**
```json
{
  "success": false,
  "error": "Data tidak valid",
  "details": {
    "nama": "Nama harus diisi",
    "email": "Format email tidak valid"
  }
}
```

#### **Conflict Error (Jadwal)**
```json
{
  "success": false,
  "error": "Jadwal bentrok dengan jadwal yang sudah ada: Kelas 1A - Matematika (08:00-09:30)"
}
```

#### **Not Found Error**
```json
{
  "success": false,
  "error": "Data tidak ditemukan"
}
```

## 🔧 **API Testing**

### **Using cURL**
```bash
# GET Request
curl -X GET "http://localhost/web-pesantren/backend/api/santri/getSantri.php"

# POST Request
curl -X POST "http://localhost/web-pesantren/backend/api/santri/createSantri.php" \
  -H "Content-Type: application/json" \
  -d '{"nama":"Ahmad","nis":"2024001","jenis_kelamin":"Laki-laki"}'

# PUT Request
curl -X PUT "http://localhost/web-pesantren/backend/api/santri/updateSantri.php" \
  -H "Content-Type: application/json" \
  -d '{"id":1,"nama":"Ahmad Updated"}'

# DELETE Request
curl -X DELETE "http://localhost/web-pesantren/backend/api/santri/deleteSantri.php?id=1"
```

### **Using Postman**
1. Import collection dari file `postman_collection.json`
2. Set base URL: `http://localhost/web-pesantren/backend/api`
3. Test semua endpoints

## 🚀 **Performance Tips**

### **Pagination**
```http
GET /santri/getSantri.php?page=1&limit=10
```

### **Filtering**
```http
GET /santri/getSantri.php?status=Aktif&jenis_kelamin=Laki-laki
```

### **Sorting**
```http
GET /santri/getSantri.php?sort=nama&order=ASC
```

### **Search**
```http
GET /santri/getSantri.php?search=Ahmad
```

---

**📝 Note**: Semua API telah terintegrasi dengan sistem notifikasi real-time dan deteksi konflik otomatis untuk pengalaman pengguna yang optimal.
