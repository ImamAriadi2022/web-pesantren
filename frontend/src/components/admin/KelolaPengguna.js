import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaEye, FaEyeSlash, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
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
    try {
      const res = await fetch(API_URL + 'getUsers.php');
      const json = await res.json();
      if (json.success) {
        // Format data dari API yang sudah diperbaiki
        setUsers(json.data.map(u => ({
          ...u,
          nama: u.nama || 'Belum Diisi',
          nomor_identitas: u.nomor_identitas || '-',
          peran: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : '',
          terdaftar: u.created_at || new Date().toLocaleDateString('id-ID'),
          status: u.status || 'Active'
        })));
      } else {
        console.error('Error fetching users:', json.message);
        alert('Gagal memuat data pengguna: ' + json.message);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error koneksi ke server');
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
    try {
      const res = await fetch(API_URL + 'deleteUser.php?id=' + id, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        alert('Pengguna berhasil dihapus');
        fetchUsers();
      } else {
        alert('Gagal menghapus pengguna: ' + json.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleSaveUser = async () => {
    if (modalUser.password && modalUser.password !== modalUser.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok');
      return;
    }
    if (!modalUser.email || !modalUser.peran) {
      alert('Email dan Peran wajib diisi!');
      return;
    }
    
    try {
      // Siapkan data yang akan dikirim
      const payload = {
        id: modalUser.id,
        email: modalUser.email,
        role: modalUser.peran.toLowerCase(),
        nama: modalUser.nama,
        status: modalUser.status?.toLowerCase() || 'aktif'
      };
      
      // Hanya tambahkan password jika diisi
      if (modalUser.password) {
        payload.password = modalUser.password;
      }

      const url = modalUser.id ? 'updateUser.php' : 'createUser.php';
      const method = modalUser.id ? 'PUT' : 'POST';
      
      const res = await fetch(API_URL + url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      if (json.success) {
        alert(modalUser.id ? 'Pengguna berhasil diupdate' : 'Pengguna berhasil ditambahkan');
        setShowModal(false);
        fetchUsers();
      } else {
        alert('Error: ' + json.message);
      }
    } catch (error) {
      alert('Network Error: ' + error.message);
    }
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
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>NIS/NIK</th>
            <th>Terdaftar</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.length > 0 ? (
            displayedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{user.nama}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'pengajar' ? 'bg-primary' : 'bg-success'}`}>
                    {user.peran}
                  </span>
                </td>
                <td>{user.nomor_identitas}</td>
                <td>{user.terdaftar}</td>
                <td>
                  <span className={`badge ${user.status === 'aktif' ? 'bg-success' : 'bg-secondary'}`}>
                    {user.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td>
                  <Button variant="warning" size="sm" className="me-1" onClick={() => handleEditUser(user.id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">Tidak ada data pengguna</td>
            </tr>
          )}
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
