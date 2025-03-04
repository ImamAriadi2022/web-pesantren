import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../../components/pengajar/Header';
import Sidebar from '../../components/pengajar/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';

// Pengajar pages
import KelolaMapel from '../../components/pengajar/KelolaMapel';
import KelolaJadwal from '../../components/pengajar/KelolaJadwal';
import KelolaNilai from '../../components/pengajar/KelolaNilai';
import KelolaAbsensi from '../../components/pengajar/KelolaAbsensi';

import './PengajarMain.css'; // Import CSS file for animation

const PengajarMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isRootPath = location.pathname === '/pengajar';

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
                <h2>Selamat Datang di Halaman Pengajar</h2>
                <p>Website Pesantren Walisongo Lampung Utara</p>
                <img src="/landing/masjid1.jpg" alt="Welcome" style={{ width: '350px', marginTop: '20px', animation: 'fadeIn 2s ease-in-out' }} />
              </div>
            )}
            <Routes>
              <Route path="kelola-mapel" element={<KelolaMapel />} />
              <Route path="kelola-jadwal" element={<KelolaJadwal />} />
              <Route path="kelola-nilai" element={<KelolaNilai />} />
              <Route path="kelola-absensi" element={<KelolaAbsensi />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PengajarMain;