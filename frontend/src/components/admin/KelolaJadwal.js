import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';

const KelolaJadwal = () => {
  const [jadwal, setJadwal] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [kelas, setKelas] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [ustadz, setUstadz] = useState([]);
  
  const [formData, setFormData] = useState({
    kelas_id: '',
    mapel_id: '',
    ustadz_id: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    ruangan: '',
    tahun_ajaran: '2024/2025',
    semester: 'Ganjil',
    status: 'Aktif'
  });

  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  useEffect(() => {
    fetchJadwal();
    fetchKelas();
    fetchMapel();
    fetchUstadz();
  }, []);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/web-pesantren/backend/api/jadwal/jadwal.php');
      const data = await response.json();
      setJadwal(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching jadwal:', error);
      showAlert('Gagal memuat data jadwal', 'danger');
      setJadwal([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchKelas = async () => {
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/kelas/getAllClass.php');
      const result = await response.json();
      if (result.success) {
        setKelas(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
      setKelas([]);
    }
  };

  const fetchMapel = async () => {
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/mapel/mapel.php');
      const data = await response.json();
      setMapel(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching mapel:', error);
      setMapel([]);
    }
  };

  const fetchUstadz = async () => {
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/ustadz/getUstadz.php');
      const result = await response.json();
      if (result.success) {
        setUstadz(result.data || []);
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
      kelas_id: '',
      mapel_id: '',
      ustadz_id: '',
      hari: '',
      jam_mulai: '',
      jam_selesai: '',
      ruangan: '',
      tahun_ajaran: '2024/2025',
      semester: 'Ganjil',
      status: 'Aktif'
    });
  };

  const handleShowModal = (jadwalItem = null) => {
    if (jadwalItem) {
      setEditingJadwal(jadwalItem);
      setFormData({
        kelas_id: jadwalItem.kelas_id || '',
        mapel_id: jadwalItem.mapel_id || '',
        ustadz_id: jadwalItem.ustadz_id || '',
        hari: jadwalItem.hari || '',
        jam_mulai: jadwalItem.jam_mulai || '',
        jam_selesai: jadwalItem.jam_selesai || '',
        ruangan: jadwalItem.ruangan || '',
        tahun_ajaran: jadwalItem.tahun_ajaran || '2024/2025',
        semester: jadwalItem.semester || 'Ganjil',
        status: jadwalItem.status || 'Aktif'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = 'http://localhost/web-pesantren/backend/api/jadwal/jadwal.php';
      const method = editingJadwal ? 'PUT' : 'POST';
      const payload = editingJadwal ? { ...formData, id: editingJadwal.id } : formData;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

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
        const response = await fetch(`http://localhost/web-pesantren/backend/api/jadwal/jadwal.php?id=${id}`, {
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

              <Table responsive striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>No</th>
                    <th>Hari</th>
                    <th>Jam</th>
                    <th>Kelas</th>
                    <th>Mata Pelajaran</th>
                    <th>Pengajar</th>
                    <th>Ruangan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwal.length > 0 ? (
                    jadwal.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{getHariBadge(item.hari)}</td>
                        <td>
                          <strong>{item.jam_mulai} - {item.jam_selesai}</strong>
                        </td>
                        <td>
                          <span className="badge bg-info">{item.nama_kelas}</span>
                        </td>
                        <td>{item.nama_mapel}</td>
                        <td>{item.nama_ustadz}</td>
                        <td>{item.ruangan || '-'}</td>
                        <td>
                          <span className={`badge ${item.status === 'Aktif' ? 'bg-success' : 'bg-danger'}`}>
                            {item.status}
                          </span>
                        </td>
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
                      <td colSpan="9" className="text-center">Tidak ada data jadwal</td>
                    </tr>
                  )}
                </tbody>
              </Table>
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
                  <Form.Label>Kelas <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="kelas_id"
                    value={formData.kelas_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Kelas</option>
                    {kelas.map(kelasItem => (
                      <option key={kelasItem.id} value={kelasItem.id}>
                        {kelasItem.nama_kelas} ({kelasItem.kode_kelas})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
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
            </Row>

            <Row>
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
                        {ustadzItem.nama} - {ustadzItem.bidang_keahlian}
                      </option>
                    ))}
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
              <Col md={4}>
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
              <Col md={4}>
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
              <Col md={4}>
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tahun Ajaran</Form.Label>
                  <Form.Control
                    type="text"
                    name="tahun_ajaran"
                    value={formData.tahun_ajaran}
                    onChange={handleInputChange}
                    placeholder="2024/2025"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </Form.Select>
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
