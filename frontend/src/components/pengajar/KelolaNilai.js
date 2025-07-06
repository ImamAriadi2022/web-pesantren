import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const KelolaNilai = () => {
  const [nilai, setNilai] = useState([]);
  const [dropdownData, setDropdownData] = useState({ santri: [], mapel: [], kelas: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalNilai, setModalNilai] = useState({ 
    id: null, santri_id: '', mapel_id: '', jenis_nilai: 'UTS', nilai: '', 
    bobot: 1.00, keterangan: '', tahun_ajaran: '2024/2025', semester: 'Ganjil' 
  });

  // Fetch data nilai dari backend
  const fetchNilai = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/nilai/getNilai.php');
      const json = await res.json();
      if (json.success) setNilai(json.data);
    } catch (error) {
      console.error('Error fetching nilai:', error);
    }
  };

  // Fetch dropdown data untuk form
  const fetchDropdownData = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/public/getDropdownData.php');
      const json = await res.json();
      if (json.success) setDropdownData(json.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  useEffect(() => {
    fetchNilai();
    fetchDropdownData();
  }, []);

  const handleAddNilai = () => {
    setModalNilai({ 
      id: null, santri_id: '', mapel_id: '', jenis_nilai: 'UTS', nilai: '', 
      bobot: 1.00, keterangan: '', tahun_ajaran: '2024/2025', semester: 'Ganjil' 
    });
    setShowModal(true);
  };

  const handleEditNilai = (id) => {
    const nilaiData = nilai.find(n => n.id === id);
    setModalNilai(nilaiData);
    setShowModal(true);
  };

  const handleDeleteNilai = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus nilai ini?')) {
      try {
        const res = await fetch('http://localhost/web-pesantren/backend/api/nilai/deleteNilai.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const json = await res.json();
        if (json.success) {
          fetchNilai(); // Refresh data
        } else {
          alert('Error: ' + json.message);
        }
      } catch (error) {
        console.error('Error deleting nilai:', error);
        alert('Terjadi kesalahan saat menghapus data');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveNilai = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/nilai/saveNilai.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalNilai)
      });
      const json = await res.json();
      if (json.success) {
        fetchNilai(); // Refresh data
        setShowModal(false);
      } else {
        alert('Error: ' + json.message);
      }
    } catch (error) {
      console.error('Error saving nilai:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleCopy = () => {
    const textToCopy = nilai.map(n => `${n.nama_santri}\t${n.nama_mapel}\t${n.jenis_nilai}\t${n.nilai}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Data berhasil disalin ke clipboard');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(nilai);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nilai');
    XLSX.writeFile(workbook, 'nilai.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nama Santri', 'Mata Pelajaran', 'Jenis Nilai', 'Nilai']],
      body: nilai.map(n => [n.nama_santri, n.nama_mapel, n.jenis_nilai, n.nilai]),
    });
    doc.save('nilai.pdf');
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

  const filteredNilai = nilai.filter(n =>
    (n.nama_santri || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.nama_mapel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.nama_kelas || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNilai.length / itemsPerPage);
  const displayedNilai = filteredNilai.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h2>Kelola Nilai</h2>
      <Button variant="primary" onClick={handleAddNilai} className="mb-3">Tambahkan Nilai Baru</Button>
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
            <th>Nama Santri</th>
            <th>NIS</th>
            <th>Kelas</th>
            <th>Mata Pelajaran</th>
            <th>Jenis Nilai</th>
            <th>Nilai</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedNilai.map((n, index) => (
            <tr key={n.id}>
              <td>{index + 1}</td>
              <td>{n.nama_santri}</td>
              <td>{n.nis}</td>
              <td>{n.nama_kelas}</td>
              <td>{n.nama_mapel}</td>
              <td>{n.jenis_nilai}</td>
              <td>{n.nilai}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditNilai(n.id)}><FaEdit /></Button>
                <Button variant="danger" onClick={() => handleDeleteNilai(n.id)}><FaTrash /></Button>
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
          <Modal.Title>{modalNilai.id ? 'Edit Nilai' : 'Tambah Nilai Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Santri</Form.Label>
              <Form.Control as="select" value={modalNilai.santri_id} onChange={(e) => setModalNilai({ ...modalNilai, santri_id: e.target.value })}>
                <option value="">Pilih Santri</option>
                {dropdownData.santri.map(santri => (
                  <option key={santri.id} value={santri.id}>{santri.nama} ({santri.nis})</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Mata Pelajaran</Form.Label>
              <Form.Control as="select" value={modalNilai.mapel_id} onChange={(e) => setModalNilai({ ...modalNilai, mapel_id: e.target.value })}>
                <option value="">Pilih Mata Pelajaran</option>
                {dropdownData.mapel.map(mapel => (
                  <option key={mapel.id} value={mapel.id}>{mapel.nama_mapel}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Nilai</Form.Label>
              <Form.Control as="select" value={modalNilai.jenis_nilai} onChange={(e) => setModalNilai({ ...modalNilai, jenis_nilai: e.target.value })}>
                <option value="Tugas">Tugas</option>
                <option value="UTS">UTS</option>
                <option value="UAS">UAS</option>
                <option value="Praktik">Praktik</option>
                <option value="Hafalan">Hafalan</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Masukkan Nilai</Form.Label>
              <Form.Control type="number" placeholder="Nilai (0-100)" min="0" max="100" value={modalNilai.nilai} onChange={(e) => setModalNilai({ ...modalNilai, nilai: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bobot (Opsional)</Form.Label>
              <Form.Control type="number" placeholder="Bobot" step="0.01" min="0" max="1" value={modalNilai.bobot} onChange={(e) => setModalNilai({ ...modalNilai, bobot: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tahun Ajaran</Form.Label>
              <Form.Control type="text" placeholder="2024/2025" value={modalNilai.tahun_ajaran} onChange={(e) => setModalNilai({ ...modalNilai, tahun_ajaran: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Semester</Form.Label>
              <Form.Control as="select" value={modalNilai.semester} onChange={(e) => setModalNilai({ ...modalNilai, semester: e.target.value })}>
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keterangan (Opsional)</Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="Keterangan" value={modalNilai.keterangan} onChange={(e) => setModalNilai({ ...modalNilai, keterangan: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSaveNilai}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KelolaNilai;