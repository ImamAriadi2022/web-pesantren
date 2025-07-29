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
    nomor_surat: '', 
    santri_id: '', 
    jenis_izin: '', 
    alasan: '', 
    tanggal_keluar: '', 
    tanggal_kembali: '', 
    alamat_tujuan: '',
    nomor_hp_wali: '',
    status: 'Diajukan'
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
      const response = await fetch('/backend/api/surat_izin/surat_izin.php');
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
      const response = await fetch('/backend/api/santri/getSantri.php');
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
      const response = await fetch('/backend/api/kelas/getAllClass.php');
      const data = await response.json();
      
      if (data.data) {
        setKelasList(data.data);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
    }
  };

  const handleAddSuratIzin = () => {
    setModalSuratIzin({ 
      id: null, 
      nomor_surat: '', 
      santri_id: '', 
      jenis_izin: '', 
      alasan: '', 
      tanggal_keluar: '', 
      tanggal_kembali: '', 
      alamat_tujuan: '',
      nomor_hp_wali: '',
      status: 'Diajukan'
    });
    setShowModal(true);
  };

  const handleEditSuratIzin = (id) => {
    const suratIzinData = suratIzin.find(s => s.id === id);
    setModalSuratIzin({
      ...suratIzinData,
      santri_id: suratIzinData.santri_id || '',
      tanggal_keluar: suratIzinData.tanggal_keluar ? suratIzinData.tanggal_keluar.split(' ')[0] : '',
      tanggal_kembali: suratIzinData.tanggal_masuk ? suratIzinData.tanggal_masuk.split(' ')[0] : ''
    });
    setShowModal(true);
  };

  const handleDeleteSuratIzin = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus surat izin ini?')) {
      try {
        const response = await fetch('/backend/api/surat_izin/surat_izin.php', {
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
    try {
      setLoading(true);
      const method = modalSuratIzin.id ? 'PUT' : 'POST';
      
      // Map frontend fields to backend expectations
      const requestData = {
        ...modalSuratIzin,
        tanggal_masuk: modalSuratIzin.tanggal_kembali, // Map tanggal_kembali to tanggal_masuk
        tujuan: modalSuratIzin.alamat_tujuan, // Map alamat_tujuan to tujuan
        keperluan: modalSuratIzin.alasan, // Map alasan to keperluan
        telepon_penanggung_jawab: modalSuratIzin.nomor_hp_wali // Map nomor_hp_wali to telepon_penanggung_jawab
      };
      
      const response = await fetch('/backend/api/surat_izin/surat_izin.php', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
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
    const headers = 'Nomor Surat\tNama Santri\tKelas\tJenis Izin\tTanggal Keluar\tTanggal Kembali\tStatus';
    const textToCopy = [headers, ...suratIzin.map(s => 
      `${s.nomor_surat}\t${s.nama_santri}\t${s.nama_kelas}\t${s.jenis_izin}\t${s.tanggal_keluar}\t${s.tanggal_masuk}\t${s.status}`
    )].join('\n');
    navigator.clipboard.writeText(textToCopy);
    setSuccess('Data berhasil disalin ke clipboard');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExportExcel = () => {
    const exportData = suratIzin.map(s => ({
      'Nomor Surat': s.nomor_surat,
      'Nama Santri': s.nama_santri,
      'Kelas': s.nama_kelas,
      'Jenis Izin': s.jenis_izin,
              'Alasan': s.keperluan,
      'Tanggal Keluar': s.tanggal_keluar,
      'Tanggal Kembali': s.tanggal_masuk,
              'Alamat Tujuan': s.tujuan,
        'Nomor HP Wali': s.telepon_penanggung_jawab,
      'Status': s.status
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SuratIzinKeluar');
    XLSX.writeFile(workbook, 'surat_izin_keluar.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    doc.autoTable({
      head: [['Nomor Surat', 'Nama Santri', 'Kelas', 'Jenis Izin', 'Tanggal Keluar', 'Tanggal Kembali', 'Status']],
      body: suratIzin.map(s => [
        s.nomor_surat, 
        s.nama_santri, 
        s.nama_kelas, 
        s.jenis_izin, 
        s.tanggal_keluar, 
        s.tanggal_masuk, 
        s.status
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
      'Diajukan': { variant: 'warning', text: 'Diajukan' },
      'Disetujui': { variant: 'success', text: 'Disetujui' },
      'Ditolak': { variant: 'danger', text: 'Ditolak' },
      'Selesai': { variant: 'info', text: 'Selesai' }
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
            <th>Nomor Surat</th>
            <th>Nama Santri</th>
            <th>Kelas</th>
            <th>Jenis Izin</th>
            <th>Tanggal Keluar</th>
            <th>Tanggal Kembali</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedSuratIzin.length > 0 ? (
            displayedSuratIzin.map(s => (
              <tr key={s.id}>
                <td>{s.nomor_surat}</td>
                <td>{s.nama_santri}</td>
                <td>{s.nama_kelas}</td>
                <td>{s.jenis_izin}</td>
                <td>{s.tanggal_keluar ? new Date(s.tanggal_keluar).toLocaleDateString('id-ID') : '-'}</td>
                <td>{s.tanggal_masuk ? new Date(s.tanggal_masuk).toLocaleDateString('id-ID') : '-'}</td>
                <td>{getStatusBadge(s.status)}</td>
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
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nomor Surat</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nomor Surat" 
                    value={modalSuratIzin.nomor_surat} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, nomor_surat: e.target.value })} 
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nama Santri</Form.Label>
                  <Form.Select 
                    value={modalSuratIzin.santri_id} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, santri_id: e.target.value })}
                  >
                    <option value="">Pilih Santri</option>
                    {santriList.map(santri => (
                      <option key={santri.id} value={santri.id}>
                        {santri.nama} - {santri.nomor_identitas}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Jenis Izin</Form.Label>
                  <Form.Select 
                    value={modalSuratIzin.jenis_izin} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, jenis_izin: e.target.value })}
                  >
                    <option value="">Pilih Jenis Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Keperluan Keluarga">Keperluan Keluarga</option>
                    <option value="Urusan Penting">Urusan Penting</option>
                    <option value="Lainnya">Lainnya</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={modalSuratIzin.status} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, status: e.target.value })}
                  >
                    <option value="Diajukan">Diajukan</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                    <option value="Selesai">Selesai</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Alasan</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Alasan izin keluar" 
                value={modalSuratIzin.alasan} 
                onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, alasan: e.target.value })} 
              />
            </Form.Group>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Keluar</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={modalSuratIzin.tanggal_keluar} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, tanggal_keluar: e.target.value })} 
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Kembali</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={modalSuratIzin.tanggal_kembali} 
                    onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, tanggal_kembali: e.target.value })} 
                  />
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Alamat Tujuan</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                placeholder="Alamat tujuan" 
                value={modalSuratIzin.alamat_tujuan} 
                onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, alamat_tujuan: e.target.value })} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Nomor HP Wali</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nomor HP Wali/Keluarga" 
                value={modalSuratIzin.nomor_hp_wali} 
                onChange={(e) => setModalSuratIzin({ ...modalSuratIzin, nomor_hp_wali: e.target.value })} 
              />
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