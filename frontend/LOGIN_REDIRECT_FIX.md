# 🔧 Fix Login Redirect Issue

## ❌ **Masalah Redirect yang Ditemukan:**

1. **Wrong API URL**: Menggunakan `backend/index.php?request=login` (tidak ada)
2. **Case Sensitivity**: Check role `'admin'` tapi di database `'Admin'`
3. **Missing localStorage**: Data login tidak disimpan
4. **Form Label**: Masih "Email" padahal seharusnya "Username"

## ✅ **Yang Sudah Diperbaiki:**

### **1. Navbar.js Updates:**
- ✅ **API URL**: Sekarang menggunakan `/backend/api/login.php`
- ✅ **Role Check**: `'Admin'`, `'Ustadz'`, `'Santri'` (proper case)
- ✅ **localStorage**: Data disimpan dengan `authUtils.setCurrentUser()`
- ✅ **Form**: Label berubah dari "Email" ke "Username"
- ✅ **Reset Form**: Form di-reset setelah login berhasil

### **2. Auth.js Updates:**
- ✅ **Backward Compatible**: Support format response login baru
- ✅ **User Data**: Menyimpan `santri_id`, `ustadz_id` untuk dynamic auth
- ✅ **Clean Logout**: Hapus semua data login dari localStorage

### **3. Redirect Logic:**
```javascript
if (result.role === 'Admin') {
  navigate('/admin');
} else if (result.role === 'Ustadz') {
  navigate('/pengajar');
} else if (result.role === 'Santri') {
  navigate('/santri');
}
```

## 🧪 **Testing Redirect:**

### **Test Scenarios:**
1. **Admin Login** → Redirect ke `/admin`
2. **Ustadz Login** → Redirect ke `/pengajar`  
3. **Santri Login** → Redirect ke `/santri`

### **Sample Credentials:**
```bash
# Admin (setup custom)
Username: admin  |  Password: admin123

# Santri
Username: sant001  |  Password: sant001123  →  /santri
Username: sant002  |  Password: sant002123  →  /santri

# Ustadz  
Username: ust001  |  Password: ust001123  →  /pengajar
Username: ust002  |  Password: ust002123  →  /pengajar
```

## 🔍 **Debug Steps jika Masih Tidak Redirect:**

### **1. Check Browser Console:**
```javascript
// Cek response login
console.log(result);

// Cek localStorage
console.log(localStorage.getItem('currentUser'));
```

### **2. Verify Routes Exist:**
- ✅ `/admin` route exists in App.js
- ✅ `/pengajar` route exists in App.js
- ✅ `/santri` route exists in App.js

### **3. Check Network Tab:**
- Request URL: `http://localhost/web-pesantren/backend/api/login.php`
- Method: POST
- Response: Should contain `success: true` dan role

### **4. Verify Database:**
```sql
-- Cek role yang ada
SELECT DISTINCT role FROM users;

-- Result should show: Admin, Ustadz, Santri
```

## ⚠️ **Common Issues:**

### **Issue 1: "Cannot read properties of undefined"**
- **Solution**: Clear localStorage dan login ulang
```javascript
localStorage.clear();
// Login again
```

### **Issue 2: Redirect ke 404**
- **Solution**: Pastikan routes ada di App.js
- **Check**: `/admin/*`, `/pengajar/*`, `/santri/*`

### **Issue 3: Role tidak dikenali**
- **Solution**: Pastikan role di database sama dengan check di frontend
- **Database**: `'Admin'`, `'Ustadz'`, `'Santri'` (proper case)

### **Issue 4: Login success tapi tidak redirect**
- **Solution**: Check apakah ada error di console
- **Check**: `navigate()` function import dan routing setup

## 📋 **Expected Flow:**

### **Login Success Response:**
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

### **LocalStorage Data:**
```json
{
    "id": 16,
    "username": "sant001",
    "nama": "Muhammad Rizki Pratama", 
    "role": "Santri",
    "santri_id": 1,
    "token": "authenticated"
}
```

### **Redirect Flow:**
1. **Login Submit** → API Call
2. **Success Response** → Save to localStorage
3. **Role Check** → Determine redirect target
4. **Navigate** → Redirect to appropriate dashboard

## 🎯 **Quick Test:**

1. **Clear Browser Cache/localStorage**
2. **Login dengan**: `sant001` / `sant001123`
3. **Expected**: Alert "Login berhasil sebagai Santri!"
4. **Expected**: Redirect ke `/santri` dashboard
5. **Verify**: Check localStorage has user data

Sekarang login redirect sudah **fixed** dan siap testing! 🚀
