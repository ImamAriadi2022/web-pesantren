import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import { Routes, Route } from 'react-router-dom';

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

const AdminMain = () => {
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <Header />
      <Container fluid>
        <Row>
          <Col md={2} className="p-0" style={{ height: '100vh', overflow: 'auto' }}>
            <Sidebar />
          </Col>
          <Col md={10} className="p-4" style={{ height: '100vh', overflow: 'auto' }}>
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