import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch, FaEye, FaEyeSlash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost/web-pesantren/backend/api/users/';

const KelolaPengguna = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState({
    id: null, gambar: '', nama: '', email: '', peran: '', terdaftar: '', status: 'Aktif', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch users from backend
  const fetchUsers = async () => {
    const res = await fetch(API_URL + 'getUsers.php');
    const json = await res.json();
    if (json.success) {
      // Jika backend belum ada field nama/gambar/status/terdaftar, tambahkan dummy
      setUsers(json.data.map(u => ({
        ...u,
        nama: u.nama || u.email.split('@')[0],
        gambar: u.gambar || '',
        status: u.status || 'Aktif',
        terdaftar: u.terdaftar || new Date().toISOString().split('T')[0],
        peran: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : '',
      })));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setModalUser({ id: null, gambar: '', nama: '', email: '', peran: '', terdaftar: '', status: 'Aktif', password: '', confirmPassword: '' });
    setShowModal(true);
  };

  const handleEditUser = (id) => {
    const user = users.find(user => user.id === id);
    setModalUser({ ...user, password: '', confirmPassword: '' });
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pengguna ini?')) return;
    await fetch(API_URL + 'deleteUser.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleSaveUser = async () => {
    if (modalUser.password !== modalUser.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok');
      return;
    }
    if (!modalUser.email || !modalUser.peran) {
      alert('Email dan Peran wajib diisi!');
      return;
    }
    // Siapkan data yang akan dikirim
    const payload = {
      id: modalUser.id,
      email: modalUser.email,
      role: modalUser.peran.toLowerCase(),
      password: modalUser.password,
      // Jika backend sudah support, tambahkan field berikut:
      nama: modalUser.nama,
      gambar: modalUser.gambar,
      status: modalUser.status,
      terdaftar: modalUser.terdaftar,
    };

    if (modalUser.id) {
      // Update
      await fetch(API_URL + 'updateUser.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      // Create
      await fetch(API_URL + 'createUser.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setShowModal(false);
    fetchUsers();
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
    if (file) reader.readAsDataURL(file);
  };

  const filteredUsers = users.filter(user =>
    (user.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
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
              <td>
                {user.gambar
                  ? <img src={user.gambar.startsWith('data:') ? user.gambar : user.gambar ? `http://localhost/web-pesantren/backend/api/users/${user.gambar}` : ''} alt={user.nama} width="50" height="50" />
                  : <span>-</span>
                }
              </td>
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
              {modalUser.gambar && <img src={modalUser.gambar.startsWith('data:') ? modalUser.gambar : `http://localhost/web-pesantren/backend/api/users/${modalUser.gambar}`} alt="Preview" width="100" height="100" className="mt-2" />}
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
                <option value="">Pilih Peran</option>
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
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={modalUser.password}
                  onChange={(e) => setModalUser({ ...modalUser, password: e.target.value })}
                />
                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Konfirmasi Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi Password"
                  value={modalUser.confirmPassword}
                  onChange={(e) => setModalUser({ ...modalUser, confirmPassword: e.target.value })}
                />
                <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
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