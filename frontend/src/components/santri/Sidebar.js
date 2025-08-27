import { Nav } from 'react-bootstrap';
import { FaCalendarAlt, FaCheckSquare, FaClipboardList, FaTachometerAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  return (
    <div style={{ width: isOpen ? '250px' : '0', backgroundColor: '#343a40', color: '#fff', height: '100vh', padding: isOpen ? '20px' : '0', overflow: 'hidden', transition: 'width 0.3s, padding 0.3s' }}>
      {isOpen && (
        <>
          <div className="text-start mb-4">
            <img src="path/to/logo.png" alt="Logo" width="50" height="50" />
            <h4>Panel Santri</h4>
          </div>
          <div className="mb-4 text-start">
            <FaTachometerAlt size={20} className="me-2" />
            Santri
          </div>
          <div className="mb-4 text-start">
            <h6>SANTRI</h6>
            <Nav className="flex-column">
              <Nav.Link href="/santri/jadwal-pelajaran" className="text-white">
                <FaCalendarAlt className="me-2" /> Jadwal Pelajaran
              </Nav.Link>
              <Nav.Link href="/santri/nilai" className="text-white">
                <FaClipboardList className="me-2" /> Lihat Nilai
              </Nav.Link>
              <Nav.Link href="/santri/absensi" className="text-white">
                <FaCheckSquare className="me-2" /> Absensi
              </Nav.Link>
            </Nav>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
