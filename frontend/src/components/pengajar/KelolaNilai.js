import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaNilai = () => {
  const [nilai, setNilai] = useState([
    // Contoh data nilai
    { id: 1, kodeNilai: 'NL001', namaSantri: 'Santri 1', mapel: 'Matematika', nilai: 85 },
    { id: 2, kodeNilai: 'NL002', namaSantri: 'Santri 2', mapel: 'Bahasa Indonesia', nilai: 90 },
    // Tambahkan data nilai lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalNilai, setModalNilai] = useState({ id: null, kodeNilai: '', namaSantri: '', mapel: '', nilai: '' });

  const handleAddNilai = () => {
    setModalNilai({ id: null, kodeNilai: '', namaSantri: '', mapel: '', nilai: '' });
    setShowModal(true);
  };

  const handleEditNilai = (id) => {
    const nilaiData = nilai.find(n => n.id === id);
    setModalNilai(nilaiData);
    setShowModal(true);
  };

  const handleDeleteNilai = (id) => {
    setNilai(nilai.filter(n => n.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveNilai = () => {
    if (modalNilai.id) {
      setNilai(nilai.map(n => (n.id === modalNilai.id ? modalNilai : n)));
    } else {
      setNilai([...nilai, { ...modalNilai, id: nilai.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleCopy = () => {
    const textToCopy = nilai.map(n => `${n.kodeNilai}\t${n.namaSantri}\t${n.mapel}\t${n.nilai}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(nilai);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nilai');
    XLSX.writeFile(workbook, 'nilai.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Kode Nilai', 'Nama Santri', 'Mapel', 'Nilai']],
      body: nilai.map(n => [n.kodeNilai, n.namaSantri, n.mapel, n.nilai]),
    });
    doc.save('nilai.pdf');
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

  const filteredNilai = nilai.filter(n =>
    n.namaSantri.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.kodeNilai.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNilai.length / itemsPerPage);
  const displayedNilai = filteredNilai.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Nilai</h2>
      <Button variant="primary" onClick={handleAddNilai} className="mb-3">Tambahkan Nilai Baru</Button>
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
            <th>Kode Nilai</th>
            <th>Nama Santri</th>
            <th>Mapel</th>
            <th>Nilai</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedNilai.map((n, index) => (
            <tr key={n.id}>
              <td>{index + 1}</td>
              <td>{n.kodeNilai}</td>
              <td>{n.namaSantri}</td>
              <td>{n.mapel}</td>
              <td>{n.nilai}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditNilai(n.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteNilai(n.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalNilai.id ? 'Edit Nilai' : 'Tambah Nilai Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Santri</Form.Label>
              <Form.Control as="select" value={modalNilai.namaSantri} onChange={(e) => setModalNilai({ ...modalNilai, namaSantri: e.target.value })}>
                <option value="Santri 1">Santri 1</option>
                <option value="Santri 2">Santri 2</option>
                {/* Tambahkan opsi santri lainnya di sini */}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Mapel</Form.Label>
              <Form.Control as="select" value={modalNilai.mapel} onChange={(e) => setModalNilai({ ...modalNilai, mapel: e.target.value })}>
                <option value="Matematika">Matematika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                {/* Tambahkan opsi mapel lainnya di sini */}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Masukkan Nilai</Form.Label>
              <Form.Control type="number" placeholder="Nilai" value={modalNilai.nilai} onChange={(e) => setModalNilai({ ...modalNilai, nilai: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveNilai}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaNilai;