import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../../components/siswa/Header';
import Sidebar from '../../components/siswa/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';

// Siswa pages
import JadwalPelajaran from '../../components/siswa/JadwalPelajaran';
import Nilai from '../../components/siswa/Nilai';
import Absensi from '../../components/siswa/Absensi';
import Profile from '../../components/siswa/Profile';

import './SiswaMain.css'; // Import CSS file for animation

const SiswaMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isRootPath = location.pathname === '/siswa';

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
                <h2>Selamat Datang di Halaman Siswa</h2>
                <p>Website Pesantren Walisongo Lampung Utara</p>
                <img src="/landing/masjid1.jpg" alt="Welcome" style={{ width: '350px', marginTop: '20px', animation: 'fadeIn 2s ease-in-out' }} />
              </div>
            )}
            <Routes>
              <Route path="jadwal-pelajaran" element={<JadwalPelajaran />} />
              <Route path="nilai" element={<Nilai />} />
              <Route path="absensi" element={<Absensi />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SiswaMain;