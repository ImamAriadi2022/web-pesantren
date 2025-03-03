import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaPelanggaran = () => {
  const [pelanggaran, setPelanggaran] = useState([
    // Contoh data pelanggaran
    { id: 1, namaSantri: 'Santri 1', kelas: 'Kelas A', tanggalMelanggar: '2023-01-01', jenisPelanggaran: 'Terlambat', sanksi: 'Teguran', keterangan: 'Terlambat datang' },
    { id: 2, namaSantri: 'Santri 2', kelas: 'Kelas B', tanggalMelanggar: '2023-01-10', jenisPelanggaran: 'Tidak hadir', sanksi: 'Peringatan', keterangan: 'Tidak hadir tanpa keterangan' },
    // Tambahkan data pelanggaran lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalPelanggaran, setModalPelanggaran] = useState({ id: null, namaSantri: '', kelas: '', tanggalMelanggar: '', jenisPelanggaran: '', sanksi: '', keterangan: '' });

  const handleAddPelanggaran = () => {
    setModalPelanggaran({ id: null, namaSantri: '', kelas: '', tanggalMelanggar: '', jenisPelanggaran: '', sanksi: '', keterangan: '' });
    setShowModal(true);
  };

  const handleEditPelanggaran = (id) => {
    const pelanggaranData = pelanggaran.find(p => p.id === id);
    setModalPelanggaran(pelanggaranData);
    setShowModal(true);
  };

  const handleDeletePelanggaran = (id) => {
    setPelanggaran(pelanggaran.filter(p => p.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSavePelanggaran = () => {
    if (modalPelanggaran.id) {
      setPelanggaran(pelanggaran.map(p => (p.id === modalPelanggaran.id ? modalPelanggaran : p)));
    } else {
      setPelanggaran([...pelanggaran, { ...modalPelanggaran, id: pelanggaran.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleCopy = () => {
    const textToCopy = pelanggaran.map(p => `${p.namaSantri}\t${p.kelas}\t${p.tanggalMelanggar}\t${p.jenisPelanggaran}\t${p.sanksi}\t${p.keterangan}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pelanggaran);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pelanggaran');
    XLSX.writeFile(workbook, 'pelanggaran.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nama Santri', 'Kelas', 'Tanggal Melanggar', 'Jenis Pelanggaran', 'Sanksi', 'Keterangan']],
      body: pelanggaran.map(p => [p.namaSantri, p.kelas, p.tanggalMelanggar, p.jenisPelanggaran, p.sanksi, p.keterangan]),
    });
    doc.save('pelanggaran.pdf');
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

  const filteredPelanggaran = pelanggaran.filter(p =>
    p.namaSantri.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.jenisPelanggaran.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPelanggaran.length / itemsPerPage);
  const displayedPelanggaran = filteredPelanggaran.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Pelanggaran</h2>
      <Button variant="primary" onClick={handleAddPelanggaran} className="mb-3">Tambahkan Pelanggaran Baru</Button>
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
            <th>Nama Santri</th>
            <th>Kelas</th>
            <th>Tanggal Melanggar</th>
            <th>Jenis Pelanggaran</th>
            <th>Sanksi</th>
            <th>Keterangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedPelanggaran.map(p => (
            <tr key={p.id}>
              <td>{p.namaSantri}</td>
              <td>{p.kelas}</td>
              <td>{p.tanggalMelanggar}</td>
              <td>{p.jenisPelanggaran}</td>
              <td>{p.sanksi}</td>
              <td>{p.keterangan}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditPelanggaran(p.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeletePelanggaran(p.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalPelanggaran.id ? 'Edit Pelanggaran' : 'Tambah Pelanggaran Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Santri</Form.Label>
              <Form.Control type="text" placeholder="Nama Santri" value={modalPelanggaran.namaSantri} onChange={(e) => setModalPelanggaran({ ...modalPelanggaran, namaSantri: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kelas</Form.Label>
              <Form.Control type="text" placeholder="Kelas" value={modalPelanggaran.kelas} onChange={(e) => setModalPelanggaran({ ...modalPelanggaran, kelas: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Melanggar</Form.Label>
              <Form.Control type="date" value={modalPelanggaran.tanggalMelanggar} onChange={(e) => setModalPelanggaran({ ...modalPelanggaran, tanggalMelanggar: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Pelanggaran</Form.Label>
              <Form.Control type="text" placeholder="Jenis Pelanggaran" value={modalPelanggaran.jenisPelanggaran} onChange={(e) => setModalPelanggaran({ ...modalPelanggaran, jenisPelanggaran: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sanksi</Form.Label>
              <Form.Control type="text" placeholder="Sanksi" value={modalPelanggaran.sanksi} onChange={(e) => setModalPelanggaran({ ...modalPelanggaran, sanksi: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keterangan</Form.Label>
              <Form.Control type="text" placeholder="Keterangan" value={modalPelanggaran.keterangan} onChange={(e) => setModalPelanggaran({ ...modalPelanggaran, keterangan: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSavePelanggaran}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaPelanggaran;