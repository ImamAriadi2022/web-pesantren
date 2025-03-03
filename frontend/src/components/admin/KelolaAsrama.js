import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaAsrama = () => {
  const [asrama, setAsrama] = useState([
    // Contoh data asrama
    { id: 1, namaAsrama: 'Asrama A', kapasitas: 50, lokasi: 'Blok A', jenis: 'Putra', penanggungJawab: 'Ustadz 1', fasilitas: 'AC, WiFi', status: 'Aktif' },
    { id: 2, namaAsrama: 'Asrama B', kapasitas: 40, lokasi: 'Blok B', jenis: 'Putri', penanggungJawab: 'Ustadzah 2', fasilitas: 'AC, WiFi', status: 'Aktif' },
    // Tambahkan data asrama lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalAsrama, setModalAsrama] = useState({ id: null, namaAsrama: '', kapasitas: '', lokasi: '', jenis: '', penanggungJawab: '', fasilitas: '', status: '' });

  const handleAddAsrama = () => {
    setModalAsrama({ id: null, namaAsrama: '', kapasitas: '', lokasi: '', jenis: '', penanggungJawab: '', fasilitas: '', status: '' });
    setShowModal(true);
  };

  const handleEditAsrama = (id) => {
    const asramaData = asrama.find(a => a.id === id);
    setModalAsrama(asramaData);
    setShowModal(true);
  };

  const handleDeleteAsrama = (id) => {
    setAsrama(asrama.filter(a => a.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveAsrama = () => {
    if (modalAsrama.id) {
      setAsrama(asrama.map(a => (a.id === modalAsrama.id ? modalAsrama : a)));
    } else {
      setAsrama([...asrama, { ...modalAsrama, id: asrama.length + 1 }]);
    }
    setShowModal(false);
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