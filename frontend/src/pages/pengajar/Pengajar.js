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
import Profile from '../../components/pengajar/Profile';

import './PengajarMain.css'; // Import CSS file for animation

const PengajarMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isRootPath = location.pathname === '/pengajar';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header toggleSidebar={toggleSidebar} />
      <Container fluid style={{ flex: 1, padding: 0 }}>
        <Row style={{ minHeight: 'calc(100vh - 60px)' }}>
          <Col 
            md={isSidebarOpen ? 2 : 0} 
            className="p-0" 
            style={{ 
              backgroundColor: '#f8f9fa',
              borderRight: '1px solid #dee2e6',
              transition: 'all 0.3s ease'
            }}
          >
            <Sidebar isOpen={isSidebarOpen} />
          </Col>
          <Col 
            md={isSidebarOpen ? 10 : 12} 
            className="p-4" 
            style={{ 
              backgroundColor: '#ffffff',
              minHeight: 'calc(100vh - 60px)',
              overflowY: 'auto'
            }}
          >
            {isRootPath && (
              <div className="welcome-text" style={{ textAlign: 'center', marginTop: '20px', animation: 'fadeIn 2s ease-in-out' }}>
                <h2>Selamat Datang di Halaman Pengajar</h2>
                <p>Website Pesantren Walisongo Lampung Utara</p>
                <img src="/landing/masjid1.jpg" alt="Welcome" style={{ width: '350px', marginTop: '20px', animation: 'fadeIn 2s ease-in-out' }} />
              </div>
            )}
            <div style={{ paddingBottom: '2rem' }}>
              <Routes>
                <Route path="kelola-mapel" element={<KelolaMapel />} />
                <Route path="kelola-jadwal" element={<KelolaJadwal />} />
                <Route path="kelola-nilai" element={<KelolaNilai />} />
                <Route path="kelola-absensi" element={<KelolaAbsensi />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PengajarMain;
