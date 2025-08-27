import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, FormControl, Modal, Badge, Row, Col, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaFileExcel, FaFilePdf, FaPrint, FaCopy, FaSearch, FaUsers, FaPlus, FaMinus } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const API_BASE_URL = 'http://localhost/web-pesantren/backend/api/kelas/';

const KelolaKelas = () => {
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [modalKelas, setModalKelas] = useState({ id: null, kode_kelas: '', nama_kelas: '', keterangan: '' });
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const fetchKelas = async () => {
    try {
      const res = await fetch(API_BASE_URL + 'getAllClass.php');
      const json = await res.json();
      if (json.success) {
        const mapped = json.data.map(k => ({
          id: k.id,
          kode_kelas: k.kode_kelas,
          nama_kelas: k.nama_kelas,
          keterangan: k.keterangan,
          tingkat: k.tingkat,
          kapasitas: k.kapasitas,
          status: k.status
        }));
        setKelas(mapped);
      } else {
        showAlert('Gagal memuat data kelas: ' + json.message, 'danger');
      }
    } catch (error) {
      showAlert('Error koneksi: ' + error.message, 'danger');
    }
  };

  const fetchClassStudents = async (kelasId) => {
    try {
      const res = await fetch(API_BASE_URL + `getClassStudents.php?kelas_id=${kelasId}`);
      const json = await res.json();
      if (json.success) {
        setClassStudents(json.data.students || []);
        setSelectedClass(json.data.class_info);
      } else {
        showAlert('Gagal memuat data siswa: ' + json.message, 'danger');
      }
    } catch (error) {
      showAlert('Error koneksi: ' + error.message, 'danger');
    }
  };

  const fetchAvailableStudents = async (kelasId) => {
    try {
      const res = await fetch(API_BASE_URL + `getAvailableStudents.php?kelas_id=${kelasId}`);
      const json = await res.json();
      if (json.success) {
        setAvailableStudents(json.data || []);
      } else {
        showAlert('Gagal memuat data siswa tersedia: ' + json.message, 'danger');
      }
    } catch (error) {
      showAlert('Error koneksi: ' + error.message, 'danger');
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
    if (!window.confirm('Yakin ingin menghapus kelas ini? Semua data terkait akan ikut terhapus.')) return;
    
    try {
      const res = await fetch(API_BASE_URL + 'deleteClass.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        showAlert('Kelas berhasil dihapus');
        fetchKelas();
      } else {
        showAlert('Gagal menghapus kelas: ' + json.message, 'danger');
      }
    } catch (error) {
      showAlert('Error: ' + error.message, 'danger');
    }
  };

  const handleManageStudents = (kelasId) => {
    fetchClassStudents(kelasId);
    setShowStudentModal(true);
  };

  const handleAddStudentToClass = () => {
    fetchAvailableStudents(selectedClass?.id);
    setShowAddStudentModal(true);
  };

  const handleSaveStudentToClass = async () => {
    if (!selectedStudent) {
      showAlert('Pilih siswa terlebih dahulu', 'warning');
      return;
    }

    try {
      const res = await fetch(API_BASE_URL + 'addStudentToClass.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kelas_id: selectedClass.id,
          santri_id: selectedStudent
        }),
      });
      const json = await res.json();
      if (json.success) {
        showAlert(json.message);
        setShowAddStudentModal(false);
        setSelectedStudent('');
        fetchClassStudents(selectedClass.id);
      } else {
        showAlert(json.message, 'danger');
      }
    } catch (error) {
      showAlert('Error: ' + error.message, 'danger');
    }
  };

  const handleRemoveStudentFromClass = async (santriKelasId) => {
    if (!window.confirm('Yakin ingin memindahkan siswa dari kelas ini?')) return;

    try {
      const res = await fetch(API_BASE_URL + 'removeStudentFromClass.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ santri_kelas_id: santriKelasId }),
      });
      const json = await res.json();
      if (json.success) {
        showAlert(json.message);
        fetchClassStudents(selectedClass.id);
      } else {
        showAlert(json.message, 'danger');
      }
    } catch (error) {
      showAlert('Error: ' + error.message, 'danger');
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleSaveKelas = async () => {
    if (!modalKelas.kode_kelas || !modalKelas.nama_kelas) {
      showAlert('Kode Kelas dan Nama Kelas wajib diisi!', 'warning');
      return;
    }
    
    try {
      const url = modalKelas.id ? 'updateClass.php' : 'createClass.php';
      const res = await fetch(API_BASE_URL + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalKelas),
      });
      const json = await res.json();
      if (json.success) {
        showAlert(modalKelas.id ? 'Kelas berhasil diperbarui' : 'Kelas berhasil ditambahkan');
        setShowModal(false);
        fetchKelas();
      } else {
        showAlert(json.message, 'danger');
      }
    } catch (error) {
      showAlert('Error: ' + error.message, 'danger');
    }
  };

  const handleCopy = () => {
    const textToCopy = kelas.map(k => `${k.kode_kelas}\t${k.nama_kelas}\t${k.keterangan}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    showAlert('Data berhasil disalin ke clipboard');
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
      {alert.show && (
        <Alert variant={alert.variant} className="mb-3">
          {alert.message}
        </Alert>
      )}
      
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
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedKelas.length > 0 ? (
            displayedKelas.map(k => (
              <tr key={k.id}>
                <td>{k.kode_kelas}</td>
                <td>{k.nama_kelas}</td>
                <td>{k.keterangan}</td>
                <td>
                  <Badge bg={k.status === 'Aktif' ? 'success' : 'secondary'}>
                    {k.status || 'Aktif'}
                  </Badge>
                </td>
                <td>
                  <Button variant="info" size="sm" className="me-1" onClick={() => handleManageStudents(k.id)}>
                    <FaUsers /> Siswa
                  </Button>
                  <Button variant="warning" size="sm" className="me-1" onClick={() => handleEditKelas(k.id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteKelas(k.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">Tidak ada data kelas</td>
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

      {/* Modal Kelas */}
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

      {/* Modal Kelola Siswa */}
      <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Kelola Siswa - {selectedClass?.nama_kelas}
            <Badge bg="info" className="ms-2">{classStudents.length} siswa</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Button variant="success" onClick={handleAddStudentToClass}>
              <FaPlus /> Tambah Siswa
            </Button>
          </div>
          
          {classStudents.length > 0 ? (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIS</th>
                  <th>Tahun Ajaran</th>
                  <th>Semester</th>
                  <th>Tanggal Masuk</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student, index) => (
                  <tr key={student.santri_kelas_id}>
                    <td>{index + 1}</td>
                    <td>{student.nama}</td>
                    <td>{student.nis}</td>
                    <td>{student.tahun_ajaran}</td>
                    <td>{student.semester}</td>
                    <td>{new Date(student.tanggal_masuk).toLocaleDateString('id-ID')}</td>
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleRemoveStudentFromClass(student.santri_kelas_id)}
                      >
                        <FaMinus />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">Belum ada siswa di kelas ini.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStudentModal(false)}>Tutup</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Tambah Siswa */}
      <Modal show={showAddStudentModal} onHide={() => setShowAddStudentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Siswa ke Kelas {selectedClass?.nama_kelas}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Pilih Siswa</Form.Label>
            <Form.Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              <option value="">-- Pilih Siswa --</option>
              {availableStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.nama} ({student.nis})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {availableStudents.length === 0 && (
            <Alert variant="warning">Tidak ada siswa yang tersedia untuk ditambahkan ke kelas ini.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddStudentModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveStudentToClass} disabled={!selectedStudent}>
            Tambah ke Kelas
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaKelas;
