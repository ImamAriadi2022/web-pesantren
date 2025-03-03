import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaKelas = () => {
  const [kelas, setKelas] = useState([
    // Contoh data kelas
    { id: 1, kodeKelas: 'KLS001', namaKelas: 'Kelas A', keterangan: 'Kelas untuk pemula' },
    { id: 2, kodeKelas: 'KLS002', namaKelas: 'Kelas B', keterangan: 'Kelas untuk lanjutan' },
    // Tambahkan data kelas lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalKelas, setModalKelas] = useState({ id: null, kodeKelas: '', namaKelas: '', keterangan: '' });

  const handleAddKelas = () => {
    setModalKelas({ id: null, kodeKelas: '', namaKelas: '', keterangan: '' });
    setShowModal(true);
  };

  const handleEditKelas = (id) => {
    const kelasData = kelas.find(k => k.id === id);
    setModalKelas(kelasData);
    setShowModal(true);
  };

  const handleDeleteKelas = (id) => {
    setKelas(kelas.filter(k => k.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveKelas = () => {
    if (modalKelas.id) {
      setKelas(kelas.map(k => (k.id === modalKelas.id ? modalKelas : k)));
    } else {
      setKelas([...kelas, { ...modalKelas, id: kelas.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleCopy = () => {
    const textToCopy = kelas.map(k => `${k.kodeKelas}\t${k.namaKelas}\t${k.keterangan}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(kelas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kelas');
    XLSX.writeFile(workbook, 'kelas.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Kode Kelas', 'Nama Kelas', 'Keterangan']],
      body: kelas.map(k => [k.kodeKelas, k.namaKelas, k.keterangan]),
    });
    doc.save('kelas.pdf');
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

  const filteredKelas = kelas.filter(k =>
    k.namaKelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.kodeKelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredKelas.length / itemsPerPage);
  const displayedKelas = filteredKelas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Kelas</h2>
      <Button variant="primary" onClick={handleAddKelas} className="mb-3">Tambahkan Kelas Baru</Button>
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
            <th>Kode Kelas</th>
            <th>Nama Kelas</th>
            <th>Keterangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedKelas.map(k => (
            <tr key={k.id}>
              <td>{k.kodeKelas}</td>
              <td>{k.namaKelas}</td>
              <td>{k.keterangan}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditKelas(k.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteKelas(k.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalKelas.id ? 'Edit Kelas' : 'Tambah Kelas Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Kode Kelas</Form.Label>
              <Form.Control type="text" placeholder="Kode Kelas" value={modalKelas.kodeKelas} onChange={(e) => setModalKelas({ ...modalKelas, kodeKelas: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Kelas</Form.Label>
              <Form.Control type="text" placeholder="Nama Kelas" value={modalKelas.namaKelas} onChange={(e) => setModalKelas({ ...modalKelas, namaKelas: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keterangan</Form.Label>
              <Form.Control type="text" placeholder="Keterangan" value={modalKelas.keterangan} onChange={(e) => setModalKelas({ ...modalKelas, keterangan: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveKelas}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaKelas;