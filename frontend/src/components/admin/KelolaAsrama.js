import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, FormControl, InputGroup, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { FaBed, FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaHome, FaPlus, FaPrint, FaSearch, FaTrash, FaUsers } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const KelolaAsrama = () => {
  const [asrama, setAsrama] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAsrama, setSelectedAsrama] = useState(null);
  const [modalAsrama, setModalAsrama] = useState({ 
    id: null, 
    nama_asrama: '', 
    kode_asrama: '', 
    kapasitas: '', 
    lokasi: '', 
    jenis: '', 
    penanggung_jawab: '', 
    fasilitas: '', 
    status: 'aktif' 
  });

  // Fetch data asrama dari backend
  const fetchAsrama = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/asrama/getAsrama.php');
      const json = await res.json();
      if (json.success) {
        setAsrama(json.data || []);
      } else {
        setError('Gagal memuat data asrama');
      }
    } catch (error) {
      console.error('Error fetching asrama:', error);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsrama();
  }, []);

  const handleAddAsrama = () => {
    setModalAsrama({ 
      id: null, 
      nama_asrama: '', 
      kode_asrama: '', 
      kapasitas: '', 
      lokasi: '', 
      jenis: '', 
      penanggung_jawab: '', 
      fasilitas: '', 
      status: 'aktif' 
    });
    setShowModal(true);
  };

  const handleEditAsrama = (id) => {
    const asramaData = asrama.find(a => a.id === id);
    if (asramaData) {
      setModalAsrama(asramaData);
      setShowModal(true);
    }
  };

  const handleViewDetail = (id) => {
    const asramaData = asrama.find(a => a.id === id);
    if (asramaData) {
      setSelectedAsrama(asramaData);
      setShowDetailModal(true);
    }
  };

  const handleDeleteAsrama = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data asrama ini?')) return;
    
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/asrama/deleteAsrama.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) {
        setSuccess('Data asrama berhasil dihapus!');
        fetchAsrama();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(json.message || 'Gagal menghapus data asrama');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting asrama:', error);
      setError('Terjadi kesalahan saat menghapus data');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSaveAsrama = async () => {
    try {
      setLoading(true);
      const method = modalAsrama.id ? 'PUT' : 'POST';
      const apiEndpoint = modalAsrama.id 
        ? 'http://localhost/web-pesantren/backend/api/asrama/updateAsrama.php'
        : 'http://localhost/web-pesantren/backend/api/asrama/createAsrama.php';
      
      const res = await fetch(apiEndpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalAsrama)
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(modalAsrama.id ? 'Data asrama berhasil diperbarui!' : 'Data asrama berhasil ditambahkan!');
        setShowModal(false);
        fetchAsrama();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(json.message || 'Gagal menyimpan data asrama');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error saving asrama:', error);
      setError('Terjadi kesalahan saat menyimpan data');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCopy = () => {
    const headers = 'Nama Asrama\tKode\tKapasitas\tTerisi\tLokasi\tJenis\tPenanggung Jawab\tStatus';
    const textToCopy = [headers, ...asrama.map(a => 
      `${a.nama_asrama}\t${a.kode_asrama}\t${a.kapasitas}\t${a.jumlah_penghuni || 0}\t${a.lokasi}\t${a.jenis}\t${a.penanggung_jawab}\t${a.status}`
    )].join('\n');
    navigator.clipboard.writeText(textToCopy);
    setSuccess('Data berhasil disalin ke clipboard');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExportExcel = () => {
    const exportData = asrama.map(a => ({
      'Nama Asrama': a.nama_asrama,
      'Kode Asrama': a.kode_asrama,
      'Kapasitas': a.kapasitas,
      'Jumlah Penghuni': a.jumlah_penghuni || 0,
      'Lokasi': a.lokasi,
      'Jenis': a.jenis,
      'Penanggung Jawab': a.penanggung_jawab,
      'Fasilitas': a.fasilitas,
      'Status': a.status
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asrama');
    XLSX.writeFile(workbook, 'asrama.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    doc.autoTable({
      head: [['Nama Asrama', 'Kode', 'Kapasitas', 'Terisi', 'Lokasi', 'Jenis', 'Status']],
      body: asrama.map(a => [
        a.nama_asrama, 
        a.kode_asrama, 
        a.kapasitas, 
        a.jumlah_penghuni || 0, 
        a.lokasi, 
        a.jenis, 
        a.status
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    doc.save('asrama.pdf');
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printableTable').outerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const filteredAsrama = asrama.filter(a =>
    (a.nama_asrama && a.nama_asrama.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.kode_asrama && a.kode_asrama.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.lokasi && a.lokasi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredAsrama.length / itemsPerPage);
  const displayedAsrama = filteredAsrama.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'aktif': { variant: 'success', text: 'Aktif' },
      'nonaktif': { variant: 'danger', text: 'Non-aktif' },
      'renovasi': { variant: 'warning', text: 'Renovasi' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getKapasitasColor = (kapasitas, terisi) => {
    const percentage = (terisi / kapasitas) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  return (
    <div>
      <h2>Kelola Asrama</h2>
      
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      
      <Button variant="primary" onClick={handleAddAsrama} className="mb-3" disabled={loading}>
        <FaPlus className="me-2" />Tambahkan Asrama Baru
      </Button>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <Button variant="outline-secondary" className="me-2" onClick={handleCopy}><FaCopy /> Salin</Button>
          <Button variant="outline-success" className="me-2" onClick={handleExportExcel}><FaFileExcel /> Export ke Excel</Button>
          <Button variant="outline-danger" className="me-2" onClick={handleExportPDF}><FaFilePdf /> Cetak PDF</Button>
          <Button variant="outline-primary" onClick={handlePrint}><FaPrint /> Cetak Print</Button>
        </div>
        <InputGroup className="w-25">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl type="text" placeholder="Cari..." value={searchTerm} onChange={handleSearch} />
        </InputGroup>
      </div>
      
      {loading && (
        <div className="text-center mb-3">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Memuat data...</span>
        </div>
      )}
      
      <Table striped bordered hover id="printableTable">
        <thead>
          <tr>
            <th>Nama Asrama</th>
            <th>Kode</th>
            <th>Kapasitas</th>
            <th>Penghuni</th>
            <th>Lokasi</th>
            <th>Jenis</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedAsrama.length > 0 ? (
            displayedAsrama.map(a => (
              <tr key={a.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <FaHome className="me-2 text-primary" />
                    <strong>{a.nama_asrama}</strong>
                  </div>
                </td>
                <td>{a.kode_asrama}</td>
                <td>
                  <Badge bg={getKapasitasColor(a.kapasitas, a.jumlah_penghuni || 0)}>
                    {a.kapasitas} tempat
                  </Badge>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <FaUsers className="me-2 text-info" />
                    {a.jumlah_penghuni || 0} santri
                    {a.penghuni && a.penghuni.length > 0 && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 ms-2"
                        onClick={() => handleViewDetail(a.id)}
                      >
                        Lihat Detail
                      </Button>
                    )}
                  </div>
                </td>
                <td>{a.lokasi}</td>
                <td>{a.jenis}</td>
                <td>{getStatusBadge(a.status)}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-1 mb-1" 
                    onClick={() => handleViewDetail(a.id)}
                  >
                    <FaBed />
                  </Button>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-1 mb-1" 
                    onClick={() => handleEditAsrama(a.id)}
                  >
                    <FaEdit />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="mb-1" 
                    onClick={() => handleDeleteAsrama(a.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                {loading ? 'Memuat data...' : 'Tidak ada data asrama'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      
      <div className="d-flex justify-content-between">
        <Form.Select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{ width: '100px' }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Form.Select>
        <div>
          <Button variant="outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
          <span className="mx-2">{currentPage} / {totalPages}</span>
          <Button variant="outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
        </div>
      </div>

      {/* Modal Tambah/Edit Asrama */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalAsrama.id ? 'Edit Asrama' : 'Tambah Asrama Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nama Asrama</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nama Asrama" 
                    value={modalAsrama.nama_asrama} 
                    onChange={(e) => setModalAsrama({ ...modalAsrama, nama_asrama: e.target.value })} 
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Kode Asrama</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Kode Asrama" 
                    value={modalAsrama.kode_asrama} 
                    onChange={(e) => setModalAsrama({ ...modalAsrama, kode_asrama: e.target.value })} 
                  />
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Kapasitas</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Kapasitas" 
                    value={modalAsrama.kapasitas} 
                    onChange={(e) => setModalAsrama({ ...modalAsrama, kapasitas: e.target.value })} 
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Jenis</Form.Label>
                  <Form.Select 
                    value={modalAsrama.jenis} 
                    onChange={(e) => setModalAsrama({ ...modalAsrama, jenis: e.target.value })}
                  >
                    <option value="">Pilih Jenis</option>
                    <option value="Putra">Putra</option>
                    <option value="Putri">Putri</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Lokasi</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Lokasi" 
                value={modalAsrama.lokasi} 
                onChange={(e) => setModalAsrama({ ...modalAsrama, lokasi: e.target.value })} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Penanggung Jawab</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Penanggung Jawab" 
                value={modalAsrama.penanggung_jawab} 
                onChange={(e) => setModalAsrama({ ...modalAsrama, penanggung_jawab: e.target.value })} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fasilitas</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Fasilitas yang tersedia" 
                value={modalAsrama.fasilitas} 
                onChange={(e) => setModalAsrama({ ...modalAsrama, fasilitas: e.target.value })} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select 
                value={modalAsrama.status} 
                onChange={(e) => setModalAsrama({ ...modalAsrama, status: e.target.value })}
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-aktif</option>
                <option value="renovasi">Renovasi</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSaveAsrama} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Detail Asrama dengan Daftar Penghuni */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Asrama - {selectedAsrama?.nama_asrama}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAsrama && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <Card.Title className="h6">Informasi Asrama</Card.Title>
                      <p><strong>Kode:</strong> {selectedAsrama.kode_asrama}</p>
                      <p><strong>Kapasitas:</strong> {selectedAsrama.kapasitas} tempat</p>
                      <p><strong>Terisi:</strong> {selectedAsrama.jumlah_penghuni || 0} santri</p>
                      <p><strong>Lokasi:</strong> {selectedAsrama.lokasi}</p>
                      <p><strong>Jenis:</strong> {selectedAsrama.jenis}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedAsrama.status)}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <Card.Title className="h6">Pengelolaan</Card.Title>
                      <p><strong>Penanggung Jawab:</strong> {selectedAsrama.penanggung_jawab}</p>
                      <p><strong>Fasilitas:</strong> {selectedAsrama.fasilitas}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Card>
                <Card.Header>
                  <Card.Title className="h6 mb-0">Daftar Penghuni</Card.Title>
                </Card.Header>
                <Card.Body>
                  {selectedAsrama.penghuni && selectedAsrama.penghuni.length > 0 ? (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama Santri</th>
                          <th>NIS</th>
                          <th>Kelas</th>
                          <th>Tanggal Masuk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAsrama.penghuni.map((penghuni, index) => (
                          <tr key={penghuni.id}>
                            <td>{index + 1}</td>
                            <td>{penghuni.nama_santri}</td>
                            <td>{penghuni.nomor_identitas}</td>
                            <td>{penghuni.nama_kelas}</td>
                            <td>{penghuni.tanggal_masuk ? new Date(penghuni.tanggal_masuk).toLocaleDateString('id-ID') : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted text-center">Belum ada penghuni di asrama ini</p>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaAsrama;