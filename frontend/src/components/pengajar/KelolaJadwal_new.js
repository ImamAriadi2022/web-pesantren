import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const KelolaJadwal = () => {
  const [jadwal, setJadwal] = useState([]);
  const [dropdownData, setDropdownData] = useState({ kelas: [], mapel: [], ustadz: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalJadwal, setModalJadwal] = useState({ 
    id: null, kelas_id: '', mapel_id: '', ustadz_id: '', hari: 'Senin', 
    jam: '08:00 - 09:30', ruangan: '', tahun_ajaran: '2024/2025', semester: 'Ganjil', status: 'Aktif' 
  });

  // Fetch data jadwal dari backend
  const fetchJadwal = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/jadwal/getJadwal.php');
      const json = await res.json();
      if (json.success) setJadwal(json.data);
    } catch (error) {
      console.error('Error fetching jadwal:', error);
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
    fetchJadwal();
    fetchDropdownData();
  }, []);

  const handleAddJadwal = () => {
    setModalJadwal({ 
      id: null, kelas_id: '', mapel_id: '', ustadz_id: '', hari: 'Senin', 
      jam: '08:00 - 09:30', ruangan: '', tahun_ajaran: '2024/2025', semester: 'Ganjil', status: 'Aktif' 
    });
    setShowModal(true);
  };

  const handleEditJadwal = (id) => {
    const jadwalData = jadwal.find(j => j.id === id);
    setModalJadwal({
      ...jadwalData,
      jam: jadwalData.jam || '08:00 - 09:30'
    });
    setShowModal(true);
  };

  const handleDeleteJadwal = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      try {
        const res = await fetch('http://localhost/web-pesantren/backend/api/jadwal/deleteJadwal.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const json = await res.json();
        if (json.success) {
          fetchJadwal(); // Refresh data
        } else {
          alert('Error: ' + json.message);
        }
      } catch (error) {
        console.error('Error deleting jadwal:', error);
        alert('Terjadi kesalahan saat menghapus data');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveJadwal = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/jadwal/saveJadwal.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalJadwal)
      });
      const json = await res.json();
      if (json.success) {
        fetchJadwal(); // Refresh data
        setShowModal(false);
      } else {
        alert('Error: ' + json.message);
      }
    } catch (error) {
      console.error('Error saving jadwal:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleCopy = () => {
    const textToCopy = jadwal.map(j => `${j.nama_mapel}\t${j.nama_ustadz}\t${j.nama_kelas}\t${j.jam}\t${j.hari}\t${j.status}`).join('\n');
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
      head: [['Mata Pelajaran', 'Pengajar', 'Kelas', 'Jam', 'Hari', 'Status']],
      body: jadwal.map(j => [j.nama_mapel, j.nama_ustadz, j.nama_kelas, j.jam, j.hari, j.status]),
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
    (j.nama_mapel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.nama_ustadz || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.nama_kelas || '').toLowerCase().includes(searchTerm.toLowerCase())
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
            <th>Mata Pelajaran</th>
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
              <td>{j.nama_mapel}</td>
              <td>{j.nama_ustadz}</td>
              <td>{j.nama_kelas}</td>
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
              <Form.Label>Pilih Kelas</Form.Label>
              <Form.Control as="select" value={modalJadwal.kelas_id} onChange={(e) => setModalJadwal({ ...modalJadwal, kelas_id: e.target.value })}>
                <option value="">Pilih Kelas</option>
                {dropdownData.kelas.map(kelas => (
                  <option key={kelas.id} value={kelas.id}>{kelas.nama_kelas}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Mata Pelajaran</Form.Label>
              <Form.Control as="select" value={modalJadwal.mapel_id} onChange={(e) => setModalJadwal({ ...modalJadwal, mapel_id: e.target.value })}>
                <option value="">Pilih Mata Pelajaran</option>
                {dropdownData.mapel.map(mapel => (
                  <option key={mapel.id} value={mapel.id}>{mapel.nama_mapel}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Pengajar</Form.Label>
              <Form.Control as="select" value={modalJadwal.ustadz_id} onChange={(e) => setModalJadwal({ ...modalJadwal, ustadz_id: e.target.value })}>
                <option value="">Pilih Pengajar</option>
                {dropdownData.ustadz.map(ustadz => (
                  <option key={ustadz.id} value={ustadz.id}>{ustadz.nama}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hari</Form.Label>
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
            <Form.Group className="mb-3">
              <Form.Label>Jam</Form.Label>
              <Form.Control type="text" placeholder="08:00 - 09:30" value={modalJadwal.jam} onChange={(e) => setModalJadwal({ ...modalJadwal, jam: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ruangan</Form.Label>
              <Form.Control type="text" placeholder="Ruangan" value={modalJadwal.ruangan} onChange={(e) => setModalJadwal({ ...modalJadwal, ruangan: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tahun Ajaran</Form.Label>
              <Form.Control type="text" placeholder="2024/2025" value={modalJadwal.tahun_ajaran} onChange={(e) => setModalJadwal({ ...modalJadwal, tahun_ajaran: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Semester</Form.Label>
              <Form.Control as="select" value={modalJadwal.semester} onChange={(e) => setModalJadwal({ ...modalJadwal, semester: e.target.value })}>
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={modalJadwal.status} onChange={(e) => setModalJadwal({ ...modalJadwal, status: e.target.value })}>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
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
