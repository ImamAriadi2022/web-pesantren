import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaJadwal = () => {
  const [jadwal, setJadwal] = useState([
    // Contoh data jadwal
    { id: 1, kodeJadwal: 'JD001', mapel: 'Matematika', pengajar: 'Ustadz 1', kelas: '10A', jam: '08:00 - 09:30', hari: 'Senin', status: 'Aktif' },
    { id: 2, kodeJadwal: 'JD002', mapel: 'Bahasa Indonesia', pengajar: 'Ustadzah 2', kelas: '10B', jam: '09:30 - 11:00', hari: 'Selasa', status: 'Aktif' },
    // Tambahkan data jadwal lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalJadwal, setModalJadwal] = useState({ id: null, kodeJadwal: '', mapel: '', pengajar: '', kelas: '', jam: '', hari: '', status: '' });

  const handleAddJadwal = () => {
    setModalJadwal({ id: null, kodeJadwal: '', mapel: '', pengajar: '', kelas: '', jam: '', hari: '', status: 'Aktif' });
    setShowModal(true);
  };

  const handleEditJadwal = (id) => {
    const jadwalData = jadwal.find(j => j.id === id);
    setModalJadwal(jadwalData);
    setShowModal(true);
  };

  const handleDeleteJadwal = (id) => {
    setJadwal(jadwal.filter(j => j.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveJadwal = () => {
    if (modalJadwal.id) {
      setJadwal(jadwal.map(j => (j.id === modalJadwal.id ? modalJadwal : j)));
    } else {
      setJadwal([...jadwal, { ...modalJadwal, id: jadwal.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleCopy = () => {
    const textToCopy = jadwal.map(j => `${j.kodeJadwal}\t${j.mapel}\t${j.pengajar}\t${j.kelas}\t${j.jam}\t${j.hari}\t${j.status}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(jadwal);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jadwal');
    XLSX.writeFile(workbook, 'jadwal.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Kode Jadwal', 'Mapel', 'Pengajar', 'Kelas', 'Jam', 'Hari', 'Status']],
      body: jadwal.map(j => [j.kodeJadwal, j.mapel, j.pengajar, j.kelas, j.jam, j.hari, j.status]),
    });
    doc.save('jadwal.pdf');
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

  const filteredJadwal = jadwal.filter(j =>
    j.mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.kodeJadwal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJadwal.length / itemsPerPage);
  const displayedJadwal = filteredJadwal.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Jadwal</h2>
      <Button variant="primary" onClick={handleAddJadwal} className="mb-3">Tambahkan Jadwal Baru</Button>
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
            <th>Kode Jadwal</th>
            <th>Mapel</th>
            <th>Pengajar</th>
            <th>Kelas</th>
            <th>Jam</th>
            <th>Hari</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedJadwal.map((j, index) => (
            <tr key={j.id}>
              <td>{index + 1}</td>
              <td>{j.kodeJadwal}</td>
              <td>{j.mapel}</td>
              <td>{j.pengajar}</td>
              <td>{j.kelas}</td>
              <td>{j.jam}</td>
              <td>{j.hari}</td>
              <td>{j.status}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditJadwal(j.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteJadwal(j.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalJadwal.id ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Mapel</Form.Label>
              <Form.Control as="select" value={modalJadwal.mapel} onChange={(e) => setModalJadwal({ ...modalJadwal, mapel: e.target.value })}>
                <option value="Matematika">Matematika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                {/* Tambahkan opsi mapel lainnya di sini */}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Kelas</Form.Label>
              <Form.Control as="select" value={modalJadwal.kelas} onChange={(e) => setModalJadwal({ ...modalJadwal, kelas: e.target.value })}>
                <option value="10A">10A</option>
                <option value="10B">10B</option>
                {/* Tambahkan opsi kelas lainnya di sini */}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Pengajar</Form.Label>
              <Form.Control as="select" value={modalJadwal.pengajar} onChange={(e) => setModalJadwal({ ...modalJadwal, pengajar: e.target.value })}>
                <option value="Ustadz 1">Ustadz 1</option>
                <option value="Ustadzah 2">Ustadzah 2</option>
                {/* Tambahkan opsi pengajar lainnya di sini */}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jam Mulai</Form.Label>
              <Form.Control type="time" value={modalJadwal.jam} onChange={(e) => setModalJadwal({ ...modalJadwal, jam: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Hari</Form.Label>
              <Form.Control as="select" value={modalJadwal.hari} onChange={(e) => setModalJadwal({ ...modalJadwal, hari: e.target.value })}>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveJadwal}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaJadwal;