// Dummy login system untuk testing santri dinamis
// File ini untuk development testing saja

import { authUtils } from './auth';

export const loginTestData = {
  // Dummy santri users
  santri: [
    {
      id: 1,
      santri_id: 1,
      username: 'santri001',
      nama: 'Muhammad Rizki Pratama',
      role: 'Santri',
      nis: '2024001',
      kelas_id: 1,
      token: 'dummy_token_santri_1'
    },
    {
      id: 2,
      santri_id: 2,
      username: 'santri002',
      nama: 'Fatimah Azzahra',
      role: 'Santri',
      nis: '2024002',
      kelas_id: 1,
      token: 'dummy_token_santri_2'
    },
    {
      id: 3,
      santri_id: 3,
      username: 'santri003',
      nama: 'Abdullah Al-Mahdi',
      role: 'Santri',
      nis: '2024003',
      kelas_id: 2,
      token: 'dummy_token_santri_3'
    }
  ],

  // Dummy ustadz users
  ustadz: [
    {
      id: 1,
      ustadz_id: 1,
      username: 'ustadz001',
      nama: 'Ustadz Ahmad Dahlan',
      role: 'Ustadz',
      nip: 'UST001',
      token: 'dummy_token_ustadz_1'
    }
  ],

  // Dummy admin users
  admin: [
    {
      id: 1,
      username: 'admin',
      nama: 'Administrator Pesantren',
      role: 'Admin',
      token: 'dummy_token_admin_1'
    }
  ]
};

// Function untuk simulate login
export const simulateLogin = (username, role = 'Santri') => {
  let users = [];
  
  switch (role) {
    case 'Santri':
      users = loginTestData.santri;
      break;
    case 'Ustadz':
      users = loginTestData.ustadz;
      break;
    case 'Admin':
      users = loginTestData.admin;
      break;
    default:
      users = loginTestData.santri;
  }

  const user = users.find(u => u.username === username);
  
  if (user) {
    authUtils.setCurrentUser(user);
    console.log(`Login berhasil sebagai ${role}:`, user);
    return true;
  } else {
    console.log(`User ${username} tidak ditemukan dalam ${role}`);
    return false;
  }
};

// Function untuk quick login testing
export const quickLogin = {
  santri1: () => simulateLogin('santri001', 'Santri'),
  santri2: () => simulateLogin('santri002', 'Santri'), 
  santri3: () => simulateLogin('santri003', 'Santri'),
  ustadz1: () => simulateLogin('ustadz001', 'Ustadz'),
  admin: () => simulateLogin('admin', 'Admin'),
  
  // Logout
  logout: () => authUtils.logout()
};

// Auto-login untuk development (uncomment untuk auto login)
// quickLogin.santri1();

export default { loginTestData, simulateLogin, quickLogin };
