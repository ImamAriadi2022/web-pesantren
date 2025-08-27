# Update PSB dan Footer ke Dynamic Data

## ✅ Perubahan yang Sudah Dilakukan:

### 1. **Database Schema Update**
- **Tabel `pengaturan_web`** - Ditambahkan kolom PSB:
  - `psb_tahun_ajaran` - Tahun ajaran PSB
  - `psb_status` - Status PSB (Dibuka/Ditutup/Selesai)
  - `psb_tanggal_buka` - Tanggal buka pendaftaran
  - `psb_tanggal_tutup` - Tanggal tutup pendaftaran
  - `psb_kuota` - Kuota santri baru
  - `psb_biaya_pendaftaran` - Biaya pendaftaran
  - `psb_persyaratan` - Persyaratan pendaftaran
  - `psb_pdf` - Path file brosur PSB

- **Removed**: Tabel `psb` yang terpisah (tidak diperlukan lagi)

### 2. **Backend API Updates**
- **`getSettingsPublic.php`** - Updated untuk include data PSB dari tabel `pengaturan_web`
- **Removed**: `getPsbPublic.php` - API terpisah tidak diperlukan lagi
- **Centralized**: Semua data website dan PSB dalam satu API endpoint

### 3. **Frontend Component Updates**

#### **LP_Psb.js** (Komponen PSB):
- ✅ Menggunakan satu API call: `getSettingsPublic.php`
- ✅ Display dinamis: tahun ajaran, status, kuota, biaya pendaftaran
- ✅ Persyaratan pendaftaran dinamis dari database
- ✅ Contact info (WhatsApp, Email) dinamis
- ✅ PDF brosur path dinamis

#### **Footer.js** (Sudah Dynamic):
- ✅ Nama instansi dari `footer_web` 
- ✅ Email dari `email_instansi`
- ✅ Telepon dari `telp`
- ✅ Alamat dari `alamat_instansi`
- ✅ Copyright dinamis dengan tahun otomatis

### 4. **Data yang Sekarang Dynamic**

#### **PSB (Penerimaan Santri Baru):**
- ✅ Tahun Ajaran
- ✅ Status Pendaftaran (Dibuka/Ditutup)
- ✅ Kuota Santri
- ✅ Biaya Pendaftaran  
- ✅ Persyaratan Pendaftaran
- ✅ Contact Info (WhatsApp & Email)
- ✅ File Brosur PDF

#### **Footer Website:**
- ✅ Nama Lembaga
- ✅ Email Kontak
- ✅ Nomor Telepon
- ✅ Alamat Lengkap
- ✅ Copyright Text

#### **Landing Page Components:**
- ✅ Navbar dengan logo dan nama dinamis
- ✅ Hero section dengan tagline dinamis
- ✅ About section dengan deskripsi dinamis
- ✅ Contact section dengan info kontak dinamis

## 🎯 **Benefits:**

1. **Single Source of Truth**: Semua data website di tabel `pengaturan_web`
2. **Easy Management**: Admin bisa update semua info dari satu tempat
3. **Performance**: Lebih efisien dengan satu API call
4. **Consistency**: Data konsisten di seluruh website
5. **Maintainability**: Mudah maintain dan update

## 📝 **Cara Update Data:**

### Via Admin Panel:
1. Login sebagai Admin
2. Masuk ke "Pengaturan Web"
3. Update data yang diperlukan
4. Save - otomatis ter-reflect di seluruh website

### Via Database (Jika diperlukan):
```sql
UPDATE pengaturan_web SET 
    psb_tahun_ajaran = '2025/2026',
    psb_status = 'Dibuka',
    psb_kuota = 150,
    psb_biaya_pendaftaran = 'Rp 100.000',
    psb_persyaratan = 'Updated requirements...'
WHERE id = 1;
```

## 🔧 **Technical Details:**

### API Endpoint:
- **URL**: `http://localhost/web-pesantren/backend/api/public/getSettingsPublic.php`
- **Method**: GET
- **Response**: JSON dengan semua data website + PSB

### Frontend Usage:
```javascript
// Semua komponen menggunakan pattern yang sama
const [settings, setSettings] = useState({});

const fetchSettings = async () => {
  const response = await fetch('http://localhost/web-pesantren/backend/api/public/getSettingsPublic.php');
  const result = await response.json();
  if (result.success) {
    setSettings(result.data);
  }
};
```

## ⚠️ **Important Notes:**

1. **Fallback Values**: Semua komponen memiliki default values jika API gagal
2. **Error Handling**: Proper error handling untuk semua API calls
3. **Performance**: Data di-cache di state untuk mencegah multiple API calls
4. **Responsive**: Semua komponen tetap responsive dengan data dinamis

## 🧪 **Testing:**

1. **Access PSB Page**: `http://localhost:3000/psb`
2. **Check Footer**: Tampil di semua halaman dengan data dinamis
3. **Admin Panel**: Test update data via pengaturan web
4. **API Testing**: Test endpoint `getSettingsPublic.php` di browser

Semua komponen sekarang sudah **100% dinamis** dan mengambil data dari database! 🎉
