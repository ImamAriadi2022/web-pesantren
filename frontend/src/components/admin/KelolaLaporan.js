import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, FormControl, InputGroup, Row, Spinner, Table } from 'react-bootstrap';
import { FaBook, FaChartBar, FaClipboardList, FaFileExcel, FaFilePdf, FaHome, FaSearch, FaUsers } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const KelolaLaporan = () => {
  const [jenisLaporan, setJenisLaporan] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statistik, setStatistik] = useState({});

  // Fetch laporan dari backend
  const fetchLaporan = async () => {
    if (!jenisLaporan) {
      setError('Silakan pilih jenis laporan terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        jenis: jenisLaporan,
        start_date: tanggalMulai,
        end_date: tanggalSelesai
      });

      const response = await fetch(`http://localhost/web-pesantren/backend/api/laporan/laporan.php?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setLaporan(data.data || []);
        setStatistik(data.statistik || {});
        setSuccess('Laporan berhasil dihasilkan');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Gagal menghasilkan laporan');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error fetching laporan:', error);
      setError('Terjadi kesalahan saat menghasilkan laporan');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExportExcel = () => {
    if (laporan.length === 0) {
      setError('Tidak ada data untuk diekspor');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(laporan);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Laporan ${jenisLaporan}`);
    XLSX.writeFile(workbook, `laporan_${jenisLaporan}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportPDF = () => {
    if (laporan.length === 0) {
      setError('Tidak ada data untuk diekspor');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Judul laporan
    doc.setFontSize(16);
    doc.text(`Laporan ${jenisLaporan.charAt(0).toUpperCase() + jenisLaporan.slice(1)}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Periode: ${tanggalMulai || 'Semua'} - ${tanggalSelesai || 'Semua'}`, 20, 30);
    
    // Tabel data berdasarkan jenis laporan
    let tableHead = [];
    let tableBody = [];
    
    switch (jenisLaporan) {
      case 'santri':
        tableHead = [['Nama', 'NIS', 'Kelas', 'Jenis Kelamin', 'Status', 'Tanggal Masuk']];
        tableBody = laporan.map(l => [
          l.nama || '-',
          l.nomor_identitas || '-',
          l.nama_kelas || '-',
          l.jenis_kelamin || '-',
          l.status || '-',
          l.tanggal_masuk ? new Date(l.tanggal_masuk).toLocaleDateString('id-ID') : '-'
        ]);
        break;
      case 'asrama':
        tableHead = [['Nama Asrama', 'Kode', 'Kapasitas', 'Terisi', 'Lokasi', 'Status']];
        tableBody = laporan.map(l => [
          l.nama_asrama || '-',
          l.kode_asrama || '-',
          l.kapasitas || '-',
          l.jumlah_penghuni || '0',
          l.lokasi || '-',
          l.status || '-'
        ]);
        break;
      case 'keuangan':
        tableHead = [['Tanggal', 'Jenis Transaksi', 'Nominal', 'Santri', 'Keterangan']];
        tableBody = laporan.map(l => [
          l.tanggal || '-',
          l.jenis_transaksi || '-',
          l.nominal || '-',
          l.nama_santri || '-',
          l.keterangan || '-'
        ]);
        break;
      default:
        tableHead = [['Data']];
        tableBody = laporan.map(l => [JSON.stringify(l)]);
    }
    
    doc.autoTable({
      head: tableHead,
      body: tableBody,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save(`laporan_${jenisLaporan}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filteredLaporan = laporan.filter(l => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const searchValues = Object.values(l).map(value => 
      String(value || '').toLowerCase()
    );
    
    return searchValues.some(value => value.includes(searchLower));
  });

  const renderLaporanTable = () => {
    if (!jenisLaporan || laporan.length === 0) {
      return (
        <div className="text-center p-4">
          <p className="text-muted">
            {!jenisLaporan ? 'Pilih jenis laporan dan klik "Generate Laporan"' : 'Tidak ada data untuk ditampilkan'}
          </p>
        </div>
      );
    }

    switch (jenisLaporan) {
      case 'santri':
        return (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIS</th>
                <th>Kelas</th>
                <th>Jenis Kelamin</th>
                <th>Status</th>
                <th>Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaporan.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.nomor_identitas}</td>
                  <td>{item.nama_kelas}</td>
                  <td>{item.jenis_kelamin}</td>
                  <td>
                    <Badge bg={item.status === 'aktif' ? 'success' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td>{item.tanggal_masuk ? new Date(item.tanggal_masuk).toLocaleDateString('id-ID') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      
      case 'asrama':
        return (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Asrama</th>
                <th>Kode</th>
                <th>Kapasitas</th>
                <th>Terisi</th>
                <th>Lokasi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaporan.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.nama_asrama}</td>
                  <td>{item.kode_asrama}</td>
                  <td>{item.kapasitas}</td>
                  <td>{item.jumlah_penghuni || 0}</td>
                  <td>{item.lokasi}</td>
                  <td>
                    <Badge bg={item.status === 'aktif' ? 'success' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      
      default:
        return (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaporan.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{JSON.stringify(item)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
    }
  };

  return (
    <div>
      <h2>Kelola Laporan</h2>
      
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      
      {/* Statistik Dashboard */}
      {Object.keys(statistik).length > 0 && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaUsers className="fa-2x text-primary mb-2" />
                <h5>{statistik.total_santri || 0}</h5>
                <p className="text-muted">Total Santri</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaHome className="fa-2x text-success mb-2" />
                <h5>{statistik.total_asrama || 0}</h5>
                <p className="text-muted">Total Asrama</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaBook className="fa-2x text-warning mb-2" />
                <h5>{statistik.total_kelas || 0}</h5>
                <p className="text-muted">Total Kelas</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Form Generator Laporan */}
      <Card className="mb-4">
        <Card.Header>
          <Card.Title className="mb-0">
            <FaChartBar className="me-2" />
            Generator Laporan
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap align-items-end gap-3">
            <div className="flex-grow-1" style={{ minWidth: '200px' }}>
              <Form.Label>Jenis Laporan</Form.Label>
              <Form.Select 
                value={jenisLaporan} 
                onChange={(e) => setJenisLaporan(e.target.value)}
              >
                <option value="">Pilih Jenis Laporan</option>
                <option value="santri">Laporan Data Santri</option>
                <option value="asrama">Laporan Asrama</option>
                {/* <option value="keuangan">Laporan Keuangan</option> */}
                <option value="surat_izin">Laporan Surat Izin</option>
                {/* <option value="pelanggaran">Laporan Pelanggaran</option> */}
              </Form.Select>
            </div>
            
            <div style={{ minWidth: '150px' }}>
              <Form.Label>Tanggal Mulai</Form.Label>
              <Form.Control 
                type="date" 
                value={tanggalMulai} 
                onChange={(e) => setTanggalMulai(e.target.value)} 
              />
            </div>
            
            <div style={{ minWidth: '150px' }}>
              <Form.Label>Tanggal Selesai</Form.Label>
              <Form.Control 
                type="date" 
                value={tanggalSelesai} 
                onChange={(e) => setTanggalSelesai(e.target.value)} 
              />
            </div>
            
            <Button 
              variant="primary" 
              onClick={fetchLaporan}
              disabled={loading || !jenisLaporan}
            >
              {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
              Generate Laporan
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Tools dan Search */}
      {laporan.length > 0 && (
        <div className="d-flex justify-content-between mb-3">
          <div>
            <Button variant="outline-success" className="me-2" onClick={handleExportExcel}>
              <FaFileExcel /> Export Excel
            </Button>
            <Button variant="outline-danger" onClick={handleExportPDF}>
              <FaFilePdf /> Export PDF
            </Button>
          </div>
          <InputGroup className="w-25">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <FormControl 
              type="text" 
              placeholder="Cari dalam laporan..." 
              value={searchTerm} 
              onChange={handleSearch} 
            />
          </InputGroup>
        </div>
      )}
      
      {/* Tabel Laporan */}
      <Card>
        <Card.Header>
          <Card.Title className="mb-0">
            {jenisLaporan ? `Laporan ${jenisLaporan.charAt(0).toUpperCase() + jenisLaporan.slice(1)}` : 'Data Laporan'}
            {laporan.length > 0 && (
              <Badge bg="info" className="ms-2">
                {filteredLaporan.length} dari {laporan.length} data
              </Badge>
            )}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Sedang menghasilkan laporan...</p>
            </div>
          ) : (
            renderLaporanTable()
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default KelolaLaporan;
