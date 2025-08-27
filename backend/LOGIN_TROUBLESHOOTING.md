# 🔧 Fix Login Issue - Troubleshooting Guide

## ❌ **Masalah yang Ditemukan:**

1. **Field Mismatch**: Login.php menggunakan `email` field, tapi schema_clean.sql menggunakan `username`
2. **Role Case Sensitivity**: Login.php cek `'santri'` tapi di schema role-nya `'Santri'`
3. **Missing user_id relation**: Schema clean tidak punya kolom `user_id` di tabel santri/ustadz

## ✅ **Yang Sudah Diperbaiki:**

### **1. Login.php Updates:**
- ✅ Support `username` field untuk login
- ✅ Fixed role check: `'Santri'` dan `'Ustadz'` (bukan lowercase)
- ✅ Gunakan nama matching untuk mencari santri_id/ustadz_id
- ✅ Error message sekarang "Username atau password salah"

### **2. Authentication Flow:**
- ✅ Login dengan username (support backward compatibility email field)
- ✅ Match user dengan santri/ustadz berdasarkan nama
- ✅ Set proper session variables

## 🧪 **Cara Testing Login:**

### **1. Admin Login:**
```
Username: [sesuai setup admin - misal: admin]
Password: [sesuai setup admin - misal: admin123]
```

### **2. Santri Login (Sample):**
```
Username: sant001  |  Password: sant001123
Username: sant002  |  Password: sant002123  
Username: sant003  |  Password: sant003123
```

### **3. Ustadz Login (Sample):**
```
Username: ust001  |  Password: ust001123
Username: ust002  |  Password: ust002123
Username: ust003  |  Password: ust003123
```

## 🔍 **Debug Steps:**

### **1. Cek Database Setup:**
- Pastikan database sudah di-setup via `setup.html`
- Pastikan ada data di tabel `users`, `santri`, `ustadz`

### **2. Verify Database Connection:**
```sql
-- Cek users table
SELECT * FROM users LIMIT 5;

-- Cek santri table  
SELECT * FROM santri LIMIT 5;

-- Cek ustadz table
SELECT * FROM ustadz LIMIT 5;
```

### **3. Check Debug Log:**
- File: `backend/debug.log` atau `backend/api/debug.log`
- Log akan menunjukkan:
  - Username yang diterima
  - Apakah user ditemukan
  - Password verification result

### **4. Test API Directly:**
```bash
curl -X POST http://localhost/web-pesantren/backend/api/login.php \
-H "Content-Type: application/json" \
-d '{"email":"sant001","password":"sant001123"}'
```

## 🚨 **Common Issues & Solutions:**

### **Issue 1: "User tidak ditemukan"**
- **Solution**: Pastikan database sudah di-setup dengan data dummy
- **Check**: `SELECT * FROM users WHERE username = 'sant001'`

### **Issue 2: "Password tidak cocok"**
- **Solution**: Password di-hash dengan `password_hash()`, pastikan data setup benar
- **Check**: Password default dari setup adalah username + "123"

### **Issue 3: "santri_id tidak ditemukan"**
- **Solution**: Nama di tabel users harus sama dengan nama di tabel santri
- **Check**: `SELECT u.nama, s.nama FROM users u LEFT JOIN santri s ON u.nama = s.nama`

### **Issue 4: CORS Error**
- **Solution**: Pastikan frontend dan backend di domain yang benar
- **Check**: Headers sudah ada di login.php

## 📋 **Verification Checklist:**

### **Database Setup:**
- [ ] Database `web_pesantren` exists
- [ ] Table `users` has data
- [ ] Table `santri` has data  
- [ ] Table `ustadz` has data
- [ ] Names match between users and santri/ustadz tables

### **API Testing:**
- [ ] Login.php accessible via browser
- [ ] POST request works
- [ ] Returns proper JSON response
- [ ] Debug log shows correct data

### **Frontend Integration:**
- [ ] Login form sends correct data format
- [ ] Response handling works
- [ ] Redirect after login works
- [ ] Session storage works

## 🎯 **Expected Login Response:**

### **Successful Login:**
```json
{
    "success": true,
    "message": "Login berhasil",
    "role": "Santri",
    "user_id": 16,
    "username": "sant001", 
    "nama": "Muhammad Rizki Pratama",
    "santri_id": 1
}
```

### **Failed Login:**
```json
{
    "success": false,
    "message": "Username atau password salah"
}
```

## ⚡ **Quick Fix Commands:**

### **Reset & Setup Database:**
1. Access: `http://localhost/web-pesantren/backend/db/setup.html`
2. Click "Reset Database" 
3. Fill admin credentials
4. Click "Setup Data Dummy"

### **Test Login Immediately:**
- Username: `sant001` | Password: `sant001123`
- Atau username admin sesuai setup

Login seharusnya sudah working sekarang! 🎉
