import { Nav } from 'react-bootstrap';
import { FaChalkboardTeacher, FaClipboardList, FaCog, FaFileAlt, FaSchool, FaSignOutAlt, FaTachometerAlt, FaUserGraduate, FaUsers, FaBook, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  return (
    <div style={{ width: isOpen ? '250px' : '0', backgroundColor: '#343a40', color: '#fff', height: '160vh', padding: isOpen ? '20px' : '0', overflow: 'hidden', transition: 'width 0.3s, padding 0.3s' }}>
      {isOpen && (
        <>
          <div className="text-start mb-4">
            <div className="d-flex align-items-center">
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '50px', height: '50px'}}>
                <span className="text-white fw-bold">WP</span>
              </div>
              <h4>Panel Admin</h4>
            </div>
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
            <h6>AKADEMIK</h6>
            <Nav className="flex-column">
              <Nav.Link href="/admin/kelola-mapel" className="text-white">
                <FaBook className="me-2" /> Kelola Mapel
              </Nav.Link>
              <Nav.Link href="/admin/kelola-jadwal" className="text-white">
                <FaCalendarAlt className="me-2" /> Kelola Jadwal
              </Nav.Link>
              <Nav.Link href="/admin/kelola-nilai" className="text-white">
                <FaGraduationCap className="me-2" /> Kelola Nilai
              </Nav.Link>
            </Nav>
          </div>
          <div className="mb-4 text-start">
            <h6>MASTER</h6>
            <Nav className="flex-column">
              <Nav.Link href="/admin/data-santri" className="text-white">
                <FaUserGraduate className="me-2" /> Data Santri
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
              <Nav.Link href="/admin/kelola-asrama" className="text-white">
                <FaSchool className="me-2" /> Kelola Asrama
              </Nav.Link>
              <Nav.Link href="/admin/kelola-psb" className="text-white">
                <FaClipboardList className="me-2" /> Kelola PSB
              </Nav.Link>
            </Nav>
          </div>
          <div className="mb-4 text-start">
            <h6>REPORT</h6>
            <Nav className="flex-column">
              <Nav.Link href="/admin/kelola-laporan" className="text-white">
                <FaFileAlt className="me-2" /> Kelola Laporan
              </Nav.Link>
            </Nav>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;