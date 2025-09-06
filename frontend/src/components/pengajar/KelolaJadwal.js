import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';

const KelolaJadwal = () => {
  const [jadwal, setJadwal] = useState([]);
  const [filteredJadwal, setFilteredJadwal] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [mapel, setMapel] = useState([]);
  const [ustadz, setUstadz] = useState([]);
  const [kelas, setKelas] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Search & Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('hari');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [formData, setFormData] = useState({
    mapel_id: '',
    ustadz_id: '',
    kelas_id: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    ruangan: ''
  });

  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  useEffect(() => {
    fetchJadwal();
    fetchMapel();
    fetchUstadz();
    fetchKelas();
  }, []);

  // Filter and sort data when jadwal, searchTerm, sortBy, or sortOrder changes
  useEffect(() => {
    let filtered = [...jadwal];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.nama_ustadz?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_mapel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kode_mapel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_kelas?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'hari':
          const hariOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
          aValue = hariOrder.indexOf(a.hari);
          bValue = hariOrder.indexOf(b.hari);
          break;
        case 'jam':
          aValue = a.jam_mulai;
          bValue = b.jam_mulai;
          break;
        case 'mapel':
          aValue = a.nama_mapel?.toLowerCase() || '';
          bValue = b.nama_mapel?.toLowerCase() || '';
          break;
        case 'ustadz':
          aValue = a.nama_ustadz?.toLowerCase() || '';
          bValue = b.nama_ustadz?.toLowerCase() || '';
          break;
        case 'kelas':
          aValue = a.nama_kelas?.toLowerCase() || '';
          bValue = b.nama_kelas?.toLowerCase() || '';
          break;
        case 'ruangan':
          aValue = a.ruangan?.toLowerCase() || '';
          bValue = b.ruangan?.toLowerCase() || '';
          break;
        default:
          aValue = a.hari;
          bValue = b.hari;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredJadwal(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [jadwal, searchTerm, sortBy, sortOrder]);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://teralab.my.id/backend/api/jadwal/jadwal.php');
      const data = await response.json();
      console.log('Jadwal data:', data); // Debug log
      setJadwal(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching jadwal:', error);
      showAlert('Gagal memuat data jadwal', 'danger');
      setJadwal([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredJadwal.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJadwal = filteredJadwal.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <i className="fas fa-sort text-muted"></i>;
    return sortOrder === 'asc' ? 
      <i className="fas fa-sort-up text-primary"></i> : 
      <i className="fas fa-sort-down text-primary"></i>;
  };

  const fetchMapel = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/mapel/mapel.php');
      const data = await response.json();
      console.log('Mapel data:', data); // Debug log
      setMapel(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching mapel:', error);
      setMapel([]);
    }
  };

  const fetchUstadz = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/ustadz/getUstadz.php');
      const result = await response.json();
      console.log('Ustadz data:', result); // Debug log
      if (result.success) {
        setUstadz(result.data || []);
      } else {
        // Fallback jika response tidak memiliki success flag
        setUstadz(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error('Error fetching ustadz:', error);
      setUstadz([]);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingJadwal(null);
    setFormData({
      mapel_id: '',
      ustadz_id: '',
      kelas_id: '',
      hari: '',
      jam_mulai: '',
      jam_selesai: '',
      ruangan: ''
    });
  };

  const handleShowModal = (jadwalItem = null) => {
    if (jadwalItem) {
      setEditingJadwal(jadwalItem);
      setFormData({
        mapel_id: jadwalItem.mapel_id || '',
        ustadz_id: jadwalItem.ustadz_id || '',
        kelas_id: jadwalItem.kelas_id || '',
        hari: jadwalItem.hari || '',
        jam_mulai: jadwalItem.jam_mulai || '',
        jam_selesai: jadwalItem.jam_selesai || '',
        ruangan: jadwalItem.ruangan || ''
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchKelas = async () => {
    try {
      console.log('Fetching kelas data...');
      const response = await fetch('https://teralab.my.id/backend/api/kelas/getAllClass.php');
      const data = await response.json();
      console.log('Kelas API Response:', data); // Debug log
      
      if (data.success && data.data) {
        setKelas(data.data);
        console.log('Kelas data loaded:', data.data.length, 'records');
      } else {
        console.error('API returned error:', data.message || 'Unknown error');
        setKelas([]);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
      setKelas([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi jam
    if (formData.jam_mulai >= formData.jam_selesai) {
      showAlert('Jam mulai harus lebih kecil dari jam selesai', 'danger');
      return;
    }
    
    try {
      const url = 'https://teralab.my.id/backend/api/jadwal/jadwal.php';
      const method = editingJadwal ? 'PUT' : 'POST';
      const payload = editingJadwal ? { ...formData, id: editingJadwal.id } : formData;

      console.log('Sending payload:', payload); // Debug log

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Response:', result); // Debug log

      if (result.success) {
        showAlert(result.message);
        handleCloseModal();
        fetchJadwal();
      } else {
        showAlert(result.error || 'Terjadi kesalahan', 'danger');
      }
    } catch (error) {
      console.error('Error saving jadwal:', error);
      showAlert('Gagal menyimpan data jadwal', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      try {
        const response = await fetch(`https://teralab.my.id/backend/api/jadwal/jadwal.php?id=${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          showAlert(result.message);
          fetchJadwal();
        } else {
          showAlert(result.error || 'Gagal menghapus jadwal', 'danger');
        }
      } catch (error) {
        console.error('Error deleting jadwal:', error);
        showAlert('Gagal menghapus jadwal', 'danger');
      }
    }
  };

  const getHariBadge = (hari) => {
    const variants = {
      'Senin': 'primary',
      'Selasa': 'success', 
      'Rabu': 'info',
      'Kamis': 'warning',
      'Jumat': 'danger',
      'Sabtu': 'secondary',
      'Minggu': 'dark'
    };
    return <Badge bg={variants[hari] || 'secondary'}>{hari}</Badge>;
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Kelola Jadwal Pelajaran</h5>
              <Button variant="light" size="sm" onClick={() => handleShowModal()}>
                <i className="fas fa-plus me-2"></i>Tambah Jadwal
              </Button>
            </Card.Header>
            <Card.Body>
              {alert.show && (
                <Alert variant={alert.variant} className="mb-3">
                  {alert.message}
                </Alert>
              )}

              {/* Search and Filter Controls */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Cari Pengajar/Mata Pelajaran/Kelas</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ketik nama pengajar, mata pelajaran, atau kelas..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Tampilkan per halaman</Form.Label>
                    <Form.Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                      <option value={5}>5 data</option>
                      <option value={10}>10 data</option>
                      <option value={20}>20 data</option>
                      <option value={50}>50 data</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Urutkan berdasarkan</Form.Label>
                    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="hari">Hari</option>
                      <option value="jam">Jam</option>
                      <option value="mapel">Mata Pelajaran</option>
                      <option value="ustadz">Pengajar</option>
                      <option value="kelas">Kelas</option>
                      <option value="ruangan">Ruangan</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Urutan</Form.Label>
                    <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                      <option value="asc">A-Z / 1-9</option>
                      <option value="desc">Z-A / 9-1</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Results Info */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className="text-muted">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredJadwal.length)} dari {filteredJadwal.length} jadwal
                  {searchTerm && ` (hasil pencarian: "${searchTerm}")`}
                </small>
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times me-1"></i>Clear Search
                  </Button>
                )}
              </div>

              <Table responsive striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>No</th>
                    <th 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleSort('hari')}
                    >
                      Hari {getSortIcon('hari')}
                    </th>
                    <th 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleSort('jam')}
                    >
                      Jam {getSortIcon('jam')}
                    </th>
                    <th 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleSort('mapel')}
                    >
                      Mata Pelajaran {getSortIcon('mapel')}
                    </th>
                    <th 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleSort('ustadz')}
                    >
                      Pengajar {getSortIcon('ustadz')}
                    </th>
                    <th 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleSort('kelas')}
                    >
                      Kelas {getSortIcon('kelas')}
                    </th>
                    <th 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleSort('ruangan')}
                    >
                      Ruangan {getSortIcon('ruangan')}
                    </th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentJadwal.length > 0 ? (
                    currentJadwal.map((item, index) => (
                      <tr key={item.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{getHariBadge(item.hari)}</td>
                        <td>
                          <strong>{item.jam_mulai} - {item.jam_selesai}</strong>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {item.nama_mapel} ({item.kode_mapel})
                          </span>
                        </td>
                        <td>{item.nama_ustadz}</td>
                        <td>
                          <span className="badge bg-success">
                            {item.nama_kelas || '-'}
                          </span>
                        </td>
                        <td>{item.ruangan || '-'}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleShowModal(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        {searchTerm ? 
                          `Tidak ada jadwal yang cocok dengan pencarian "${searchTerm}"` : 
                          'Tidak ada data jadwal'
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <span className="text-muted">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                  </div>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-angle-double-left"></i>
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-angle-left"></i> Prev
                    </Button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "primary" : "outline-primary"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next <i className="fas fa-angle-right"></i>
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="fas fa-angle-double-right"></i>
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Form */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingJadwal ? 'Edit Jadwal' : 'Tambah Jadwal Pelajaran'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mata Pelajaran <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="mapel_id"
                    value={formData.mapel_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Mata Pelajaran</option>
                    {mapel.map(mapelItem => (
                      <option key={mapelItem.id} value={mapelItem.id}>
                        {mapelItem.nama_mapel} ({mapelItem.kode_mapel})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pengajar <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="ustadz_id"
                    value={formData.ustadz_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Pengajar</option>
                    {ustadz.map(ustadzItem => (
                      <option key={ustadzItem.id} value={ustadzItem.id}>
                        {ustadzItem.nama} - {ustadzItem.mata_pelajaran || 'Umum'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kelas <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="kelas_id"
                    value={formData.kelas_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Kelas</option>
                    {kelas.length > 0 ? (
                      kelas.map(kelasItem => (
                        <option key={kelasItem.id} value={kelasItem.id}>
                          {kelasItem.nama_kelas} ({kelasItem.kode_kelas}) - Kapasitas: {kelasItem.kapasitas}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading kelas...</option>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hari <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="hari"
                    value={formData.hari}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Hari</option>
                    {hariList.map(hari => (
                      <option key={hari} value={hari}>{hari}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ruangan</Form.Label>
                  <Form.Control
                    type="text"
                    name="ruangan"
                    value={formData.ruangan}
                    onChange={handleInputChange}
                    placeholder="Contoh: R101"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jam Mulai <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="time"
                    name="jam_mulai"
                    value={formData.jam_mulai}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jam Selesai <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="time"
                    name="jam_selesai"
                    value={formData.jam_selesai}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              {editingJadwal ? 'Update' : 'Simpan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default KelolaJadwal;
