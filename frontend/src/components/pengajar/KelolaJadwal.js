import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table, Alert, Badge, Row, Col } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const KelolaJadwal = () => {
  const [jadwal, setJadwal] = useState([]);
  const [dropdownData, setDropdownData] = useState({ kelas: [], mapel: [], ustadz: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalJadwal, setModalJadwal] = useState({ 
    id: null, kelas_id: '', mapel_id: '', ustadz_id: '', hari: 'Senin', 
    jam_mulai: '08:00', jam_selesai: '09:30', ruangan: '', tahun_ajaran: '2024/2025', semester: 'Ganjil', status: 'Aktif' 
  });

  // Fetch data jadwal dari backend
  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost/web-pesantren/backend/api/jadwal/jadwal.php');
      const json = await res.json();
      if (Array.isArray(json)) {
        setJadwal(json);
      } else if (json.success && Array.isArray(json.data)) {
        setJadwal(json.data);
      } else {
        console.error('Unexpected response format:', json);
        setJadwal([]);
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
      setJadwal([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dropdown data untuk form
  const fetchDropdownData = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/public/getDropdownData.php');
      const json = await res.json();
      if (json.success) setDropdownData(json.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  useEffect(() => {
    fetchJadwal();
    fetchDropdownData();
  }, []);

  const handleAddJadwal = () => {
    setModalJadwal({ 
      id: null, kelas_id: '', mapel_id: '', ustadz_id: '', hari: 'Senin', 
      jam_mulai: '08:00', jam_selesai: '09:30', ruangan: '', tahun_ajaran: '2024/2025', semester: 'Ganjil', status: 'Aktif' 
    });
    setConflicts([]);
    setShowModal(true);
  };

  const handleEditJadwal = (id) => {
    const jadwalData = jadwal.find(j => j.id === id);
    setModalJadwal({
      ...jadwalData,
      jam_mulai: jadwalData.jam_mulai || '08:00',
      jam_selesai: jadwalData.jam_selesai || '09:30'
    });
    setConflicts([]);
    setShowModal(true);
  };

  const handleDeleteJadwal = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      try {
        const res = await fetch(`http://localhost/web-pesantren/backend/api/jadwal/jadwal.php?id=${id}`, {
          method: 'DELETE'
        });
        const json = await res.json();
        if (json.success) {
          fetchJadwal(); // Refresh data
          alert('Jadwal berhasil dihapus');
        } else {
          alert('Error: ' + json.error);
        }
      } catch (error) {
        console.error('Error deleting jadwal:', error);
        alert('Terjadi kesalahan saat menghapus data');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveJadwal = async () => {
    try {
      setLoading(true);
      const method = modalJadwal.id ? 'PUT' : 'POST';
      const res = await fetch('http://localhost/web-pesantren/backend/api/jadwal/jadwal.php', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalJadwal)
      });
      const json = await res.json();
      
      if (json.success) {
        fetchJadwal(); // Refresh data
        setShowModal(false);
        setConflicts([]);
        alert(json.message);
      } else if (json.conflicts) {
        setConflicts(json.conflicts);
        alert('Jadwal bentrok terdeteksi! Silakan periksa konflik di bawah form.');
      } else {
        alert('Error: ' + json.error);
      }
    } catch (error) {
      console.error('Error saving jadwal:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = jadwal.map(j => `${j.nama_mapel}\t${j.nama_ustadz}\t${j.nama_kelas}\t${j.jam}\t${j.hari}\t${j.ruangan}\t${j.status}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(jadwal.map(j => ({
      'Mata Pelajaran': j.nama_mapel,
      'Pengajar': j.nama_ustadz,
      'Kelas': j.nama_kelas,
      'Hari': j.hari,
      'Jam': j.jam,
      'Ruangan': j.ruangan,
      'Jumlah Santri': j.jumlah_santri,
      'Status': j.status
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jadwal');
    XLSX.writeFile(workbook, 'jadwal_pelajaran.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Mata Pelajaran', 'Pengajar', 'Kelas', 'Jam', 'Hari', 'Ruangan', 'Status']],
      body: jadwal.map(j => [j.nama_mapel, j.nama_ustadz, j.nama_kelas, j.jam, j.hari, j.ruangan || '-', j.status]),
    });
    doc.save('jadwal_pelajaran.pdf');
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printableTable').outerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Jadwal</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const filteredJadwal = jadwal.filter(j =>
    (j.nama_mapel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.nama_ustadz || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.nama_kelas || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.hari || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.ruangan || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJadwal.length / itemsPerPage);
  const displayedJadwal = filteredJadwal.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    return status === 'Aktif' ? 'success' : 'secondary';
  };

  const getHariColor = (hari) => {
    const colors = {
      'Senin': 'primary',
      'Selasa': 'success', 
      'Rabu': 'warning',
      'Kamis': 'info',
      'Jumat': 'danger',
      'Sabtu': 'dark',
      'Minggu': 'secondary'
    };
    return colors[hari] || 'secondary';
  };

  return (
    <div>
      <h2>Kelola Jadwal Pelajaran</h2>
      <p className="text-muted">Kelola jadwal pelajaran dengan sistem pencegahan bentrok otomatis</p>
      
      <Button variant="primary" onClick={handleAddJadwal} className="mb-3">
        Tambahkan Jadwal Baru
      </Button>
      
      <div className="d-flex justify-content-between mb-3">
        <div>
          <Button variant="outline-secondary" className="me-2" onClick={handleCopy}>
            <FaCopy /> Salin
          </Button>
          <Button variant="outline-success" className="me-2" onClick={handleExportExcel}>
            <FaFileExcel /> Export ke Excel
          </Button>
          <Button variant="outline-danger" className="me-2" onClick={handleExportPDF}>
            <FaFilePdf /> Cetak PDF
          </Button>
          <Button variant="outline-primary" onClick={handlePrint}>
            <FaPrint /> Cetak Print
          </Button>
        </div>
        <InputGroup className="w-25">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl 
            type="text" 
            placeholder="Cari mapel, pengajar, kelas..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : jadwal.length === 0 ? (
        <Alert variant="info">
          Belum ada jadwal pelajaran. Silakan tambahkan jadwal baru.
        </Alert>
      ) : (
        <Table striped bordered hover id="printableTable">
          <thead>
            <tr>
              <th>No</th>
              <th>Mata Pelajaran</th>
              <th>Pengajar</th>
              <th>Kelas</th>
              <th>Hari</th>
              <th>Jam</th>
              <th>Ruangan</th>
              <th>Santri</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayedJadwal.map((j, index) => (
              <tr key={j.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td><strong>{j.nama_mapel}</strong></td>
                <td>{j.nama_ustadz}</td>
                <td>{j.nama_kelas}</td>
                <td>
                  <Badge bg={getHariColor(j.hari)}>{j.hari}</Badge>
                </td>
                <td>{j.jam}</td>
                <td>{j.ruangan || '-'}</td>
                <td>
                  <Badge bg="info">
                    <FaUsers /> {j.jumlah_santri || 0}
                  </Badge>
                </td>
                <td>
                  <Badge bg={getStatusBadge(j.status)}>{j.status}</Badge>
                </td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditJadwal(j.id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteJadwal(j.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      <div className="d-flex justify-content-between">
        <Form.Select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{ width: '100px' }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Form.Select>
        <div>
          <Button variant="outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Prev
          </Button>
          <span className="mx-2">{currentPage} / {totalPages}</span>
          <Button variant="outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalJadwal.id ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {conflicts.length > 0 && (
            <Alert variant="danger">
              <FaExclamationTriangle /> <strong>Jadwal Bentrok Terdeteksi!</strong>
              {conflicts.map((conflict, index) => (
                <div key={index} className="mt-2">
                  <strong>{conflict.type.charAt(0).toUpperCase() + conflict.type.slice(1)}:</strong> {conflict.message}
                  <br />
                  <small>
                    {conflict.details.nama_kelas} - {conflict.details.nama_mapel} 
                    ({conflict.details.jam_mulai} - {conflict.details.jam_selesai})
                    {conflict.details.nama_ustadz && ` oleh ${conflict.details.nama_ustadz}`}
                  </small>
                </div>
              ))}
            </Alert>
          )}
          
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pilih Kelas *</Form.Label>
                  <Form.Control as="select" value={modalJadwal.kelas_id} onChange={(e) => setModalJadwal({ ...modalJadwal, kelas_id: e.target.value })}>
                    <option value="">Pilih Kelas</option>
                    {dropdownData.kelas.map(kelas => (
                      <option key={kelas.id} value={kelas.id}>{kelas.nama_kelas}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pilih Mata Pelajaran *</Form.Label>
                  <Form.Control as="select" value={modalJadwal.mapel_id} onChange={(e) => setModalJadwal({ ...modalJadwal, mapel_id: e.target.value })}>
                    <option value="">Pilih Mata Pelajaran</option>
                    {dropdownData.mapel.map(mapel => (
                      <option key={mapel.id} value={mapel.id}>{mapel.nama_mapel}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pilih Pengajar *</Form.Label>
                  <Form.Control as="select" value={modalJadwal.ustadz_id} onChange={(e) => setModalJadwal({ ...modalJadwal, ustadz_id: e.target.value })}>
                    <option value="">Pilih Pengajar</option>
                    {dropdownData.ustadz.map(ustadz => (
                      <option key={ustadz.id} value={ustadz.id}>{ustadz.nama}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hari *</Form.Label>
                  <Form.Control as="select" value={modalJadwal.hari} onChange={(e) => setModalJadwal({ ...modalJadwal, hari: e.target.value })}>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jam Mulai *</Form.Label>
                  <Form.Control 
                    type="time" 
                    value={modalJadwal.jam_mulai} 
                    onChange={(e) => setModalJadwal({ ...modalJadwal, jam_mulai: e.target.value })} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jam Selesai *</Form.Label>
                  <Form.Control 
                    type="time" 
                    value={modalJadwal.jam_selesai} 
                    onChange={(e) => setModalJadwal({ ...modalJadwal, jam_selesai: e.target.value })} 
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ruangan</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Contoh: Ruang 101, Lab Komputer" 
                    value={modalJadwal.ruangan} 
                    onChange={(e) => setModalJadwal({ ...modalJadwal, ruangan: e.target.value })} 
                  />
                  <Form.Text className="text-muted">
                    Opsional - digunakan untuk deteksi bentrok ruangan
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control as="select" value={modalJadwal.status} onChange={(e) => setModalJadwal({ ...modalJadwal, status: e.target.value })}>
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tahun Ajaran</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="2024/2025" 
                    value={modalJadwal.tahun_ajaran} 
                    onChange={(e) => setModalJadwal({ ...modalJadwal, tahun_ajaran: e.target.value })} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Control as="select" value={modalJadwal.semester} onChange={(e) => setModalJadwal({ ...modalJadwal, semester: e.target.value })}>
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveJadwal}
            disabled={loading || !modalJadwal.kelas_id || !modalJadwal.mapel_id || !modalJadwal.ustadz_id}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaJadwal;
