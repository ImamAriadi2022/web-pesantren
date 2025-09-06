import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Alert, Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const KelolaAbsensi = () => {
  const [absensi, setAbsensi] = useState([]);
  const [dropdownData, setDropdownData] = useState({ santri: [], kelas: [] });
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalAbsensi, setModalAbsensi] = useState({ 
    id: null, 
    santri_id: '', 
    tanggal: '', 
    status: 'Hadir', 
    keterangan: '' 
  });

  useEffect(() => {
    fetchAbsensi();
    fetchDropdownData();
  }, []);

  const fetchAbsensi = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/absensi/getAbsensi.php');
      const result = await response.json();
      if (result.success) {
        setAbsensi(result.data);
      } else {
        console.error('Error fetching absensi:', result.message);
      }
    } catch (error) {
      console.error('Error fetching absensi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      // Fetch data santri
      const santriRes = await fetch('https://teralab.my.id/backend/api/santri/getSantri.php');
      const santriJson = await santriRes.json();
      
      // Fetch data kelas
      const kelasRes = await fetch('https://teralab.my.id/backend/api/kelas/getAllClass.php');
      const kelasJson = await kelasRes.json();
      
      if (santriJson.success && kelasJson.success) {
        setDropdownData({
          santri: santriJson.data || [],
          kelas: kelasJson.data || []
        });
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const filteredAbsensi = absensi.filter(a => 
    a.nama_santri?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.nis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.nama_kelas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAbsensi.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAbsensi = filteredAbsensi.slice(startIndex, startIndex + itemsPerPage);

  const handleAddAbsensi = () => {
    setModalAbsensi({ 
      id: null, 
      santri_id: '', 
      tanggal: new Date().toISOString().split('T')[0], 
      status: 'Hadir', 
      keterangan: '' 
    });
    setShowModal(true);
  };

  const handleEditAbsensi = (id) => {
    const absensiData = absensi.find(a => a.id === id);
    setModalAbsensi({
      ...absensiData,
      tanggal: absensiData.tanggal || new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDeleteAbsensi = async (id) => {
    if (window.confirm('Yakin ingin menghapus data absensi ini?')) {
      try {
        const res = await fetch('https://teralab.my.id/backend/api/absensi/deleteAbsensi.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const json = await res.json();
        if (json.success) {
          fetchAbsensi(); // Refresh data
          alert('Data absensi berhasil dihapus');
        } else {
          alert('Error: ' + json.message);
        }
      } catch (error) {
        console.error('Error deleting absensi:', error);
        alert('Terjadi kesalahan saat menghapus data');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSaveAbsensi = async () => {
    try {
      const res = await fetch('https://teralab.my.id/backend/api/absensi/saveAbsensi.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalAbsensi)
      });
      const json = await res.json();
      if (json.success) {
        fetchAbsensi(); // Refresh data
        setShowModal(false);
        alert(json.message);
      } else {
        alert('Error: ' + json.message);
      }
    } catch (error) {
      console.error('Error saving absensi:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleCopy = () => {
    const textToCopy = absensi.map(a => 
      `${a.nama_santri}\t${a.nis}\t${a.nama_kelas}\t${a.tanggal}\t${a.status}\t${a.keterangan}`
    ).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(absensi.map(a => ({
      'Kode Absensi': a.kode_absensi,
      'Nama Santri': a.nama_santri,
      'NIS': a.nis,
      'Kelas': a.nama_kelas,
      'Tanggal': a.tanggal,
      'Status': a.status,
      'Keterangan': a.keterangan
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Absensi');
    XLSX.writeFile(workbook, 'absensi_santri.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Kode Absensi', 'Nama Santri', 'NIS', 'Kelas', 'Tanggal', 'Status', 'Keterangan']],
      body: absensi.map(a => [a.kode_absensi, a.nama_santri, a.nis, a.nama_kelas, a.tanggal, a.status, a.keterangan]),
    });
    doc.save('absensi_santri.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Hadir': return 'success';
      case 'Izin': return 'warning';
      case 'Sakit': return 'info';
      case 'Alpha': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <h2>Kelola Absensi Santri</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading data absensi...</p>
        </div>
      ) : (
        <>
          <Button variant="primary" onClick={handleAddAbsensi} className="mb-3">
            Tambahkan Absensi Baru
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
                placeholder="Cari nama, NIS, kelas, status..." 
                value={searchTerm} 
                onChange={handleSearch} 
              />
            </InputGroup>
          </div>
          
          {absensi.length === 0 ? (
            <Alert variant="info">
              Belum ada data absensi. Silakan tambahkan data absensi baru.
            </Alert>
          ) : (
            <Table striped bordered hover id="printableTable">
              <thead>
                <tr>
                  <th>Nomor</th>
                  <th>Kode Absensi</th>
                  <th>Nama Santri</th>
                  <th>NIS</th>
                  <th>Kelas</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedAbsensi.map((a, index) => (
                  <tr key={a.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{a.kode_absensi}</td>
                    <td><strong>{a.nama_santri}</strong></td>
                    <td>{a.nis}</td>
                    <td>{a.nama_kelas}</td>
                    <td>{new Date(a.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>
                      <span className={`badge bg-${getStatusBadge(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{a.keterangan || '-'}</td>
                    <td>
                      <Button 
                        variant="warning" 
                        size="sm"
                        className="me-2" 
                        onClick={() => handleEditAbsensi(a.id)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteAbsensi(a.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          
          <div className="d-flex justify-content-between">
            <Form.Select 
              value={itemsPerPage} 
              onChange={(e) => setItemsPerPage(Number(e.target.value))} 
              style={{ width: '100px' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </Form.Select>
            <div>
              <Button 
                variant="outline-secondary" 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </Button>
              <span className="mx-2">{currentPage} / {totalPages}</span>
              <Button 
                variant="outline-secondary" 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAbsensi.id ? 'Edit Absensi' : 'Tambah Absensi Baru'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Santri *</Form.Label>
              <Form.Control 
                as="select" 
                value={modalAbsensi.santri_id} 
                onChange={(e) => setModalAbsensi({ ...modalAbsensi, santri_id: e.target.value })}
                required
              >
                <option value="">Pilih Santri</option>
                {dropdownData.santri.map(santri => (
                  <option key={santri.id} value={santri.id}>
                    {santri.nama} ({santri.nis}) - {santri.nama_kelas || 'Tanpa Kelas'}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal *</Form.Label>
              <Form.Control 
                type="date" 
                value={modalAbsensi.tanggal} 
                onChange={(e) => setModalAbsensi({ ...modalAbsensi, tanggal: e.target.value })} 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status Kehadiran *</Form.Label>
              <Form.Control 
                as="select" 
                value={modalAbsensi.status} 
                onChange={(e) => setModalAbsensi({ ...modalAbsensi, status: e.target.value })}
                required
              >
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
                <option value="Alpha">Alpha</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keterangan</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                placeholder="Keterangan tambahan..." 
                value={modalAbsensi.keterangan} 
                onChange={(e) => setModalAbsensi({ ...modalAbsensi, keterangan: e.target.value })} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveAbsensi}
            disabled={!modalAbsensi.santri_id || !modalAbsensi.tanggal}
          >
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaAbsensi;
