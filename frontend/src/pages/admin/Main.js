import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';

// Admin pages
import Dashboard from '../../components/admin/Dashboard';
import KelolaPengguna from '../../components/admin/KelolaPengguna';
import PengaturanWeb from '../../components/admin/PengaturanWeb';
import DataSantri from '../../components/admin/DataSantri';
import DataTahfidz from '../../components/admin/DataTahfidz';
import UstadzUstadzah from '../../components/admin/UstadzUstadzah';
import KelolaKelas from '../../components/admin/KelolaKelas';
import SuratIzinKeluar from '../../components/admin/SuratIzinKeluar';
import KelolaPelanggaran from '../../components/admin/KelolaPelanggaran';
import KelolaAsrama from '../../components/admin/KelolaAsrama';
import KelolaPsb from '../../components/admin/KelolaPsb';
import KelolaKeuangan from '../../components/admin/KelolaKeuangan';
import KelolaLaporan from '../../components/admin/KelolaLaporan';

import './AdminMain.css'; // Import CSS file for animation

const AdminMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isRootPath = location.pathname === '/admin';

  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <Header toggleSidebar={toggleSidebar} />
      <Container fluid>
        <Row>
          <Col md={isSidebarOpen ? 2 : 0} className="p-0" style={{ height: '100vh', overflow: 'auto' }}>
            <Sidebar isOpen={isSidebarOpen} />
          </Col>
          <Col md={isSidebarOpen ? 10 : 12} className="p-4" style={{ height: '100vh', overflow: 'auto' }}>
            {isRootPath && (
              <div className="welcome-text" style={{ textAlign: 'center', marginTop: '20px', animation: 'fadeIn 2s ease-in-out' }}>
                <h2>Selamat Datang di Halaman Admin</h2>
                <p>Website Pesantren Walisongo Lampung Utara</p>
                <img src="/landing/masjid1.jpg" alt="Welcome" style={{ width: '350px', marginTop: '20px', animation: 'fadeIn 2s ease-in-out' }} />
              </div>
            )}
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="kelola-pengguna" element={<KelolaPengguna />} />
              <Route path="pengaturan-web" element={<PengaturanWeb />} />
              <Route path="data-santri" element={<DataSantri />} />
              <Route path="data-tahfidz" element={<DataTahfidz />} />
              <Route path="ustadz-ustadzah" element={<UstadzUstadzah />} />
              <Route path="kelola-kelas" element={<KelolaKelas />} />
              <Route path="surat-izin-keluar" element={<SuratIzinKeluar />} />
              <Route path="kelola-pelanggaran" element={<KelolaPelanggaran />} />
              <Route path="kelola-asrama" element={<KelolaAsrama />} />
              <Route path="kelola-psb" element={<KelolaPsb />} />
              <Route path="kelola-keuangan" element={<KelolaKeuangan />} />
              <Route path="kelola-laporan" element={<KelolaLaporan />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminMain;