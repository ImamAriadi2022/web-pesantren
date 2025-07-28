import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const KelolaMapel = () => {
  const [mapel, setMapel] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMapel, setModalMapel] = useState({ id: null, kode_mapel: '', nama_mapel: '', deskripsi: '', kkm: 75, kategori: 'Umum', status: 'Aktif' });

  // Fetch data mapel dari backend
  const fetchMapel = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/mapel/getMapel.php');
      const json = await res.json();
      if (json.success) setMapel(json.data);
    } catch (error) {
      console.error('Error fetching mapel:', error);
    }
  };

  useEffect(() => {
    fetchMapel();
  }, []);

  const handleAddMapel = () => {
    setModalMapel({ id: null, kode_mapel: '', nama_mapel: '', deskripsi: '', kkm: 75, kategori: 'Umum', status: 'Aktif' });
    setShowModal(true);
  };

  const handleEditMapel = (id) => {
    const mapelData = mapel.find(m => m.id === id);
    setModalMapel(mapelData);
    setShowModal(true);
  };

  const handleDeleteMapel = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) {
      try {
        const res = await fetch('http://localhost/web-pesantren/backend/api/mapel/deleteMapel.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const json = await res.json();
        if (json.success) {
          fetchMapel(); // Refresh data
        } else {
          alert('Error: ' + json.message);
        }
      } catch (error) {
        console.error('Error deleting mapel:', error);
        alert('Terjadi kesalahan saat menghapus data');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveMapel = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/mapel/saveMapel.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalMapel)
      });
      const json = await res.json();
      if (json.success) {
        fetchMapel(); // Refresh data
        setShowModal(false);
      } else {
        alert('Error: ' + json.message);
      }
    } catch (error) {
      console.error('Error saving mapel:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleCopy = () => {
    const textToCopy = mapel.map(m => `${m.kode_mapel}\t${m.nama_mapel}\t${m.kkm}\t${m.kategori}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(mapel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mapel');
    XLSX.writeFile(workbook, 'mapel.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Kode Mapel', 'Nama Mapel', 'KKM', 'Kategori']],
      body: mapel.map(m => [m.kode_mapel, m.nama_mapel, m.kkm, m.kategori]),
    });
    doc.save('mapel.pdf');
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
    <div>
      <h2>Kelola Mapel</h2>
      <Button variant="primary" onClick={handleAddMapel} className="mb-3">Tambahkan Mapel Baru</Button>
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
            <th>Nomor</th>
            <th>Kode Mapel</th>
            <th>Nama Mapel</th>
            <th>KKM</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedMapel.map((m, index) => (
            <tr key={m.id}>
              <td>{index + 1}</td>
              <td>{m.kode_mapel}</td>
              <td>{m.nama_mapel}</td>
              <td>{m.kkm}</td>
              <td>{m.kategori}</td>
              <td>{m.status}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditMapel(m.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteMapel(m.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalMapel.id ? 'Edit Mapel' : 'Tambah Mapel Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Kode Mapel</Form.Label>
              <Form.Control type="text" placeholder="Kode Mapel" value={modalMapel.kode_mapel} onChange={(e) => setModalMapel({ ...modalMapel, kode_mapel: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Mapel</Form.Label>
              <Form.Control type="text" placeholder="Nama Mapel" value={modalMapel.nama_mapel} onChange={(e) => setModalMapel({ ...modalMapel, nama_mapel: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>KKM (Kriteria Ketuntasan Minimal)</Form.Label>
              <Form.Control type="number" placeholder="KKM" min="0" max="100" value={modalMapel.kkm} onChange={(e) => setModalMapel({ ...modalMapel, kkm: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select value={modalMapel.kategori} onChange={(e) => setModalMapel({ ...modalMapel, kategori: e.target.value })}>
                <option value="Umum">Umum</option>
                <option value="Agama">Agama</option>
                <option value="Tahfidz">Tahfidz</option>
                <option value="Keterampilan">Keterampilan</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Deskripsi" value={modalMapel.deskripsi} onChange={(e) => setModalMapel({ ...modalMapel, deskripsi: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={modalMapel.status} onChange={(e) => setModalMapel({ ...modalMapel, status: e.target.value })}>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveMapel}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaMapel;