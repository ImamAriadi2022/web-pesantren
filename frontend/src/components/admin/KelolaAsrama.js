import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const KelolaAsrama = () => {
  const [asrama, setAsrama] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalAsrama, setModalAsrama] = useState({ 
    id: null, namaAsrama: '', kapasitas: '', lokasi: '', jenis: '', penanggungJawab: '', fasilitas: '', status: '' 
  });

  // Fetch data asrama dari backend
  const fetchAsrama = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/asrama/getAsrama.php');
      const json = await res.json();
      if (json.success) {
        // Map data sesuai dengan format yang digunakan di frontend
        const mappedData = json.data.map(a => ({
          id: a.id,
          namaAsrama: a.nama_asrama,
          kodeAsrama: a.kode_asrama,
          kapasitas: a.kapasitas,
          lokasi: a.lokasi,
          jenis: a.jenis,
          penanggungJawab: a.penanggung_jawab,
          fasilitas: a.fasilitas,
          status: a.status
        }));
        setAsrama(mappedData);
      }
    } catch (error) {
      console.error('Error fetching asrama:', error);
    }
  };

  useEffect(() => {
    fetchAsrama();
  }, []);

  const handleAddAsrama = () => {
    setModalAsrama({ id: null, namaAsrama: '', kapasitas: '', lokasi: '', jenis: '', penanggungJawab: '', fasilitas: '', status: '' });
    setShowModal(true);
  };

  const handleEditAsrama = (id) => {
    const asramaData = asrama.find(a => a.id === id);
    setModalAsrama(asramaData);
    setShowModal(true);
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
        alert('Data asrama berhasil dihapus!');
        fetchAsrama();
      } else {
        alert(json.message || 'Gagal menghapus data asrama');
      }
    } catch (error) {
      console.error('Error deleting asrama:', error);
      alert('Terjadi kesalahan saat menghapus data');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveAsrama = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/asrama/saveAsrama.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalAsrama)
      });
      const json = await res.json();
      if (json.success) {
        alert('Data asrama berhasil disimpan!');
        setShowModal(false);
        fetchAsrama();
      } else {
        alert(json.message || 'Gagal menyimpan data asrama');
      }
    } catch (error) {
      console.error('Error saving asrama:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleCopy = () => {
    const textToCopy = asrama.map(a => `${a.namaAsrama}\t${a.kapasitas}\t${a.lokasi}\t${a.jenis}\t${a.penanggungJawab}\t${a.fasilitas}\t${a.status}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(asrama);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asrama');
    XLSX.writeFile(workbook, 'asrama.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nama Asrama', 'Kapasitas', 'Lokasi', 'Jenis', 'Penanggung Jawab', 'Fasilitas', 'Status']],
      body: asrama.map(a => [a.namaAsrama, a.kapasitas, a.lokasi, a.jenis, a.penanggungJawab, a.fasilitas, a.status]),
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
    a.namaAsrama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAsrama.length / itemsPerPage);
  const displayedAsrama = filteredAsrama.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Asrama</h2>
      <Button variant="primary" onClick={handleAddAsrama} className="mb-3">Tambahkan Asrama Baru</Button>
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
            <th>Nama Asrama</th>
            <th>Kapasitas</th>
            <th>Lokasi</th>
            <th>Jenis</th>
            <th>Penanggung Jawab</th>
            <th>Fasilitas</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedAsrama.map(a => (
            <tr key={a.id}>
              <td>{a.namaAsrama}</td>
              <td>{a.kapasitas}</td>
              <td>{a.lokasi}</td>
              <td>{a.jenis}</td>
              <td>{a.penanggungJawab}</td>
              <td>{a.fasilitas}</td>
              <td>{a.status}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditAsrama(a.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteAsrama(a.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalAsrama.id ? 'Edit Asrama' : 'Tambah Asrama Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Asrama</Form.Label>
              <Form.Control type="text" placeholder="Nama Asrama" value={modalAsrama.namaAsrama} onChange={(e) => setModalAsrama({ ...modalAsrama, namaAsrama: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kapasitas</Form.Label>
              <Form.Control type="number" placeholder="Kapasitas" value={modalAsrama.kapasitas} onChange={(e) => setModalAsrama({ ...modalAsrama, kapasitas: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lokasi</Form.Label>
              <Form.Control type="text" placeholder="Lokasi" value={modalAsrama.lokasi} onChange={(e) => setModalAsrama({ ...modalAsrama, lokasi: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis</Form.Label>
              <Form.Control as="select" value={modalAsrama.jenis} onChange={(e) => setModalAsrama({ ...modalAsrama, jenis: e.target.value })}>
                <option value="Putra">Putra</option>
                <option value="Putri">Putri</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Penanggung Jawab</Form.Label>
              <Form.Control type="text" placeholder="Penanggung Jawab" value={modalAsrama.penanggungJawab} onChange={(e) => setModalAsrama({ ...modalAsrama, penanggungJawab: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fasilitas</Form.Label>
              <Form.Control type="text" placeholder="Fasilitas" value={modalAsrama.fasilitas} onChange={(e) => setModalAsrama({ ...modalAsrama, fasilitas: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={modalAsrama.status} onChange={(e) => setModalAsrama({ ...modalAsrama, status: e.target.value })}>
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveAsrama}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaAsrama;