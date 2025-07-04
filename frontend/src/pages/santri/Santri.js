import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from '../../components/santri/Header';
import Sidebar from '../../components/santri/Sidebar';

// Santri pages
import Absensi from '../../components/santri/Absensi';
import JadwalPelajaran from '../../components/santri/JadwalPelajaran';
import Nilai from '../../components/santri/Nilai';
import Profile from '../../components/santri/Profile';

import './SantriMain.css'; // Import CSS file for animation

const SantriMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isRootPath = location.pathname === '/santri';

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
                <h2>Selamat Datang di Halaman Santri</h2>
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

export default SantriMain;