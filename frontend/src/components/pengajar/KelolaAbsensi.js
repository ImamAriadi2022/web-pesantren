import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaAbsensi = () => {
  const [absensi, setAbsensi] = useState([
    // Contoh data absensi
    { id: 1, kodeAbsen: 'AB001', namaSantri: 'Santri 1', kelas: '10A', status: 'Hadir', keterangan: 'Hadir di kelas' },
    { id: 2, kodeAbsen: 'AB002', namaSantri: 'Santri 2', kelas: '10B', status: 'Izin', keterangan: 'Izin sakit' },
    // Tambahkan data absensi lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalAbsensi, setModalAbsensi] = useState({ id: null, kodeAbsen: '', namaSantri: '', kelas: '', status: '', keterangan: '' });

  const handleAddAbsensi = () => {
    setModalAbsensi({ id: null, kodeAbsen: '', namaSantri: '', kelas: '', status: '', keterangan: '' });
    setShowModal(true);
  };

  const handleEditAbsensi = (id) => {
    const absensiData = absensi.find(a => a.id === id);
    setModalAbsensi(absensiData);
    setShowModal(true);
  };

  const handleDeleteAbsensi = (id) => {
    setAbsensi(absensi.filter(a => a.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveAbsensi = () => {
    if (modalAbsensi.id) {
      setAbsensi(absensi.map(a => (a.id === modalAbsensi.id ? modalAbsensi : a)));
    } else {
      setAbsensi([...absensi, { ...modalAbsensi, id: absensi.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleCopy = () => {
    const textToCopy = absensi.map(a => `${a.kodeAbsen}\t${a.namaSantri}\t${a.kelas}\t${a.status}\t${a.keterangan}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(absensi);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Absensi');
    XLSX.writeFile(workbook, 'absensi.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Kode Absen', 'Nama Santri', 'Kelas', 'Status', 'Keterangan']],
      body: absensi.map(a => [a.kodeAbsen, a.namaSantri, a.kelas, a.status, a.keterangan]),
    });
    doc.save('absensi.pdf');
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

  const filteredAbsensi = absensi.filter(a =>
    a.namaSantri.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.kodeAbsen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAbsensi.length / itemsPerPage);
  const displayedAbsensi = filteredAbsensi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Absensi</h2>
      <Button variant="primary" onClick={handleAddAbsensi} className="mb-3">Tambahkan Absensi Baru</Button>
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
            <th>Kode Absen</th>
            <th>Nama Santri</th>
            <th>Kelas</th>
            <th>Status</th>
            <th>Keterangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedAbsensi.map((a, index) => (
            <tr key={a.id}>
              <td>{index + 1}</td>
              <td>{a.kodeAbsen}</td>
              <td>{a.namaSantri}</td>
              <td>{a.kelas}</td>
              <td>{a.status}</td>
              <td>{a.keterangan}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditAbsensi(a.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteAbsensi(a.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalAbsensi.id ? 'Edit Absensi' : 'Tambah Absensi Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Santri</Form.Label>
              <Form.Control as="select" value={modalAbsensi.namaSantri} onChange={(e) => setModalAbsensi({ ...modalAbsensi, namaSantri: e.target.value })}>
                <option value="Santri 1">Santri 1</option>
                <option value="Santri 2">Santri 2</option>
                {/* Tambahkan opsi santri lainnya di sini */}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Kelas</Form.Label>
              <Form.Control as="select" value={modalAbsensi.kelas} onChange={(e) => setModalAbsensi({ ...modalAbsensi, kelas: e.target.value })}>
                <option value="10A">10A</option>
                <option value="10B">10B</option>
                {/* Tambahkan opsi kelas lainnya di sini */}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={modalAbsensi.status} onChange={(e) => setModalAbsensi({ ...modalAbsensi, status: e.target.value })}>
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keterangan</Form.Label>
              <Form.Control type="text" placeholder="Keterangan" value={modalAbsensi.keterangan} onChange={(e) => setModalAbsensi({ ...modalAbsensi, keterangan: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveAbsensi}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaAbsensi;