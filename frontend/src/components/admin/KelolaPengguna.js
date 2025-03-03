import React, { useState } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const KelolaPengguna = () => {
  const [users, setUsers] = useState([
    // Contoh data pengguna
    { id: 1, gambar: 'path/to/image1.jpg', nama: 'User 1', email: 'user1@example.com', peran: 'Admin', terdaftar: '2023-01-01', status: 'Aktif' },
    { id: 2, gambar: 'path/to/image2.jpg', nama: 'User 2', email: 'user2@example.com', peran: 'Pengajar', terdaftar: '2023-01-02', status: 'Aktif' },
    // Tambahkan data pengguna lainnya di sini
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState({ id: null, gambar: '', nama: '', email: '', peran: '', terdaftar: '', status: '' });

  const handleAddUser = () => {
    setModalUser({ id: null, gambar: '', nama: '', email: '', peran: '', terdaftar: '', status: '' });
    setShowModal(true);
  };

  const handleEditUser = (id) => {
    const user = users.find(user => user.id === id);
    setModalUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveUser = () => {
    if (modalUser.id) {
      setUsers(users.map(user => (user.id === modalUser.id ? modalUser : user)));
    } else {
      setUsers([...users, { ...modalUser, id: users.length + 1, terdaftar: new Date().toISOString().split('T')[0] }]);
    }
    setShowModal(false);
  };

  const handleCopy = () => {
    const textToCopy = users.map(user => `${user.nama}\t${user.email}\t${user.peran}\t${user.terdaftar}\t${user.status}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nama Pengguna', 'Email', 'Peran', 'Terdaftar', 'Status']],
      body: users.map(user => [user.nama, user.email, user.peran, user.terdaftar, user.status]),
    });
    doc.save('users.pdf');
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
      setModalUser({ ...modalUser, gambar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const filteredUsers = users.filter(user =>
    user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Pengguna</h2>
      <Button variant="primary" onClick={handleAddUser} className="mb-3">Tambahkan Pengguna Baru</Button>
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
            <th>Gambar</th>
            <th>Nama Pengguna</th>
            <th>Email</th>
            <th>Peran</th>
            <th>Terdaftar</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map(user => (
            <tr key={user.id}>
              <td><img src={user.gambar} alt={user.nama} width="50" height="50" /></td>
              <td>{user.nama}</td>
              <td>{user.email}</td>
              <td>{user.peran}</td>
              <td>{user.terdaftar}</td>
              <td>{user.status}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditUser(user.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalUser.id ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Gambar</Form.Label>
              <Form.Control type="file" onChange={handleImageUpload} />
              {modalUser.gambar && <img src={modalUser.gambar} alt="Preview" width="100" height="100" className="mt-2" />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Pengguna</Form.Label>
              <Form.Control type="text" placeholder="Nama Pengguna" value={modalUser.nama} onChange={(e) => setModalUser({ ...modalUser, nama: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={modalUser.email} onChange={(e) => setModalUser({ ...modalUser, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Peran</Form.Label>
              <Form.Control as="select" value={modalUser.peran} onChange={(e) => setModalUser({ ...modalUser, peran: e.target.value })}>
                <option value="Admin">Admin</option>
                <option value="Pengajar">Pengajar</option>
                <option value="Santri">Santri</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={modalUser.status} onChange={(e) => setModalUser({ ...modalUser, status: e.target.value })}>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveUser}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaPengguna;