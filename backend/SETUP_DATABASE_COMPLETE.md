# 🎉 Setup Database dengan Data Dummy Santri & Ustadz

## ✅ **Data Dummy yang Ditambahkan:**

### **👨‍🎓 Data Santri (15 Santri):**
1. **Muhammad Rizki Pratama** (Kelas 1A) - Username: `sant001` | Password: `sant001123`
2. **Fatimah Azzahra** (Kelas 1A) - Username: `sant002` | Password: `sant002123`
3. **Abdullah Al-Mahdi** (Kelas 1B) - Username: `sant003` | Password: `sant003123`
4. **Khadijah binti Khuwailid** (Kelas 1B) - Username: `sant004` | Password: `sant004123`
5. **Ali Zainal Abidin** (Kelas 2A) - Username: `sant005` | Password: `sant005123`
6. **Ahmad Fauzi Rahman** (Kelas 2A) - Username: `sant006` | Password: `sant006123`
7. **Siti Nurhalimah** (Kelas 2B) - Username: `sant007` | Password: `sant007123`
8. **Muhammad Ikhsan Hidayat** (Kelas 2B) - Username: `sant008` | Password: `sant008123`
9. **Zainab binti Jahsh** (Kelas 3A) - Username: `sant009` | Password: `sant009123`
10. **Hamzah ibn Abdul Muttalib** (Kelas 3A) - Username: `sant010` | Password: `sant010123`
11. **Hafsah binti Umar** (Kelas 3B) - Username: `sant011` | Password: `sant011123`
12. **Saad ibn Abi Waqqas** (Kelas 3B) - Username: `sant012` | Password: `sant012123`
13. **Ummu Salamah** (Kelas 4A) - Username: `sant013` | Password: `sant013123`
14. **Khalid ibn Walid** (Kelas 5A) - Username: `sant014` | Password: `sant014123`
15. **Safiyyah binti Huyay** (Kelas 6A) - Username: `sant015` | Password: `sant015123`

### **👨‍🏫 Data Ustadz/Ustadzah (7 Ustadz):**
1. **Ustadz Ahmad Dahlan** - Username: `ust001` | Password: `ust001123`
   - Bidang: Al-Quran dan Hadits, Fiqh
2. **Ustadz Muhammad Abduh** - Username: `ust002` | Password: `ust002123`
   - Bidang: Al-Quran dan Hadits, Akidah Akhlak
3. **Ustadzah Fatimah Az-Zahra** - Username: `ust003` | Password: `ust003123`
   - Bidang: Bahasa Arab
4. **Ustadz Ali ibn Abi Thalib** - Username: `ust004` | Password: `ust004123`
   - Bidang: Matematika, IPA
5. **Ustadzah Aisyah binti Abu Bakar** - Username: `ust005` | Password: `ust005123`
   - Bidang: Bahasa Indonesia, PKN
6. **Ustadz Umar ibn Khattab** - Username: `ust006` | Password: `ust006123`
   - Bidang: Bahasa Inggris, Seni
7. **Ustadzah Khadijah binti Khuwailid** - Username: `ust007` | Password: `ust007123`
   - Bidang: Tahfidz Al-Quran, SKI

### **🏫 Data Kelas (9 Kelas):**
- **Kelas 1A** (K1A) - Kapasitas: 30
- **Kelas 1B** (K1B) - Kapasitas: 30
- **Kelas 2A** (K2A) - Kapasitas: 30
- **Kelas 2B** (K2B) - Kapasitas: 30
- **Kelas 3A** (K3A) - Kapasitas: 30
- **Kelas 3B** (K3B) - Kapasitas: 30
- **Kelas 4A** (K4A) - Kapasitas: 25
- **Kelas 5A** (K5A) - Kapasitas: 25
- **Kelas 6A** (K6A) - Kapasitas: 25

### **📚 Data Mata Pelajaran (14 Mapel):**
1. **Al-Quran dan Hadits** (AQ001)
2. **Akidah Akhlak** (AK002)
3. **Fiqh** (FQ003)
4. **Sejarah Kebudayaan Islam** (SKI004)
5. **Bahasa Arab** (BA005)
6. **Bahasa Indonesia** (BI006)
7. **Bahasa Inggris** (BE007)
8. **Matematika** (MAT008)
9. **Ilmu Pengetahuan Alam** (IPA009)
10. **Ilmu Pengetahuan Sosial** (IPS010)
11. **Pendidikan Kewarganegaraan** (PKN011)
12. **Tahfidz Al-Quran** (THF012)
13. **Seni dan Budaya** (SEN013)
14. **Olahraga** (OLR014)

### **⏰ Data Jadwal Pelajaran:**
- **Senin - Jumat**: 5 jam pelajaran per hari
- **Sabtu**: 3 jam pelajaran
- **Waktu**: 07:00 - 16:00 (dengan istirahat)
- **Ruangan**: A1, A2, B1, B2, C1, C2, C3

### **📊 Data Nilai (35 Nilai Sample):**
- **Jenis Nilai**: UTS, UAS, Tugas, Quiz, Praktek
- **Semester**: Ganjil
- **Range Nilai**: 76.50 - 94.00
- **7 Santri** pertama sudah memiliki nilai di berbagai mata pelajaran

## 🔧 **Cara Setup:**

### 1. **Akses Setup Page:**
```
http://localhost/web-pesantren/backend/db/setup.html
```

### 2. **Input Data Admin:**
- **Username**: (custom, minimal 3 karakter)
- **Password**: (custom, minimal 6 karakter)
- **Nama**: (custom nama admin)

### 3. **Klik Setup Data Dummy**
- Database akan terisi dengan semua data dummy
- Proses memakan waktu beberapa detik

## 🧪 **Testing Login:**

### **Admin Login:**
- Username: [sesuai input setup]
- Password: [sesuai input setup]
- Role: Admin

### **Santri Login (Sample):**
```
Username: sant001  |  Password: sant001123  |  Nama: Muhammad Rizki Pratama
Username: sant002  |  Password: sant002123  |  Nama: Fatimah Azzahra
Username: sant003  |  Password: sant003123  |  Nama: Abdullah Al-Mahdi
```

### **Ustadz Login (Sample):**
```
Username: ust001  |  Password: ust001123  |  Nama: Ustadz Ahmad Dahlan
Username: ust002  |  Password: ust002123  |  Nama: Ustadz Muhammad Abduh
Username: ust003  |  Password: ust003123  |  Nama: Ustadzah Fatimah Az-Zahra
```

## 📋 **Data Lengkap yang Tersedia:**

### **✅ Untuk Testing Santri:**
- ✅ Profile santri dengan foto placeholder
- ✅ Data kelas dan wali kelas
- ✅ Jadwal pelajaran per hari
- ✅ Nilai UTS, UAS, Tugas, Quiz
- ✅ Data wali santri dengan kontak

### **✅ Untuk Testing Ustadz:**
- ✅ Profile ustadz dengan bidang keahlian
- ✅ Mata pelajaran yang diampu
- ✅ Jadwal mengajar
- ✅ Data santri yang diajar

### **✅ Untuk Testing Admin:**
- ✅ Data lengkap semua santri dan ustadz
- ✅ Manajemen kelas dan mata pelajaran
- ✅ Data nilai dan jadwal
- ✅ Pengaturan sistem

## 🎯 **Benefits Data Dummy:**

1. **Realistic Testing**: Data santri dan ustadz yang realistis
2. **Complete Relationships**: Semua relasi tabel sudah terhubung
3. **Multi-User Testing**: Bisa test dengan 15 santri + 7 ustadz
4. **Full Features**: Semua fitur sistem bisa ditest
5. **Development Ready**: Siap untuk development dan demo

## ⚠️ **Important Notes:**

1. **Schema Used**: `schema_clean.sql` (bukan `db.sql`)
2. **User Authentication**: Semua user sudah memiliki akun login
3. **Data Relationships**: Foreign key constraints sudah benar
4. **Reset Option**: Bisa reset database dan setup ulang kapan saja

Setup database sekarang sudah **super lengkap** dengan data dummy yang realistis! 🚀
