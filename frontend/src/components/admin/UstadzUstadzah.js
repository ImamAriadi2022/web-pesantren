import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Form, FormControl, InputGroup, Modal, Spinner, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPlus, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const UstadzUstadzah = () => {
  const [ustadz, setUstadz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalUstadz, setModalUstadz] = useState({
    id: null,
    foto: '',
    nama: '',
    nik: '',
    nip: '',
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    pendidikan_terakhir: '',
    mata_pelajaran: '',
    alamat: '',
    nomor_hp: '',
    no_hp: '',
    email: '',
    password: '123456',
    status: 'Aktif'
  });

  // Fetch data ustadz dari backend 
  const fetchUstadz = async () => {
    setLoading(true);
    try {
      console.log('Fetching ustadz data...');
      const res = await fetch('https://teralab.my.id/backend/api/ustadz/getUstadz.php');
      const json = await res.json();
      console.log('API Response:', json);
      
      if (json.success && json.data) {
        setUstadz(json.data);
        console.log('Ustadz data loaded:', json.data.length, 'records');
      } else {
        console.error('API returned error:', json.message);
        setError(json.message || 'Gagal memuat data ustadz');
        setUstadz([]);
      }
    } catch (error) {
      console.error('Error fetching ustadz:', error);
      setError('Terjadi kesalahan saat memuat data');
      setUstadz([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUstadz();
  }, []);

  const handleAddUstadz = () => {
    setModalUstadz({
      id: null,
      foto: '',
      nama: '',
      nik: '',
      nip: '',
      jenis_kelamin: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      pendidikan_terakhir: '',
      mata_pelajaran: '',
      alamat: '',
      nomor_hp: '',
      no_hp: '',
      email: '',
      password: '123456',
      status: 'Aktif'
    });
    setShowModal(true);
  };

  const handleEditUstadz = (id) => {
    const ustadzData = ustadz.find(u => u.id === id);
    if (ustadzData) {
      setModalUstadz({
        ...ustadzData,
        nik: ustadzData.nip || ustadzData.nik,
        nip: ustadzData.nip || ustadzData.nik,
        nomor_hp: ustadzData.no_hp || ustadzData.nomor_hp,
        no_hp: ustadzData.no_hp || ustadzData.nomor_hp,
        tanggal_lahir: ustadzData.tanggal_lahir ? ustadzData.tanggal_lahir.split(' ')[0] : '',
        email: ustadzData.email || `${ustadzData.nip}@pesantren.com`,
        password: '123456' // Don't load actual password
      });
      setShowModal(true);
    }
  };

  const handleDeleteUstadz = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ustadz ini?')) return;

    try {
      const res = await fetch('https://teralab.my.id/backend/api/ustadz/deleteUstadz.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) {
        setSuccess('Data ustadz berhasil dihapus!');
        fetchUstadz();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(json.message || 'Gagal menghapus data ustadz');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting ustadz:', error);
      setError('Terjadi kesalahan saat menghapus data');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveUstadz = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!modalUstadz.nama || !modalUstadz.nik) {
        setError('Nama dan NIP wajib diisi');
        setTimeout(() => setError(''), 3000);
        return;
      }
      
      // Prepare data sesuai dengan schema_clean.sql
      const apiData = {
        ...modalUstadz,
        jenisKelamin: modalUstadz.jenis_kelamin,
        tanggalLahir: modalUstadz.tanggal_lahir,
        pendidikanTerakhir: modalUstadz.pendidikan_terakhir,
        telepon: modalUstadz.nomor_hp || modalUstadz.no_hp,
        tempat_lahir: modalUstadz.tempat_lahir,
        mata_pelajaran: modalUstadz.mata_pelajaran,
        password: modalUstadz.id ? undefined : (modalUstadz.password || '123456'), // Password default untuk user baru
        email: modalUstadz.email || `${modalUstadz.nik}@pesantren.com` // Generate email from NIP
      };

      console.log('Saving ustadz data:', apiData);
      
      const res = await fetch('https://teralab.my.id/backend/api/ustadz/saveUstadz.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });
      const json = await res.json();
      console.log('Save response:', json);
      
      if (json.success) {
        setSuccess(json.message || 'Data ustadz berhasil disimpan!');
        setShowModal(false);
        fetchUstadz(); // Refresh data
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(json.message || 'Gagal menyimpan data ustadz');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error saving ustadz:', error);
      setError('Terjadi kesalahan saat menyimpan data');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const headers = 'Nama\tNIP\tJenis Kelamin\tNomor HP\tPendidikan\tStatus';
    const textToCopy = [headers, ...ustadz.map(u =>
      `${u.nama}\t${u.nip || u.nomor_identitas}\t${u.jenis_kelamin}\t${u.no_hp || u.nomor_hp}\t${u.pendidikan_terakhir}\t${u.status}`
    )].join('\n');
    navigator.clipboard.writeText(textToCopy);
    setSuccess('Data berhasil disalin ke clipboard');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExportExcel = () => {
    const exportData = ustadz.map(u => ({
      'Nama': u.nama,
      'NIP': u.nip || u.nomor_identitas,
      'Jenis Kelamin': u.jenis_kelamin,
      'Tempat Lahir': u.tempat_lahir,
      'Tanggal Lahir': u.tanggal_lahir,
      'Nomor HP': u.no_hp || u.nomor_hp,
      'Alamat': u.alamat,
      'Pendidikan Terakhir': u.pendidikan_terakhir,
      'Mata Pelajaran': u.mata_pelajaran,
      'Status': u.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'UstadzUstadzah');
    XLSX.writeFile(workbook, 'ustadz_ustadzah.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    doc.autoTable({
      head: [['Nama', 'NIP', 'Jenis Kelamin', 'Nomor HP', 'Pendidikan', 'Status']],
      body: ustadz.map(u => [
        u.nama,
        u.nip || u.nomor_identitas,
        u.jenis_kelamin,
        u.no_hp || u.nomor_hp,
        u.pendidikan_terakhir,
        u.status
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    doc.save('ustadz_ustadzah.pdf');
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

  const filteredUstadz = ustadz.filter(u =>
    (u.nama && u.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.nip && u.nip.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.nomor_identitas && u.nomor_identitas.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredUstadz.length / itemsPerPage);
  const displayedUstadz = filteredUstadz.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Aktif': { variant: 'success', text: 'Aktif' },
      'aktif': { variant: 'success', text: 'Aktif' },
      'Tidak Aktif': { variant: 'danger', text: 'Tidak Aktif' },
      'nonaktif': { variant: 'danger', text: 'Tidak Aktif' },
      'cuti': { variant: 'warning', text: 'Cuti' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status || 'Aktif' };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  return (
    <div style={{ padding: '1rem 0', minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#006400', marginBottom: 0 }}>Data Ustadz/Ustadzah</h2>
        <p className="text-muted mb-0">Berikut adalah data para ustadz dan ustadzah</p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <div className="mb-3">
        <Button
          variant="primary"
          onClick={handleAddUstadz}
          disabled={loading}
          style={{ backgroundColor: '#006400', borderColor: '#006400' }}
        >
          <FaPlus className="me-2" />Tambahkan Ustadz/Ustadzah Baru
        </Button>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
        <div className="d-flex flex-wrap gap-2">
          <Button variant="outline-secondary" onClick={handleCopy}>
            <FaCopy className="me-1" /> Salin
          </Button>
          <Button variant="outline-success" onClick={handleExportExcel}>
            <FaFileExcel className="me-1" /> Export ke Excel
          </Button>
          <Button variant="outline-danger" onClick={handleExportPDF}>
            <FaFilePdf className="me-1" /> Cetak PDF
          </Button>
          <Button variant="outline-primary" onClick={handlePrint}>
            <FaPrint className="me-1" /> Cetak Print
          </Button>
        </div>
        <InputGroup style={{ maxWidth: '300px' }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl
            type="text"
            placeholder="Cari ustadz/ustadzah..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      {loading && (
        <div className="text-center mb-3">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Memuat data...</span>
        </div>
      )}

      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <Table striped bordered hover responsive id="printableTable">
          <thead style={{ backgroundColor: '#006400', color: 'white' }}>
            <tr>
              <th>Foto Profil</th>
              <th>Nama</th>
              <th>NIP</th>
              <th>Jenis Kelamin</th>
              <th>Nomor HP</th>
              <th>Pendidikan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayedUstadz.length > 0 ? (
              displayedUstadz.map(u => (
                <tr key={u.id}>
                  <td>
                    {u.foto ? (
                      <img 
                        src={`https://teralab.my.id/backend/api/ustadz/${u.foto}`} 
                        alt={u.nama} 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          objectFit: 'cover', 
                          borderRadius: '50%' 
                        }} 
                      />
                    ) : (
                      <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '50px', height: '50px', color: 'white' }}>
                        {u.nama ? u.nama.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </td>
                  <td>{u.nama}</td>
                  <td>{u.nip || u.nomor_identitas}</td>
                  <td>{u.jenis_kelamin}</td>
                  <td>{u.no_hp || u.nomor_hp || '-'}</td>
                  <td>{u.pendidikan_terakhir || '-'}</td>
                  <td>{getStatusBadge(u.status)}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditUstadz(u.id)}>
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUstadz(u.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  {loading ? 'Memuat data...' : 'Tidak ada data ustadz'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalUstadz.id ? 'Edit Ustadz/Ustadzah' : 'Tambah Ustadz/Ustadzah Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nama Lengkap <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nama Lengkap"
                    value={modalUstadz.nama}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, nama: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>NIP <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nomor Induk Pegawai"
                    value={modalUstadz.nik || modalUstadz.nip}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, nik: e.target.value, nip: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Jenis Kelamin</Form.Label>
                  <Form.Select
                    value={modalUstadz.jenis_kelamin}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, jenis_kelamin: e.target.value })}
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tempat Lahir</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tempat Lahir"
                    value={modalUstadz.tempat_lahir}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, tempat_lahir: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Lahir</Form.Label>
                  <Form.Control
                    type="date"
                    value={modalUstadz.tanggal_lahir}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, tanggal_lahir: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nomor HP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nomor HP"
                    value={modalUstadz.nomor_hp || modalUstadz.no_hp}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, nomor_hp: e.target.value, no_hp: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Pendidikan Terakhir</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pendidikan Terakhir"
                    value={modalUstadz.pendidikan_terakhir}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, pendidikan_terakhir: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Mata Pelajaran</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mata Pelajaran yang Diampu"
                    value={modalUstadz.mata_pelajaran}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, mata_pelajaran: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Alamat</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Alamat Lengkap"
                value={modalUstadz.alamat}
                onChange={(e) => setModalUstadz({ ...modalUstadz, alamat: e.target.value })}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email untuk login"
                    value={modalUstadz.email}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, email: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={modalUstadz.status}
                    onChange={(e) => setModalUstadz({ ...modalUstadz, status: e.target.value })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                    <option value="cuti">Cuti</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            {!modalUstadz.id && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password untuk login"
                  value={modalUstadz.password}
                  onChange={(e) => setModalUstadz({ ...modalUstadz, password: e.target.value })}
                />
                <Form.Text className="text-muted">
                  Default password: 123456
                </Form.Text>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Foto Profil</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setModalUstadz({ ...modalUstadz, foto: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {modalUstadz.foto && (
                <img 
                  src={modalUstadz.foto.startsWith('data:') ? modalUstadz.foto : `https://teralab.my.id/backend/api/ustadz/${modalUstadz.foto}`}
                  alt="Preview" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    marginTop: '0.5rem'
                  }} 
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSaveUstadz} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UstadzUstadzah;
