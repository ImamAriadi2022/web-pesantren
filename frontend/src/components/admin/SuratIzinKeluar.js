import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Form, FormControl, InputGroup, Modal, Spinner, Table } from 'react-bootstrap';
import { FaCopy, FaEdit, FaFileExcel, FaFilePdf, FaPlus, FaPrint, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const SuratIzinKeluar = () => {
  const [suratIzin, setSuratIzin] = useState([]);
  const [santriList, setSantriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalSuratIzin, setModalSuratIzin] = useState({ 
    id: null, 
    santri_id: '', 
    tanggal_keluar: '', 
    jam_keluar: '', 
    tanggal_kembali: '', 
    jam_kembali: '', 
    keperluan: '', 
    alamat_tujuan: '',
    nama_penjemput: '',
    no_hp_penjemput: '',
    status: 'Belum Kembali'
  });

  // Fetch data dari API
  useEffect(() => {
    fetchSuratIzin();
    fetchSantriList();
    fetchKelasList();
  }, []);

  const fetchSuratIzin = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://teralab.my.id/backend/api/surat_izin/surat_izin.php');
      const data = await response.json();
      
      if (data.success) {
        setSuratIzin(data.data || []);
      } else {
        setError('Gagal memuat data surat izin');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSantriList = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/surat_izin/getSantri.php');
      const data = await response.json();
      
      if (data.success) {
        setSantriList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching santri:', error);
    }
  };

  const fetchKelasList = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/surat_izin/getKelas.php');
      const data = await response.json();
      
      if (data.success) {
        setKelasList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
    }
  };

  const handleAddSuratIzin = () => {
    setModalSuratIzin({ 
      id: null, 
      santri_id: '', 
      tanggal_keluar: '', 
      jam_keluar: '', 
      tanggal_kembali: '', 
      jam_kembali: '', 
      keperluan: '', 
      alamat_tujuan: '',
      nama_penjemput: '',
      no_hp_penjemput: '',
      status: 'Belum Kembali'
    });
    setShowModal(true);
  };

  const handleEditSuratIzin = (id) => {
    const suratIzinData = suratIzin.find(s => s.id === id);
    if (suratIzinData) {
      setModalSuratIzin({
        ...suratIzinData,
        santri_id: suratIzinData.santri_id || '',
        tanggal_keluar: suratIzinData.tanggal_keluar || '',
        jam_keluar: suratIzinData.jam_keluar || '',
        tanggal_kembali: suratIzinData.tanggal_kembali || '',
        jam_kembali: suratIzinData.jam_kembali || '',
        keperluan: suratIzinData.keperluan || '',
        alamat_tujuan: suratIzinData.alamat_tujuan || '',
        nama_penjemput: suratIzinData.nama_penjemput || '',
        no_hp_penjemput: suratIzinData.no_hp_penjemput || '',
        status: suratIzinData.status || 'Belum Kembali'
      });
      setShowModal(true);
    }
  };

  const handleDeleteSuratIzin = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus surat izin ini?')) {
      try {
        const response = await fetch('https://teralab.my.id/backend/api/surat_izin/surat_izin.php', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess('Surat izin berhasil dihapus');
          fetchSuratIzin();
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(data.message || 'Gagal menghapus surat izin');
          setTimeout(() => setError(''), 3000);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Terjadi kesalahan saat menghapus surat izin');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveSuratIzin = async () => {
    // Validasi input wajib
    if (!modalSuratIzin.santri_id || !modalSuratIzin.tanggal_keluar || !modalSuratIzin.jam_keluar || 
        !modalSuratIzin.tanggal_kembali || !modalSuratIzin.jam_kembali || !modalSuratIzin.keperluan || 
        !modalSuratIzin.alamat_tujuan) {
      setError('Semua field yang wajib harus diisi');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      const method = modalSuratIzin.id ? 'PUT' : 'POST';
      
      const response = await fetch('https://teralab.my.id/backend/api/surat_izin/surat_izin.php', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modalSuratIzin)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(modalSuratIzin.id ? 'Surat izin berhasil diperbarui' : 'Surat izin berhasil ditambahkan');
        setShowModal(false);
        fetchSuratIzin();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Gagal menyimpan surat izin');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan saat menyimpan surat izin');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const headers = 'Nama Santri\tKelas\tTanggal Keluar\tTanggal Kembali\tKeperluan\tAlamat Tujuan\tStatus';
    const textToCopy = [headers, ...suratIzin.map(s => 
      `${s.nama_santri}\t${s.nama_kelas || '-'}\t${s.tanggal_keluar}\t${s.tanggal_kembali}\t${s.keperluan}\t${s.alamat_tujuan}\t${s.status || 'Belum Kembali'}`
    )].join('\n');
    navigator.clipboard.writeText(textToCopy);
    setSuccess('Data berhasil disalin ke clipboard');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExportExcel = () => {
    const exportData = suratIzin.map(s => ({
      'Nama Santri': s.nama_santri,
      'NIS': s.nis,
      'Kelas': s.nama_kelas || '-',
      'Tanggal Keluar': s.tanggal_keluar,
      'Jam Keluar': s.jam_keluar,
      'Tanggal Kembali': s.tanggal_kembali,
      'Jam Kembali': s.jam_kembali,
      'Keperluan': s.keperluan,
      'Alamat Tujuan': s.alamat_tujuan,
      'Nama Penjemput': s.nama_penjemput || '-',
      'No HP Penjemput': s.no_hp_penjemput || '-',
      'Status': s.status || 'Belum Kembali'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SuratIzinKeluar');
    XLSX.writeFile(workbook, 'surat_izin_keluar.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    doc.autoTable({
      head: [['Nama Santri', 'Kelas', 'Tanggal Keluar', 'Tanggal Kembali', 'Keperluan', 'Status']],
      body: suratIzin.map(s => [
        s.nama_santri, 
        s.nama_kelas || '-', 
        s.tanggal_keluar, 
        s.tanggal_kembali, 
        s.keperluan,
        s.status || 'Belum Kembali'
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
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
    (s.nama_santri && s.nama_santri.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.nomor_surat && s.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.jenis_izin && s.jenis_izin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredSuratIzin.length / itemsPerPage);
  const displayedSuratIzin = filteredSuratIzin.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Belum Kembali': { variant: 'warning', text: 'Belum Kembali' },
      'Sudah di Pesantren': { variant: 'success', text: 'Sudah di Pesantren' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getSantriName = (santri_id) => {
    const santri = santriList.find(s => s.id == santri_id);
    return santri ? santri.nama : 'Tidak ditemukan';
  };

  return (
    <div>
      <h2>Kelola Surat Izin Keluar</h2>
      
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      
      <Button variant="primary" onClick={handleAddSuratIzin} className="mb-3" disabled={loading}>
        <FaPlus className="me-2" />Tambahkan Surat Izin Baru
      </Button>
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
      {loading && (
        <div className="text-center mb-3">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Memuat data...</span>
        </div>
      )}
      
      <Table striped bordered hover id="printableTable">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Santri</th>
            <th>Kelas</th>
            <th>Tanggal Keluar</th>
            <th>Tanggal Kembali</th>
            <th>Keperluan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedSuratIzin.length > 0 ? (
            displayedSuratIzin.map((s, index) => (
              <tr key={s.id}>
                <td>{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                <td>{s.nama_santri}</td>
                <td>{s.nama_kelas || '-'}</td>
                <td>
                  {s.tanggal_keluar ? new Date(s.tanggal_keluar).toLocaleDateString('id-ID') : '-'}
                  <br />
                  <small className="text-muted">{s.jam_keluar || ''}</small>
                </td>
                <td>
                  {s.tanggal_kembali ? new Date(s.tanggal_kembali).toLocaleDateString('id-ID') : '-'}
                  <br />
                  <small className="text-muted">{s.jam_kembali || ''}</small>
                </td>
                <td>
                  <span title={s.keperluan}>
                    {s.keperluan ? s.keperluan.substring(0, 50) + (s.keperluan.length > 50 ? '...' : '') : '-'}
                  </span>
                </td>
                <td>
                  {getStatusBadge(s.status || 'Belum Kembali')}
                </td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditSuratIzin(s.id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteSuratIzin(s.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                {loading ? 'Memuat data...' : 'Tidak ada data surat izin'}
              </td>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalSuratIzin.id ? 'Edit Surat Izin' : 'Tambah Surat Izin Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-12">
                <Form.Group className="mb-3">
                  <Form.Label>Nama Santri <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    value={modalSuratIzin.santri_id} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, santri_id: e.target.value })}
                    required
                  >
                    <option value="">Pilih Santri</option>
                    {santriList.map(santri => (
                      <option key={santri.id} value={santri.id}>
                        {santri.nama} - {santri.nis} ({santri.nama_kelas || 'Belum ada kelas'})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Keluar <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="date" 
                    value={modalSuratIzin.tanggal_keluar} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, tanggal_keluar: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Jam Keluar <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="time" 
                    value={modalSuratIzin.jam_keluar} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, jam_keluar: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Kembali <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="date" 
                    value={modalSuratIzin.tanggal_kembali} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, tanggal_kembali: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Jam Kembali <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="time" 
                    value={modalSuratIzin.jam_kembali} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, jam_kembali: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Keperluan <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                placeholder="Keperluan izin keluar..." 
                value={modalSuratIzin.keperluan} 
                onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, keperluan: e.target.value })}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Alamat Tujuan <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                as="textarea"
                rows={2}
                placeholder="Alamat lengkap tujuan..." 
                value={modalSuratIzin.alamat_tujuan} 
                onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, alamat_tujuan: e.target.value })}
                required
              />
            </Form.Group>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nama Penjemput</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nama penjemput (opsional)" 
                    value={modalSuratIzin.nama_penjemput} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, nama_penjemput: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>No. HP Penjemput</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="No. HP penjemput (opsional)" 
                    value={modalSuratIzin.no_hp_penjemput} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, no_hp_penjemput: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Status <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                value={modalSuratIzin.status} 
                onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, status: e.target.value })}
                required
              >
                <option value="Belum Kembali">Belum Kembali</option>
                <option value="Sudah di Pesantren">Sudah di Pesantren</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSaveSuratIzin} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuratIzinKeluar;
