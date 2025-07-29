# API Surat Izin Keluar

## Base URL
```
http://localhost:8000/api/surat_izin/surat_izin.php
```

## Endpoints

### 1. GET - Mengambil semua surat izin
**URL:** `GET /api/surat_izin/surat_izin.php`

**Query Parameters (optional):**
- `status` - Filter berdasarkan status (pending, approved, rejected, returned)
- `santri_id` - Filter berdasarkan ID santri
- `start_date` - Filter tanggal mulai (format: YYYY-MM-DD)
- `end_date` - Filter tanggal akhir (format: YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nomor_surat": "SI/001/PST/07/2025",
      "santri_id": 1,
      "jenis_izin": "Lainnya",
      "tanggal_keluar": "2025-07-29",
      "tanggal_masuk": "",
      "jam_keluar": null,
      "jam_masuk": null,
      "tujuan": "",
      "keperluan": "Test surat izin",
      "penanggung_jawab": "",
      "telepon_penanggung_jawab": "",
      "status": "Disetujui",
      "disetujui_oleh": null,
      "catatan_persetujuan": "Disetujui untuk test",
      "created_at": "29/07/2025 04:13",
      "updated_at": "2025-07-29 04:13:58",
      "nama_santri": "Ahmad Fauzi Santoso",
      "nis": "2023001",
      "nama_kelas": "Kelas 1A",
      "nama_asrama": "Asrama Al-Ikhlas",
      "disetujui_email": null,
      "tanggal_kembali": "",
      "alasan": "Test surat izin",
      "alamat_tujuan": "",
      "nomor_hp_wali": ""
    }
  ],
  "total": 1
}
```

### 2. GET - Mengambil surat izin berdasarkan ID
**URL:** `GET /api/surat_izin/surat_izin.php?id=1`

**Response:**
```json
{
  "success": true,
  "data": {
    // Same structure as above but single object
  }
}
```

### 3. POST - Membuat surat izin baru
**URL:** `POST /api/surat_izin/surat_izin.php`

**Request Body:**
```json
{
  "id_santri": 1,
  "jenis_izin": "sakit",
  "tanggal_keluar": "2025-07-29",
  "tanggal_masuk": "2025-07-30",
  "jam_keluar": "08:00",
  "jam_masuk": "16:00",
  "tujuan": "Rumah Sakit",
  "alasan": "Kontrol dokter",
  "penanggung_jawab": "Orang Tua",
  "nomor_hp_wali": "08123456789",
  "status": "pending"
}
```

**Field Mapping:**
- `id_santri` atau `santri_id` - ID santri
- `tanggal_keluar` atau `tanggal_izin` - Tanggal keluar
- `tanggal_masuk` atau `tanggal_kembali` - Tanggal kembali
- `tujuan` atau `alamat_tujuan` - Alamat tujuan
- `keperluan` atau `alasan` - Alasan izin
- `telepon_penanggung_jawab` atau `nomor_hp_wali` - Nomor HP wali

**Status Values:**
- `pending` → "Diajukan"
- `approved` → "Disetujui"
- `rejected` → "Ditolak"
- `returned` → "Selesai"

**Jenis Izin Values:**
- `sakit` → "Sakit"
- `acara_keluarga` → "Keperluan Keluarga"
- `pulang_kampung` → "Keperluan Keluarga"
- `keperluan_penting` → "Urusan Penting"
- `urusan_keluarga` → "Keperluan Keluarga"
- `lainnya` → "Lainnya"

**Response:**
```json
{
  "success": true,
  "message": "Surat izin berhasil diajukan",
  "nomor_surat": "SI/001/PST/07/2025"
}
```

### 4. PUT - Update surat izin
**URL:** `PUT /api/surat_izin/surat_izin.php`

**Request Body:**
```json
{
  "id": 1,
  "status": "approved",
  "catatan_persetujuan": "Disetujui untuk test",
  "disetujui_oleh": 1
}
```

**Note:** Hanya field yang dikirim yang akan diupdate.

**Response:**
```json
{
  "success": true,
  "message": "Surat izin berhasil diupdate"
}
```

### 5. DELETE - Hapus surat izin
**URL:** `DELETE /api/surat_izin/surat_izin.php`

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Surat izin berhasil dihapus"
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## Setup Instructions

1. Pastikan MySQL server berjalan
2. Import database schema dari `backend/db/db-fix.sql`
3. Jalankan PHP server dengan user yang memiliki akses ke MySQL socket:
   ```bash
   sudo -u mysql php -S 0.0.0.0:8000 -t backend
   ```
4. Test API dengan curl atau frontend application