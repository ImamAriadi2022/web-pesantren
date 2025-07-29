# API Fix Summary - Kelola Mapel, Jadwal, dan Nilai

## Masalah yang Ditemukan

1. **Database Connection Issues**: Beberapa API menggunakan class `Database` yang tidak konsisten dengan API lainnya
2. **Missing API Endpoints**: Banyak endpoint API yang dibutuhkan oleh frontend tidak ada
3. **Inconsistent API Responses**: Format response API tidak konsisten antara admin dan pengajar
4. **Missing Dependencies**: API endpoint untuk dropdown data dan relasi antar tabel tidak tersedia

## Solusi yang Diimplementasikan

### 1. Fixed Database Connection Issues

**Files Modified:**
- `./backend/api/nilai/getNilai.php`
- `./backend/api/nilai/deleteNilai.php`

**Changes:**
- Mengganti `$database = new Database(); $db = $database->getConnection();` dengan `global $pdo`
- Menyesuaikan semua query untuk menggunakan `$pdo` secara konsisten

### 2. Created Missing API Endpoints for Pengajar

**New Files Created:**

#### Mapel Management APIs:
- `./backend/api/mapel/getMapel.php` - Get all mata pelajaran data
- `./backend/api/mapel/saveMapel.php` - Create/Update mata pelajaran
- `./backend/api/mapel/deleteMapel.php` - Delete mata pelajaran

#### Supporting APIs:
- `./backend/api/public/getDropdownData.php` - Provides dropdown data for forms
- `./backend/api/kelas/getAllClass.php` - Get all class data for jadwal
- `./backend/api/ustadz/getUstadz.php` - Get all ustadz data for jadwal

### 3. Updated Frontend Components

**Files Modified:**
- `./frontend/src/components/pengajar/KelolaJadwal.js` - Updated to use consistent API endpoints

**Changes:**
- Replaced custom API calls with standard admin-like implementation
- Added proper error handling and alerts
- Unified UI/UX with admin components
- Added loading states and proper validation

### 4. API Endpoint Standardization

All API endpoints now follow consistent patterns:

#### Request Format:
```json
{
  "id": 123,  // for updates/deletes
  "field1": "value1",
  "field2": "value2"
}
```

#### Response Format:
```json
{
  "success": true/false,
  "message": "Success/Error message",
  "data": {...}  // for GET requests
}
```

## Database Schema Requirements

Ensure the following tables exist with proper columns:

### mata_pelajaran table:
```sql
CREATE TABLE mata_pelajaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_mapel VARCHAR(20) UNIQUE NOT NULL,
    nama_mapel VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    sks INT DEFAULT 1,
    kkm INT DEFAULT 75,
    kategori ENUM('Umum', 'Agama', 'Tahfidz', 'Keterampilan') DEFAULT 'Umum',
    status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### jadwal_pelajaran table:
```sql
CREATE TABLE jadwal_pelajaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kelas_id INT NOT NULL,
    mapel_id INT NOT NULL,
    ustadz_id INT NOT NULL,
    hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruangan VARCHAR(50),
    tahun_ajaran VARCHAR(10),
    semester ENUM('Ganjil', 'Genap') NOT NULL,
    status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
    FOREIGN KEY (ustadz_id) REFERENCES ustadz(id) ON DELETE CASCADE
);
```

### nilai table with KKM column:
```sql
-- Run this script to add KKM column if not exists
ALTER TABLE nilai ADD COLUMN kkm INT DEFAULT 75 AFTER nilai;
UPDATE nilai n 
JOIN mata_pelajaran mp ON n.mapel_id = mp.id 
SET n.kkm = mp.kkm 
WHERE n.kkm IS NULL OR n.kkm = 0;
```

## CRUD Operations Now Available

### Admin Role:
- ✅ Kelola Mapel (Create, Read, Update, Delete)
- ✅ Kelola Jadwal (Create, Read, Update, Delete)
- ✅ View Nilai (Read only - managed by pengajar)

### Pengajar Role:
- ✅ Kelola Mapel (Create, Read, Update, Delete)
- ✅ Kelola Jadwal (Create, Read, Update, Delete)
- ✅ Kelola Nilai (Create, Read, Update, Delete)

## Testing Instructions

1. **Database Setup:**
   ```sql
   -- Run the KKM column addition script
   SOURCE ./backend/db/add_kkm_column.sql;
   ```

2. **Test API Endpoints:**
   - Mapel APIs: `GET/POST/PUT/DELETE http://localhost/web-pesantren/backend/api/mapel/mapel.php`
   - Jadwal APIs: `GET/POST/PUT/DELETE http://localhost/web-pesantren/backend/api/jadwal/jadwal.php`
   - Nilai APIs: `GET/POST/PUT/DELETE http://localhost/web-pesantren/backend/api/nilai/`

3. **Test Frontend:**
   - Login as Admin: Test all CRUD operations in kelola mapel and jadwal
   - Login as Pengajar: Test all CRUD operations in kelola mapel, jadwal, and nilai

## API Endpoints Summary

### Mapel Management:
- `GET /backend/api/mapel/mapel.php` - Get all mapel
- `GET /backend/api/mapel/getMapel.php` - Get mapel (alternative format)
- `POST /backend/api/mapel/mapel.php` - Create mapel
- `POST /backend/api/mapel/saveMapel.php` - Create/Update mapel (alternative)
- `PUT /backend/api/mapel/mapel.php` - Update mapel
- `DELETE /backend/api/mapel/mapel.php?id=X` - Delete mapel
- `POST /backend/api/mapel/deleteMapel.php` - Delete mapel (alternative)

### Jadwal Management:
- `GET /backend/api/jadwal/jadwal.php` - Get all jadwal
- `POST /backend/api/jadwal/jadwal.php` - Create jadwal
- `PUT /backend/api/jadwal/jadwal.php` - Update jadwal
- `DELETE /backend/api/jadwal/jadwal.php?id=X` - Delete jadwal

### Nilai Management:
- `GET /backend/api/nilai/getNilai.php` - Get all nilai
- `POST /backend/api/nilai/saveNilai.php` - Create/Update nilai
- `POST /backend/api/nilai/deleteNilai.php` - Delete nilai

### Supporting APIs:
- `GET /backend/api/public/getDropdownData.php` - Get dropdown data
- `GET /backend/api/kelas/getAllClass.php` - Get all classes
- `GET /backend/api/ustadz/getUstadz.php` - Get all ustadz

## Notes

- All APIs include CORS headers for cross-origin requests
- Error handling is implemented with proper HTTP status codes
- Input validation is performed on all write operations
- Foreign key constraints prevent data integrity issues
- KKM values are automatically inherited from mata_pelajaran when creating nilai