import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const SuratIzinKeluar = () => {
  const [suratIzin, setSuratIzin] = useState([
    // Contoh data surat izin keluar
    { id: 1, nomorSurat: '001', namaSantri: 'Santri 1', kelas: 'Kelas A', jenisKelas: 'Reguler', jenisIzin: 'Sakit', tanggalKeluar: '2023-01-01', tanggalMasuk: '2023-01-05' },
    { id: 2, nomorSurat: '002', namaSantri: 'Santri 2', kelas: 'Kelas B', jenisKelas: 'Intensif', jenisIzin: 'Acara Keluarga', tanggalKeluar: '2023-01-10', tanggalMasuk: '2023-01-12' },
    // Tambahkan data surat izin keluar lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalSuratIzin, setModalSuratIzin] = useState({ id: null, nomorSurat: '', namaSantri: '', kelas: '', jenisKelas: '', jenisIzin: '', tanggalKeluar: '', tanggalMasuk: '' });

  const handleAddSuratIzin = () => {
    setModalSuratIzin({ id: null, nomorSurat: '', namaSantri: '', kelas: '', jenisKelas: '', jenisIzin: '', tanggalKeluar: '', tanggalMasuk: '' });
    setShowModal(true);
  };

  const handleEditSuratIzin = (id) => {
    const suratIzinData = suratIzin.find(s => s.id === id);
    setModalSuratIzin(suratIzinData);
    setShowModal(true);
  };

  const handleDeleteSuratIzin = (id) => {
    setSuratIzin(suratIzin.filter(s => s.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveSuratIzin = () => {
    if (modalSuratIzin.id) {
      setSuratIzin(suratIzin.map(s => (s.id === modalSuratIzin.id ? modalSuratIzin : s)));
    } else {
      setSuratIzin([...suratIzin, { ...modalSuratIzin, id: suratIzin.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleCopy = () => {
    const textToCopy = suratIzin.map(s => `${s.nomorSurat}\t${s.namaSantri}\t${s.kelas}\t${s.jenisKelas}\t${s.jenisIzin}\t${s.tanggalKeluar}\t${s.tanggalMasuk}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(suratIzin);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SuratIzinKeluar');
    XLSX.writeFile(workbook, 'surat_izin_keluar.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nomor Surat', 'Nama Santri', 'Kelas', 'Jenis Kelas', 'Jenis Izin', 'Tanggal Keluar', 'Tanggal Masuk']],
      body: suratIzin.map(s => [s.nomorSurat, s.namaSantri, s.kelas, s.jenisKelas, s.jenisIzin, s.tanggalKeluar, s.tanggalMasuk]),
    });
    doc.save('surat_izin_keluar.pdf');
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

  const filteredSuratIzin = suratIzin.filter(s =>
    s.namaSantri.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuratIzin.length / itemsPerPage);
  const displayedSuratIzin = filteredSuratIzin.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Surat Izin Keluar</h2>
      <Button variant="primary" onClick={handleAddSuratIzin} className="mb-3">Tambahkan Surat Izin Baru</Button>
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
            <th>Nomor Surat</th>
            <th>Nama Santri</th>
            <th>Kelas</th>
            <th>Jenis Kelas</th>
            <th>Jenis Izin</th>
            <th>Tanggal Keluar</th>
            <th>Tanggal Masuk</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedSuratIzin.map(s => (
            <tr key={s.id}>
              <td>{s.nomorSurat}</td>
              <td>{s.namaSantri}</td>
              <td>{s.kelas}</td>
              <td>{s.jenisKelas}</td>
              <td>{s.jenisIzin}</td>
              <td>{s.tanggalKeluar}</td>
              <td>{s.tanggalMasuk}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditSuratIzin(s.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteSuratIzin(s.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalSuratIzin.id ? 'Edit Surat Izin' : 'Tambah Surat Izin Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nomor Surat</Form.Label>
              <Form.Control type="text" placeholder="Nomor Surat" value={modalSuratIzin.nomorSurat} onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, nomorSurat: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Santri</Form.Label>
              <Form.Control type="text" placeholder="Nama Santri" value={modalSuratIzin.namaSantri} onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, namaSantri: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kelas</Form.Label>
              <Form.Control type="text" placeholder="Kelas" value={modalSuratIzin.kelas} onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, kelas: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Kelas</Form.Label>
              <Form.Control type="text" placeholder="Jenis Kelas" value={modalSuratIzin.jenisKelas} onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, jenisKelas: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Izin</Form.Label>
              <Form.Control type="text" placeholder="Jenis Izin" value={modalSuratIzin.jenisIzin} onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, jenisIzin: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Keluar</Form.Label>
              <Form.Control type="date" value={modalSuratIzin.tanggalKeluar} onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, tanggalKeluar: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Masuk</Form.Label>
              <Form.Control type="date" value={modalSuratIzin.tanggalMasuk} onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, tanggalMasuk: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveSuratIzin}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuratIzinKeluar;