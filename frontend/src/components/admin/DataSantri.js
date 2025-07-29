import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const DataSantri = () => {
  const [santri, setSantri] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalSantri, setModalSantri] = useState({
    id: null, foto: '', nama: '', nis: '', jenis_kelamin: '', tanggal_lahir: '', 
    alamat: '', nama_wali: '', no_hp_wali: '', asal_sekolah: '', email: ''
  });

  // Fetch data santri dari backend
  const fetchSantri = async () => {
    const res = await fetch('http://localhost/web-pesantren/backend/api/santri/getSantri.php');
    const json = await res.json();
    if (json.success) setSantri(json.data);
  };

  useEffect(() => {
    fetchSantri();
  }, []);

  const handleAddSantri = () => {
    setModalSantri({
      id: null, foto: '', nama: '', nis: '', jenis_kelamin: '', tanggal_lahir: '', 
      alamat: '', nama_wali: '', no_hp_wali: '', asal_sekolah: '', email: ''
    });
    setShowModal(true);
  };

  const handleEditSantri = (id) => {
    const santriData = santri.find(s => s.id === id);
    setModalSantri({ ...santriData });
    setShowModal(true);
  };

  const handleDeleteSantri = async (id) => {
    if (!window.confirm('Yakin ingin menghapus santri ini?')) return;
    await fetch('http://localhost/web-pesantren/backend/api/santri/deleteSantri.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchSantri();
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleSaveSantri = async () => {
    // Validasi
    if (!modalSantri.nama || !modalSantri.nis || !modalSantri.jenis_kelamin || !modalSantri.email) {
      alert('Nama, NIS, Jenis Kelamin, dan Email wajib diisi!');
      return;
    }

    try {
      let response;
      if (modalSantri.id) {
        // Edit
        response = await fetch('http://localhost/web-pesantren/backend/api/santri/updateSantri.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modalSantri),
        });
      } else {
        // Tambah - use email from form
        const santriData = {
          ...modalSantri,
          email: modalSantri.email || `${modalSantri.nis}@pesantren.com`, // Use form email or generate from NIS
          password: '123456' // Default password
        };
        
        response = await fetch('http://localhost/web-pesantren/backend/api/santri/createSantri.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(santriData),
        });
      }

      const result = await response.json();
      if (result.success) {
        alert('Data santri berhasil disimpan!');
        setShowModal(false);
        fetchSantri();
      } else {
        alert(result.message || 'Gagal menyimpan data santri');
      }
    } catch (error) {
      console.error('Error saving santri:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleCopy = () => {
    const textToCopy = santri.map(s => `${s.nama}\t${s.nis}\t${s.jenis_kelamin}\t${s.asal_sekolah}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(santri);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Santri');
    XLSX.writeFile(workbook, 'santri.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nama Santri', 'NIS', 'Jenis Kelamin', 'Asal Sekolah']],
      body: santri.map(s => [s.nama, s.nis, s.jenis_kelamin, s.asal_sekolah]),
    });
    doc.save('santri.pdf');
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setModalSantri({ ...modalSantri, foto: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const filteredSantri = santri.filter(s =>
    (s.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.nis || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSantri.length / itemsPerPage);
  const displayedSantri = filteredSantri.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ padding: '1rem 0', minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#006400', marginBottom: 0 }}>Data Santri</h2>
        <p className="text-muted mb-0">Berikut adalah data dari para santri kami</p>
      </div>
      
      <div className="mb-3">
        <Button variant="primary" onClick={handleAddSantri} style={{ backgroundColor: '#006400', borderColor: '#006400' }}>
          Tambahkan Santri Baru
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
            placeholder="Cari santri..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </InputGroup>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <Table striped bordered hover responsive id="printableTable">
          <thead style={{ backgroundColor: '#006400', color: 'white' }}>
            <tr>
              <th>Foto Profil</th>
              <th>Nama Santri</th>
              <th>NIS</th>
              <th>Jenis Kelamin</th>
              <th>Tanggal Lahir</th>
              <th>Asal Sekolah</th>
              <th>Nama Wali</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayedSantri.length > 0 ? (
              displayedSantri.map(s => (
                <tr key={s.id}>
                  <td style={{ textAlign: 'center' }}>
                    {s.foto && (
                      <img 
                        src={`http://localhost/web-pesantren/backend/api/santri/${s.foto}`} 
                        alt={s.nama} 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          objectFit: 'cover', 
                          borderRadius: '50%' 
                        }} 
                      />
                    )}
                  </td>
                  <td>{s.nama}</td>
                  <td>{s.nis}</td>
                  <td>{s.jenis_kelamin}</td>
                  <td>{s.tanggal_lahir || '-'}</td>
                  <td>{s.asal_sekolah}</td>
                  <td>{s.nama_wali || '-'}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button 
                        variant="warning" 
                        size="sm" 
                        onClick={() => handleEditSantri(s.id)}
                        title="Edit"
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDeleteSantri(s.id)}
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
                <td colSpan="8" className="text-center py-4">
                  <div style={{ color: '#6c757d' }}>
                    <h5>Tidak ada data santri yang ditemukan</h5>
                    <p>Data santri akan ditampilkan setelah tersedia di database.</p>
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
          <Modal.Title>{modalSantri.id ? 'Edit Santri' : 'Tambah Santri Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Foto Profil</Form.Label>
              <Form.Control type="file" onChange={handleImageUpload} accept="image/*" />
              {modalSantri.foto && (
                <img 
                  src={`http://localhost/web-pesantren/backend/api/santri/${modalSantri.foto}`} 
                  alt="Preview" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    marginTop: '0.5rem'
                  }} 
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Santri <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nama Santri" 
                value={modalSantri.nama} 
                onChange={(e) => setModalSantri({ ...modalSantri, nama: e.target.value })} 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>NIS <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                placeholder="NIS" 
                value={modalSantri.nis} 
                onChange={(e) => {
                  const newNis = e.target.value;
                  setModalSantri({ 
                    ...modalSantri, 
                    nis: newNis,
                    email: modalSantri.email || `${newNis}@pesantren.com` // Auto-fill email if empty
                  });
                }} 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Email santri" 
                value={modalSantri.email || ''}
                onChange={(e) => setModalSantri({ ...modalSantri, email: e.target.value })} 
                required
              />
              <Form.Text className="text-muted">
                Email akan digunakan untuk login. Default: {modalSantri.nis ? `${modalSantri.nis}@pesantren.com` : 'nis@pesantren.com'}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Kelamin <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                value={modalSantri.jenis_kelamin} 
                onChange={(e) => setModalSantri({ ...modalSantri, jenis_kelamin: e.target.value })}
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Lahir</Form.Label>
              <Form.Control 
                type="date" 
                value={modalSantri.tanggal_lahir} 
                onChange={(e) => setModalSantri({ ...modalSantri, tanggal_lahir: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alamat</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Alamat Lengkap" 
                value={modalSantri.alamat} 
                onChange={(e) => setModalSantri({ ...modalSantri, alamat: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Wali</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nama Wali/Orang Tua" 
                value={modalSantri.nama_wali} 
                onChange={(e) => setModalSantri({ ...modalSantri, nama_wali: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>No HP Wali</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nomor HP Wali" 
                value={modalSantri.no_hp_wali} 
                onChange={(e) => setModalSantri({ ...modalSantri, no_hp_wali: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Asal Sekolah</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Asal Sekolah" 
                value={modalSantri.asal_sekolah} 
                onChange={(e) => setModalSantri({ ...modalSantri, asal_sekolah: e.target.value })} 
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
            onClick={handleSaveSantri}
            style={{ backgroundColor: '#006400', borderColor: '#006400' }}
          >
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataSantri;