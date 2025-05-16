import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaKelas = () => {
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalKelas, setModalKelas] = useState({ id: null, kode_kelas: '', nama_kelas: '', keterangan: '' });

  const fetchKelas = async () => {
    const res = await fetch('http://localhost/web-pesantren/backend/api/kelas/getAllClass.php');
    const json = await res.json();
    if (json.success) {
      // Mapping snake_case ke camelCase
      const mapped = json.data.map(k => ({
        id: k.id,
        kode_kelas: k.kode_kelas,
        nama_kelas: k.nama_kelas,
        keterangan: k.keterangan
      }));
      setKelas(mapped);
    }
  };

  useEffect(() => {
    fetchKelas();
  }, []);

  const handleAddKelas = () => {
    setModalKelas({ id: null, kode_kelas: '', nama_kelas: '', keterangan: '' });
    setShowModal(true);
  };

  const handleEditKelas = (id) => {
    const kelasData = kelas.find(k => k.id === id);
    setModalKelas(kelasData);
    setShowModal(true);
  };

  const handleDeleteKelas = async (id) => {
    if (!window.confirm('Yakin ingin menghapus kelas ini?')) return;
    await fetch('http://localhost/web-pesantren/backend/api/kelas/deleteClass.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchKelas();
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleSaveKelas = async () => {
    if (!modalKelas.kode_kelas || !modalKelas.nama_kelas) {
      alert('Kode Kelas dan Nama Kelas wajib diisi!');
      return;
    }
    if (modalKelas.id) {
      // Edit
      await fetch('http://localhost/web-pesantren/backend/api/kelas/updateClass.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalKelas),
      });
    } else {
      // Tambah
      await fetch('http://localhost/web-pesantren/backend/api/kelas/createClass.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalKelas),
      });
    }
    setShowModal(false);
    fetchKelas();
  };

  const handleCopy = () => {
    const textToCopy = kelas.map(k => `${k.kode_kelas}\t${k.nama_kelas}\t${k.keterangan}`).join('\n');
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
      body: kelas.map(k => [k.kode_kelas, k.nama_kelas, k.keterangan]),
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
    (k.nama_kelas || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (k.kode_kelas || '').toLowerCase().includes(searchTerm.toLowerCase())
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
              <td>{k.kode_kelas}</td>
              <td>{k.nama_kelas}</td>
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
              <Form.Control type="text" placeholder="Kode Kelas" value={modalKelas.kode_kelas} onChange={(e) => setModalKelas({ ...modalKelas, kode_kelas: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Kelas</Form.Label>
              <Form.Control type="text" placeholder="Nama Kelas" value={modalKelas.nama_kelas} onChange={(e) => setModalKelas({ ...modalKelas, nama_kelas: e.target.value })} />
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