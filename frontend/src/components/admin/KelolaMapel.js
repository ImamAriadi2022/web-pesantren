import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';

const KelolaMapel = () => {
  const [mapel, setMapel] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMapel, setEditingMapel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [formData, setFormData] = useState({
    kode_mapel: '',
    nama_mapel: '',
    keterangan: '',
    status: 'Aktif'
  });

  useEffect(() => {
    fetchMapel();
  }, []);

  const fetchMapel = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/web-pesantren/backend/api/mapel/mapel.php');
      const data = await response.json();
      setMapel(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching mapel:', error);
      showAlert('Gagal memuat data mata pelajaran', 'danger');
      setMapel([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMapel(null);
    setFormData({
      kode_mapel: '',
      nama_mapel: '',
      keterangan: '',
      sks: 1,
      kkm: 75,
      kategori: 'Umum',
      status: 'Aktif'
    });
  };

  const handleShowModal = (mapelItem = null) => {
    if (mapelItem) {
      setEditingMapel(mapelItem);
      setFormData({
        kode_mapel: mapelItem.kode_mapel || '',
        nama_mapel: mapelItem.nama_mapel || '',
        deskripsi: mapelItem.deskripsi || '',
        sks: mapelItem.sks || 1,
        kkm: mapelItem.kkm || 75,
        kategori: mapelItem.kategori || 'Umum',
        status: mapelItem.status || 'Aktif'
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
      const url = 'http://localhost/web-pesantren/backend/api/mapel/mapel.php';
      const method = editingMapel ? 'PUT' : 'POST';
      const payload = editingMapel ? { ...formData, id: editingMapel.id } : formData;

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
        fetchMapel();
      } else {
        showAlert(result.error || 'Terjadi kesalahan', 'danger');
      }
    } catch (error) {
      console.error('Error saving mapel:', error);
      showAlert('Gagal menyimpan data mata pelajaran', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) {
      try {
        const response = await fetch(`http://localhost/web-pesantren/backend/api/mapel/mapel.php?id=${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          showAlert(result.message);
          fetchMapel();
        } else {
          showAlert(result.error || 'Gagal menghapus mata pelajaran', 'danger');
        }
      } catch (error) {
        console.error('Error deleting mapel:', error);
        showAlert('Gagal menghapus mata pelajaran', 'danger');
      }
    }
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
              <h5 className="mb-0">Kelola Mata Pelajaran</h5>
              <Button variant="light" size="sm" onClick={() => handleShowModal()}>
                <i className="fas fa-plus me-2"></i>Tambah Mata Pelajaran
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
                    <th>Kode</th>
                    <th>Nama Mata Pelajaran</th>
                    <th>Keterangan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mapel.length > 0 ? (
                    mapel.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td><span className="badge bg-secondary">{item.kode_mapel}</span></td>
                        <td>{item.nama_mapel}</td>
                        <td>{item.keterangan || item.deskripsi || '-'}</td>
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
                      <td colSpan="8" className="text-center">Tidak ada data mata pelajaran</td>
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
            {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kode Mata Pelajaran <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="kode_mapel"
                    value={formData.kode_mapel}
                    onChange={handleInputChange}
                    required
                    placeholder="Contoh: MTK001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Mata Pelajaran <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="nama_mapel"
                    value={formData.nama_mapel}
                    onChange={handleInputChange}
                    required
                    placeholder="Contoh: Matematika"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Keterangan</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    placeholder="Keterangan mata pelajaran (opsional)"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
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
              {editingMapel ? 'Update' : 'Simpan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default KelolaMapel;
