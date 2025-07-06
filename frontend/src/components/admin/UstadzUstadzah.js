import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const UstadzUstadzah = () => {
  const [ustadz, setUstadz] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalUstadz, setModalUstadz] = useState({ 
    id: null, foto: '', nama: '', nik: '', jenisKelamin: '', tanggalLahir: '', pendidikanTerakhir: '' 
  });

  // Fetch data ustadz dari backend
  const fetchUstadz = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/ustadz/getUstadz.php');
      const json = await res.json();
      if (json.success) setUstadz(json.data);
    } catch (error) {
      console.error('Error fetching ustadz:', error);
    }
  };

  useEffect(() => {
    fetchUstadz();
  }, []);

  const handleAddUstadz = () => {
    setModalUstadz({ id: null, foto: '', nama: '', nik: '', jenisKelamin: '', tanggalLahir: '', pendidikanTerakhir: '' });
    setShowModal(true);
  };

  const handleEditUstadz = (id) => {
    const ustadzData = ustadz.find(u => u.id === id);
    setModalUstadz({
      ...ustadzData,
      jenisKelamin: ustadzData.jenis_kelamin,
      tanggalLahir: ustadzData.tanggal_lahir,
      pendidikanTerakhir: ustadzData.pendidikan_terakhir
    });
    setShowModal(true);
  };

  const handleDeleteUstadz = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ustadz ini?')) return;
    
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/ustadz/deleteUstadz.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) {
        alert('Data ustadz berhasil dihapus!');
        fetchUstadz();
      } else {
        alert(json.message || 'Gagal menghapus data ustadz');
      }
    } catch (error) {
      console.error('Error deleting ustadz:', error);
      alert('Terjadi kesalahan saat menghapus data');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveUstadz = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/ustadz/saveUstadz.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalUstadz)
      });
      const json = await res.json();
      if (json.success) {
        alert('Data ustadz berhasil disimpan!');
        setShowModal(false);
        fetchUstadz();
      } else {
        alert(json.message || 'Gagal menyimpan data ustadz');
      }
    } catch (error) {
      console.error('Error saving ustadz:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleCopy = () => {
    const textToCopy = ustadz.map(u => `${u.nama}\t${u.nik}\t${u.jenisKelamin}\t${u.pendidikanTerakhir}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ustadz);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'UstadzUstadzah');
    XLSX.writeFile(workbook, 'ustadz_ustadzah.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nama', 'NIK', 'Jenis Kelamin', 'Pendidikan Terakhir']],
      body: ustadz.map(u => [u.nama, u.nik, u.jenisKelamin, u.pendidikanTerakhir]),
    });
    doc.save('ustadz_ustadzah.pdf');
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
      setModalUstadz({ ...modalUstadz, foto: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const filteredUstadz = ustadz.filter(u =>
    u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.nik.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUstadz.length / itemsPerPage);
  const displayedUstadz = filteredUstadz.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Data Ustadz/Ustadzah</h2>
      <Button variant="primary" onClick={handleAddUstadz} className="mb-3">Tambahkan Ustadz/Ustadzah Baru</Button>
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
      <Table striped bordered hover id="printableTable">
        <thead>
          <tr>
            <th>Foto Profil</th>
            <th>Nama</th>
            <th>NIK</th>
            <th>Jenis Kelamin</th>
            <th>Tanggal Lahir</th>
            <th>Pendidikan Terakhir</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedUstadz.map(u => (
            <tr key={u.id}>
              <td>{u.foto && <img src={u.foto} alt={u.nama} width="50" height="50" />}</td>
              <td>{u.nama}</td>
              <td>{u.nik}</td>
              <td>{u.jenis_kelamin}</td>
              <td>{u.tanggal_lahir}</td>
              <td>{u.pendidikan_terakhir}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditUstadz(u.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteUstadz(u.id)}><FaTrash /></Button>
              </td>
            </tr>
          ))}
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalUstadz.id ? 'Edit Ustadz/Ustadzah' : 'Tambah Ustadz/Ustadzah Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Foto Profil</Form.Label>
              <Form.Control type="file" onChange={handleImageUpload} />
              {modalUstadz.foto && <img src={modalUstadz.foto} alt="Preview" width="100" height="100" className="mt-2" />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control type="text" placeholder="Nama" value={modalUstadz.nama} onChange={(e) => setModalUstadz({ ...modalUstadz, nama: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>NIK</Form.Label>
              <Form.Control type="text" placeholder="NIK" value={modalUstadz.nik} onChange={(e) => setModalUstadz({ ...modalUstadz, nik: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Control as="select" value={modalUstadz.jenisKelamin} onChange={(e) => setModalUstadz({ ...modalUstadz, jenisKelamin: e.target.value })}>
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Lahir</Form.Label>
              <Form.Control type="date" value={modalUstadz.tanggalLahir} onChange={(e) => setModalUstadz({ ...modalUstadz, tanggalLahir: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pendidikan Terakhir</Form.Label>
              <Form.Control type="text" placeholder="Pendidikan Terakhir" value={modalUstadz.pendidikanTerakhir} onChange={(e) => setModalUstadz({ ...modalUstadz, pendidikanTerakhir: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveUstadz}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UstadzUstadzah;