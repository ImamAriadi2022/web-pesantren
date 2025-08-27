import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaBook, FaCalendarAlt, FaGraduationCap, FaUserCheck, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  return (
    <div style={{ width: isOpen ? '250px' : '0', backgroundColor: '#343a40', color: '#fff', height: '100vh', padding: isOpen ? '20px' : '0', overflow: 'hidden', transition: 'width 0.3s, padding 0.3s' }}>
      {isOpen && (
        <>
          <div className="text-start mb-4">
            <img src="path/to/logo.png" alt="Logo" width="50" height="50" />
            <h4>Panel Pengajar</h4>
          </div>
          <div className="mb-4 text-start">
            <FaBook size={20} className="me-2" />
            Pengajar
          </div>
          <div className="mb-4 text-start">
            <h6>PENGAJAR</h6>
            <Nav className="flex-column">
              <Nav.Link href="/pengajar/kelola-mapel" className="text-white">
                <FaBook className="me-2" /> Kelola Mapel
              </Nav.Link>
              <Nav.Link href="/pengajar/kelola-jadwal" className="text-white">
                <FaCalendarAlt className="me-2" /> Kelola Jadwal
              </Nav.Link>
              <Nav.Link href="/pengajar/kelola-nilai" className="text-white">
                <FaGraduationCap className="me-2" /> Kelola Nilai
              </Nav.Link>
              <Nav.Link href="/pengajar/kelola-absensi" className="text-white">
                <FaUserCheck className="me-2" /> Kelola Absensi
              </Nav.Link>
            </Nav>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
