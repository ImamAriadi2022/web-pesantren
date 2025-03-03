import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaUsers, FaCog, FaUserGraduate, FaBook, FaChalkboardTeacher, FaSchool, FaFileAlt, FaMoneyBillWave, FaSignOutAlt, FaExclamationTriangle, FaClipboardList } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: '#343a40', color: '#fff', height: '100vh', padding: '20px' }}>
      <div className="text-start mb-4">
        <img src="path/to/logo.png" alt="Logo" width="50" height="50" />
        <h4>Panel Admin</h4>
      </div>
      <div className="mb-4 text-start">
        <FaUserGraduate size={20} className="me-2" />
        Administrator
      </div>
      <div className="mb-4 text-start">
        <h6>ADMIN</h6>
        <Nav className="flex-column">
          <Nav.Link href="/admin/dashboard" className="text-white">
            <FaTachometerAlt className="me-2" /> Dashboard
          </Nav.Link>
          <Nav.Link href="/admin/kelola-pengguna" className="text-white">
            <FaUsers className="me-2" /> Kelola Pengguna
          </Nav.Link>
          <Nav.Link href="/admin/pengaturan-web" className="text-white">
            <FaCog className="me-2" /> Pengaturan Web
          </Nav.Link>
        </Nav>
      </div>
      <div className="mb-4 text-start">
        <h6>MASTER</h6>
        <Nav className="flex-column">
          <Nav.Link href="/admin/data-santri" className="text-white">
            <FaUserGraduate className="me-2" /> Data Santri
          </Nav.Link>
          <Nav.Link href="/admin/data-tahfidz" className="text-white">
            <FaBook className="me-2" /> Data Tahfidz
          </Nav.Link>
          <Nav.Link href="/admin/ustadz-ustadzah" className="text-white">
            <FaChalkboardTeacher className="me-2" /> Ustadz / Ustadzah
          </Nav.Link>
          <Nav.Link href="/admin/kelola-kelas" className="text-white">
            <FaSchool className="me-2" /> Kelola Kelas
          </Nav.Link>
          <Nav.Link href="/admin/surat-izin-keluar" className="text-white">
            <FaSignOutAlt className="me-2" /> Surat Izin Keluar
          </Nav.Link>
          <Nav.Link href="/admin/kelola-pelanggaran" className="text-white">
            <FaExclamationTriangle className="me-2" /> Kelola Pelanggaran
          </Nav.Link>
          <Nav.Link href="/admin/kelola-asrama" className="text-white">
            <FaSchool className="me-2" /> Kelola Asrama
          </Nav.Link>
          <Nav.Link href="/admin/kelola-psb" className="text-white">
            <FaClipboardList className="me-2" /> Kelola PSB
          </Nav.Link>
          <Nav.Link href="/admin/kelola-keuangan" className="text-white">
            <FaMoneyBillWave className="me-2" /> Kelola Keuangan
          </Nav.Link>
        </Nav>
      </div>
      <div className="mb-4">
        <h6>REPORT</h6>
        <Nav className="flex-column">
          <Nav.Link href="/admin/kelola-laporan" className="text-white">
            <FaFileAlt className="me-2" /> Kelola Laporan
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;