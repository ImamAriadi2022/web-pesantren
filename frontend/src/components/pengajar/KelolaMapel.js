import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaMapel = () => {
  const [mapel, setMapel] = useState([
    // Contoh data mapel
    { id: 1, kodeMapel: 'MP001', namaMapel: 'Matematika', kkm: 75, keterangan: 'Wajib' },
    { id: 2, kodeMapel: 'MP002', namaMapel: 'Bahasa Indonesia', kkm: 70, keterangan: 'Wajib' },
    // Tambahkan data mapel lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMapel, setModalMapel] = useState({ id: null, kodeMapel: '', namaMapel: '', kkm: '', keterangan: '' });

  const handleAddMapel = () => {
    setModalMapel({ id: null, kodeMapel: '', namaMapel: '', kkm: '', keterangan: '' });
    setShowModal(true);
  };

  const handleEditMapel = (id) => {
    const mapelData = mapel.find(m => m.id === id);
    setModalMapel(mapelData);
    setShowModal(true);
  };

  const handleDeleteMapel = (id) => {
    setMapel(mapel.filter(m => m.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveMapel = () => {
    if (modalMapel.id) {
      setMapel(mapel.map(m => (m.id === modalMapel.id ? modalMapel : m)));
    } else {
      setMapel([...mapel, { ...modalMapel, id: mapel.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleCopy = () => {
    const textToCopy = mapel.map(m => `${m.kodeMapel}\t${m.namaMapel}\t${m.kkm}\t${m.keterangan}`).join('\n');
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
      head: [['Kode Mapel', 'Nama Mapel', 'KKM', 'Keterangan']],
      body: mapel.map(m => [m.kodeMapel, m.namaMapel, m.kkm, m.keterangan]),
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
    m.namaMapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.kodeMapel.toLowerCase().includes(searchTerm.toLowerCase())
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
            <th>Keterangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedMapel.map((m, index) => (
            <tr key={m.id}>
              <td>{index + 1}</td>
              <td>{m.kodeMapel}</td>
              <td>{m.namaMapel}</td>
              <td>{m.kkm}</td>
              <td>{m.keterangan}</td>
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
              <Form.Label>Nama Mapel</Form.Label>
              <Form.Control type="text" placeholder="Nama Mapel" value={modalMapel.namaMapel} onChange={(e) => setModalMapel({ ...modalMapel, namaMapel: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>KKM</Form.Label>
              <Form.Control type="number" placeholder="KKM" value={modalMapel.kkm} onChange={(e) => setModalMapel({ ...modalMapel, kkm: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keterangan</Form.Label>
              <Form.Control type="text" placeholder="Keterangan" value={modalMapel.keterangan} onChange={(e) => setModalMapel({ ...modalMapel, keterangan: e.target.value })} />
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