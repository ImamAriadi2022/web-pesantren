import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch, FaEye, FaEyeSlash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const DataSantri = () => {
  const [santri, setSantri] = useState([
    // Contoh data santri
    { id: 1, foto: 'path/to/image1.jpg', nama: 'Santri 1', nis: '12345', jenisKelamin: 'Laki-laki', asalSekolah: 'Sekolah 1' },
    { id: 2, foto: 'path/to/image2.jpg', nama: 'Santri 2', nis: '67890', jenisKelamin: 'Perempuan', asalSekolah: 'Sekolah 2' },
    // Tambahkan data santri lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalSantri, setModalSantri] = useState({ id: null, foto: '', nama: '', nis: '', jenisKelamin: '', asalSekolah: '' });

  const handleAddSantri = () => {
    setModalSantri({ id: null, foto: '', nama: '', nis: '', jenisKelamin: '', asalSekolah: '' });
    setShowModal(true);
  };

  const handleEditSantri = (id) => {
    const santriData = santri.find(s => s.id === id);
    setModalSantri(santriData);
    setShowModal(true);
  };

  const handleDeleteSantri = (id) => {
    setSantri(santri.filter(s => s.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveSantri = () => {
    if (modalSantri.id) {
      setSantri(santri.map(s => (s.id === modalSantri.id ? modalSantri : s)));
    } else {
      setSantri([...santri, { ...modalSantri, id: santri.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleCopy = () => {
    const textToCopy = santri.map(s => `${s.nama}\t${s.nis}\t${s.jenisKelamin}\t${s.asalSekolah}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(santri);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Santri');
    XLSX.writeFile(workbook, 'santri.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nama Santri', 'NIS', 'Jenis Kelamin', 'Asal Sekolah']],
      body: santri.map(s => [s.nama, s.nis, s.jenisKelamin, s.asalSekolah]),
    });
    doc.save('santri.pdf');
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setModalSantri({ ...modalSantri, foto: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const filteredSantri = santri.filter(s =>
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSantri.length / itemsPerPage);
  const displayedSantri = filteredSantri.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Data Santri</h2>
      <Button variant="primary" onClick={handleAddSantri} className="mb-3">Tambahkan Santri Baru</Button>
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
            <th>Foto Profil</th>
            <th>Nama Santri</th>
            <th>NIS</th>
            <th>Jenis Kelamin</th>
            <th>Asal Sekolah</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedSantri.map(s => (
            <tr key={s.id}>
              <td><img src={s.foto} alt={s.nama} width="50" height="50" /></td>
              <td>{s.nama}</td>
              <td>{s.nis}</td>
              <td>{s.jenisKelamin}</td>
              <td>{s.asalSekolah}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditSantri(s.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteSantri(s.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalSantri.id ? 'Edit Santri' : 'Tambah Santri Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Foto Profil</Form.Label>
              <Form.Control type="file" onChange={handleImageUpload} />
              {modalSantri.foto && <img src={modalSantri.foto} alt="Preview" width="100" height="100" className="mt-2" />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Santri</Form.Label>
              <Form.Control type="text" placeholder="Nama Santri" value={modalSantri.nama} onChange={(e) => setModalSantri({ ...modalSantri, nama: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>NIS</Form.Label>
              <Form.Control type="text" placeholder="NIS" value={modalSantri.nis} onChange={(e) => setModalSantri({ ...modalSantri, nis: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Control as="select" value={modalSantri.jenisKelamin} onChange={(e) => setModalSantri({ ...modalSantri, jenisKelamin: e.target.value })}>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Asal Sekolah</Form.Label>
              <Form.Control type="text" placeholder="Asal Sekolah" value={modalSantri.asalSekolah} onChange={(e) => setModalSantri({ ...modalSantri, asalSekolah: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveSantri}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataSantri;