import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const DataTahfidz = () => {
  const [santri, setSantri] = useState([]);
  const [tahfidz, setTahfidz] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalTahfidz, setModalTahfidz] = useState({ 
    id: null, santriId: '', surat: '', ayat: '', mulai: '', selesai: '', status: '' 
  });

  // Fetch data tahfidz dan santri dari backend
  const fetchTahfidz = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/tahfidz/getTahfidz.php');
      const json = await res.json();
      if (json.success) setTahfidz(json.data);
    } catch (error) {
      console.error('Error fetching tahfidz:', error);
    }
  };

  const fetchSantri = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/santri/getSantri.php');
      const json = await res.json();
      if (json.success) setSantri(json.data);
    } catch (error) {
      console.error('Error fetching santri:', error);
    }
  };

  useEffect(() => {
    fetchTahfidz();
    fetchSantri();
  }, []);

  const handleAddTahfidz = () => {
    setModalTahfidz({ id: null, santriId: '', surat: '', ayat: '', mulai: '', selesai: '', status: '' });
    setShowModal(true);
  };

  const handleEditTahfidz = (id) => {
    const tahfidzData = tahfidz.find(t => t.id === id);
    setModalTahfidz(tahfidzData);
    setShowModal(true);
  };

  const handleDeleteTahfidz = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data tahfidz ini?')) return;
    
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/tahfidz/deleteTahfidz.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) {
        alert('Data tahfidz berhasil dihapus!');
        fetchTahfidz();
      } else {
        alert(json.message || 'Gagal menghapus data tahfidz');
      }
    } catch (error) {
      console.error('Error deleting tahfidz:', error);
      alert('Terjadi kesalahan saat menghapus data');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveTahfidz = async () => {
    try {
      const method = modalTahfidz.id ? 'POST' : 'POST';
      const res = await fetch('http://localhost/web-pesantren/backend/api/tahfidz/saveTahfidz.php', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalTahfidz)
      });
      const json = await res.json();
      if (json.success) {
        alert('Data tahfidz berhasil disimpan!');
        setShowModal(false);
        fetchTahfidz();
      } else {
        alert(json.message || 'Gagal menyimpan data tahfidz');
      }
    } catch (error) {
      console.error('Error saving tahfidz:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleCopy = () => {
    const textToCopy = tahfidz.map(t => `${santri.find(s => s.id === t.santriId).nama}\t${t.surat}\t${t.ayat}\t${t.mulai}\t${t.selesai}\t${t.status}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tahfidz.map(t => ({
      NamaSantri: santri.find(s => s.id === t.santriId).nama,
      Surat: t.surat,
      Ayat: t.ayat,
      Mulai: t.mulai,
      Selesai: t.selesai,
      Status: t.status
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tahfidz');
    XLSX.writeFile(workbook, 'tahfidz.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nama Santri', 'Surat', 'Ayat', 'Mulai', 'Selesai', 'Status']],
      body: tahfidz.map(t => [
        santri.find(s => s.id === t.santriId).nama,
        t.surat,
        t.ayat,
        t.mulai,
        t.selesai,
        t.status
      ]),
    });
    doc.save('tahfidz.pdf');
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

  const filteredTahfidz = tahfidz.filter(t => {
    const santriData = santri.find(s => s.id === t.santri_id);
    const santriNama = santriData ? santriData.nama : '';
    return santriNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
           t.surat.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredTahfidz.length / itemsPerPage);
  const displayedTahfidz = filteredTahfidz.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ padding: '1rem 0', minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#006400', marginBottom: 0 }}>Data Tahfidz</h2>
        <p className="text-muted mb-0">Berikut adalah data tahfidz para santri</p>
      </div>
      
      <div className="mb-3">
        <Button variant="primary" onClick={handleAddTahfidz} style={{ backgroundColor: '#006400', borderColor: '#006400' }}>
          Tambahkan Tahfidz Baru
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
            placeholder="Cari tahfidz..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </InputGroup>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <Table striped bordered hover responsive id="printableTable">
          <thead style={{ backgroundColor: '#006400', color: 'white' }}>
            <tr>
              <th>Nama Santri</th>
              <th>Surat</th>
              <th>Ayat</th>
              <th>Mulai</th>
              <th>Selesai</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayedTahfidz.length > 0 ? (
              displayedTahfidz.map(t => {
                const santriData = santri.find(s => s.id === t.santri_id);
                return (
                  <tr key={t.id}>
                    <td>{santriData ? santriData.nama : 'Santri tidak ditemukan'}</td>
                    <td>{t.surat}</td>
                    <td>{t.ayat}</td>
                    <td>{t.tanggal_mulai}</td>
                    <td>{t.tanggal_selesai}</td>
                    <td>
                      <span className={`badge ${t.status === 'Selesai' ? 'bg-success' : t.status === 'Proses' ? 'bg-warning' : 'bg-secondary'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="warning" 
                          size="sm" 
                          onClick={() => handleEditTahfidz(t.id)}
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDeleteTahfidz(t.id)}
                          title="Hapus"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <div style={{ color: '#6c757d' }}>
                    <h5>Tidak ada data tahfidz yang ditemukan</h5>
                    <p>Data tahfidz akan ditampilkan setelah tersedia di database.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

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
          <Modal.Title>{modalTahfidz.id ? 'Edit Tahfidz' : 'Tambah Tahfidz Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Santri</Form.Label>
              <Form.Control as="select" value={modalTahfidz.santriId} onChange={(e) => setModalTahfidz({ ...modalTahfidz, santriId: e.target.value })}>
                <option value="">Pilih Santri</option>
                {santri.map(s => (
                  <option key={s.id} value={s.id}>{s.nama}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Surat</Form.Label>
              <Form.Control type="text" placeholder="Surat" value={modalTahfidz.surat} onChange={(e) => setModalTahfidz({ ...modalTahfidz, surat: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ayat</Form.Label>
              <Form.Control type="text" placeholder="Ayat" value={modalTahfidz.ayat} onChange={(e) => setModalTahfidz({ ...modalTahfidz, ayat: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mulai</Form.Label>
              <Form.Control type="date" value={modalTahfidz.mulai} onChange={(e) => setModalTahfidz({ ...modalTahfidz, mulai: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Selesai</Form.Label>
              <Form.Control type="date" value={modalTahfidz.selesai} onChange={(e) => setModalTahfidz({ ...modalTahfidz, selesai: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={modalTahfidz.status} onChange={(e) => setModalTahfidz({ ...modalTahfidz, status: e.target.value })}>
                <option value="Belum Mulai">Belum Mulai</option>
                <option value="Sedang Hafalan">Sedang Hafalan</option>
                <option value="Selesai">Selesai</option>
                <option value="Revisi">Revisi</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveTahfidz}
            style={{ backgroundColor: '#006400', borderColor: '#006400' }}
          >
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataTahfidz;
