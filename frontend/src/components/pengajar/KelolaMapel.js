import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const KelolaMapel = () => {
  const [mapel, setMapel] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMapel, setModalMapel] = useState({ 
    id: null, 
    kode_mapel: '', 
    nama_mapel: '', 
    kelas_id: '',
    keterangan: '', 
    status: 'Aktif' 
  });

  // Fetch data kelas dari backend
  const fetchKelas = async () => {
    try {
      console.log('Fetching kelas data...');
      const res = await fetch('https://teralab.my.id/backend/api/kelas/getAllClass.php');
      const json = await res.json();
      console.log('Kelas API Response:', json);
      
      if (json.success && json.data) {
        setKelas(json.data);
        console.log('Kelas data loaded:', json.data.length, 'records');
      } else {
        console.error('API returned error:', json.message);
        setKelas([]);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
      setKelas([]);
    }
  };

  // Fetch data mapel dari backend
  const fetchMapel = async () => {
    try {
      console.log('Fetching mata pelajaran data...');
      const res = await fetch('https://teralab.my.id/backend/api/mapel/getMapel.php');
      const json = await res.json();
      console.log('Mapel API Response:', json);
      
      if (json.success && json.data) {
        setMapel(json.data);
        console.log('Mapel data loaded:', json.data.length, 'records');
      } else {
        console.error('API returned error:', json.message);
        setMapel([]);
      }
    } catch (error) {
      console.error('Error fetching mapel:', error);
      setMapel([]);
    }
  };

  useEffect(() => {
    fetchMapel();
    fetchKelas();
  }, []);

  const handleAddMapel = () => {
    setModalMapel({ 
      id: null, 
      kode_mapel: '', 
      nama_mapel: '', 
      kelas_id: '',
      keterangan: '', 
      status: 'Aktif' 
    });
    setShowModal(true);
  };

  const handleEditMapel = (id) => {
    const mapelData = mapel.find(m => m.id === id);
    setModalMapel(mapelData);
    setShowModal(true);
  };

  const handleDeleteMapel = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) return;
    
    try {
      console.log('Deleting mapel ID:', id);
      const res = await fetch('https://teralab.my.id/backend/api/mapel/deleteMapel.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      const json = await res.json();
      console.log('Delete mapel response:', json);
      
      if (json.success) {
        alert(json.message || 'Mata pelajaran berhasil dihapus!');
        fetchMapel(); // Refresh data
      } else {
        alert('Error: ' + (json.message || 'Gagal menghapus data'));
      }
    } catch (error) {
      console.error('Error deleting mapel:', error);
      alert('Terjadi kesalahan saat menghapus data');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveMapel = async () => {
    // Validasi input
    if (!modalMapel.kode_mapel || !modalMapel.nama_mapel) {
      alert('Kode mapel dan nama mapel harus diisi!');
      return;
    }

    try {
      console.log('Saving mapel data:', modalMapel);
      const res = await fetch('https://teralab.my.id/backend/api/mapel/saveMapel.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: modalMapel.id,
          kode_mapel: modalMapel.kode_mapel,
          nama_mapel: modalMapel.nama_mapel,
          kelas_id: modalMapel.kelas_id,
          keterangan: modalMapel.keterangan,
          status: modalMapel.status
        })
      });
      
      const json = await res.json();
      console.log('Save mapel response:', json);
      
      if (json.success) {
        alert(json.message || 'Data mata pelajaran berhasil disimpan!');
        fetchMapel(); // Refresh data
        setShowModal(false);
      } else {
        alert('Error: ' + (json.message || 'Gagal menyimpan data'));
      }
    } catch (error) {
      console.error('Error saving mapel:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleCopy = () => {
    const headers = 'Kode Mapel\tNama Mapel\tStatus\tKeterangan';
    const textToCopy = [headers, ...mapel.map(m => 
      `${m.kode_mapel}\t${m.nama_mapel}\t${m.status}\t${m.keterangan || ''}`
    )].join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const exportData = mapel.map(m => ({
      'Kode Mapel': m.kode_mapel,
      'Nama Mapel': m.nama_mapel,
      'Keterangan': m.keterangan || '',
      'Status': m.status,
      'Dibuat': m.created_at,
      'Diupdate': m.updated_at
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MataPelajaran');
    XLSX.writeFile(workbook, 'mata_pelajaran.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    doc.autoTable({
      head: [['Kode Mapel', 'Nama Mapel', 'Status', 'Keterangan']],
      body: mapel.map(m => [
        m.kode_mapel, 
        m.nama_mapel, 
        m.status, 
        m.keterangan || ''
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    doc.save('mata_pelajaran.pdf');
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

  const filteredMapel = mapel.filter(m =>
    (m.nama_mapel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.kode_mapel || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMapel.length / itemsPerPage);
  const displayedMapel = filteredMapel.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ padding: '1rem 0', minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#006400', marginBottom: 0 }}>Kelola Mata Pelajaran</h2>
        <p className="text-muted mb-0">Kelola data mata pelajaran yang diajarkan</p>
      </div>
      
      <div className="mb-3">
        <Button 
          variant="primary" 
          onClick={handleAddMapel} 
          style={{ backgroundColor: '#006400', borderColor: '#006400' }}
        >
          Tambahkan Mata Pelajaran Baru
        </Button>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
        <div className="d-flex flex-wrap gap-2">
          <Button variant="outline-secondary" onClick={handleCopy}>
            <FaCopy className="me-1" /> Salin
          </Button>
          <Button variant="outline-success" onClick={handleExportExcel}>
            <FaFileExcel className="me-1" /> Export ke Excel
          </Button>
          <Button variant="outline-danger" onClick={handleExportPDF}>
            <FaFilePdf className="me-1" /> Cetak PDF
          </Button>
          <Button variant="outline-primary" onClick={handlePrint}>
            <FaPrint className="me-1" /> Cetak Print
          </Button>
        </div>
        <InputGroup style={{ maxWidth: '300px' }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl 
            type="text" 
            placeholder="Cari mata pelajaran..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </InputGroup>
      </div>
      <Table striped bordered hover responsive id="printableTable">
        <thead style={{ backgroundColor: '#006400', color: 'white' }}>
          <tr>
            <th>No</th>
            <th>Kode Mapel</th>
            <th>Nama Mata Pelajaran</th>
            <th>Kelas</th>
            <th>Keterangan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedMapel.length > 0 ? (
            displayedMapel.map((m, index) => (
              <tr key={m.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td><strong>{m.kode_mapel}</strong></td>
                <td>{m.nama_mapel}</td>
                <td>
                  {m.kelas_id ? (
                    <span className="badge bg-primary">
                      {kelas.find(k => k.id == m.kelas_id)?.nama_kelas || `Kelas ID: ${m.kelas_id}`}
                    </span>
                  ) : (
                    <span className="text-muted">Semua Kelas</span>
                  )}
                </td>
                <td>{m.keterangan || '-'}</td>
                <td>
                  <span className={`badge ${m.status === 'Aktif' ? 'bg-success' : 'bg-danger'}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => handleEditMapel(m.id)}
                      title="Edit"
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDeleteMapel(m.id)}
                      title="Hapus"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                <div style={{ color: '#6c757d' }}>
                  <h5>Tidak ada data mata pelajaran yang ditemukan</h5>
                  <p>Data mata pelajaran akan ditampilkan setelah tersedia di database.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <span>Tampilkan:</span>
          <Form.Select 
            value={itemsPerPage} 
            onChange={(e) => setItemsPerPage(Number(e.target.value))} 
            style={{ width: '80px' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Form.Select>
          <span>data per halaman</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button 
            variant="outline-secondary" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Sebelumnya
          </Button>
          <span className="px-3">
            Halaman {currentPage} dari {totalPages || 1}
          </span>
          <Button 
            variant="outline-secondary" 
            disabled={currentPage === totalPages || totalPages === 0} 
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Selanjutnya
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalMapel.id ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Kode Mata Pelajaran <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Contoh: MTK001" 
                    value={modalMapel.kode_mapel} 
                    onChange={(e) => setModalMapel({ ...modalMapel, kode_mapel: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={modalMapel.status} 
                    onChange={(e) => setModalMapel({ ...modalMapel, status: e.target.value })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Nama Mata Pelajaran <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Contoh: Matematika" 
                value={modalMapel.nama_mapel} 
                onChange={(e) => setModalMapel({ ...modalMapel, nama_mapel: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kelas</Form.Label>
              <Form.Select 
                value={modalMapel.kelas_id} 
                onChange={(e) => setModalMapel({ ...modalMapel, kelas_id: e.target.value })}
              >
                <option value="">Pilih Kelas (Opsional)</option>
                {kelas.map(kelasItem => (
                  <option key={kelasItem.id} value={kelasItem.id}>
                    {kelasItem.nama_kelas} ({kelasItem.kode_kelas})
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Pilih kelas jika mata pelajaran ini khusus untuk kelas tertentu
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Keterangan</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Deskripsi atau keterangan mata pelajaran..." 
                value={modalMapel.keterangan} 
                onChange={(e) => setModalMapel({ ...modalMapel, keterangan: e.target.value })} 
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
            onClick={handleSaveMapel}
            style={{ backgroundColor: '#006400', borderColor: '#006400' }}
          >
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaMapel;
