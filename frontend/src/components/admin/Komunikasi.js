import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';

const Komunikasi = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [activeTab, setActiveTab] = useState('inbox');
  const [users, setUsers] = useState([]);
  const [kelas, setKelas] = useState([]);
  
  const [formData, setFormData] = useState({
    penerima_id: '',
    judul: '',
    pesan: '',
    tipe: 'Pribadi',
    kelas_id: ''
  });

  // Simulated current user (in real app, get from auth context)
  const currentUser = { id: 1, role: 'pengajar', nama: 'Ahmad Ustadz' };

  useEffect(() => {
    fetchMessages();
    fetchUsers();
    fetchKelas();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`https://teralab.my.id/backend/api/komunikasi/komunikasi.php?user_id=${currentUser.id}`);
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/users/getUsers.php');
      const result = await response.json();
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchKelas = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/kelas/getAllClass.php');
      const result = await response.json();
      if (result.success) {
        setKelas(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
      setKelas([]);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      penerima_id: '',
      judul: '',
      pesan: '',
      tipe: 'Pribadi',
      kelas_id: ''
    });
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
      const payload = {
        ...formData,
        pengirim_id: currentUser.id
      };

      const response = await fetch('https://teralab.my.id/backend/api/komunikasi/komunikasi.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        showAlert(result.message);
        handleCloseModal();
        fetchMessages();
      } else {
        showAlert(result.error || 'Gagal mengirim pesan', 'danger');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showAlert('Gagal mengirim pesan', 'danger');
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/komunikasi/komunikasi.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: messageId,
          status: 'Dibaca'
        }),
      });

      const result = await response.json();
      if (result.success) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getFilteredMessages = () => {
    switch (activeTab) {
      case 'inbox':
        return messages.filter(msg => msg.penerima_id === currentUser.id);
      case 'sent':
        return messages.filter(msg => msg.pengirim_id === currentUser.id);
      case 'class':
        return messages.filter(msg => msg.tipe === 'Kelas');
      default:
        return messages;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Terkirim': 'primary',
      'Dibaca': 'success',
      'Dibalas': 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Komunikasi</h5>
              <Button variant="light" size="sm" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus me-2"></i>Pesan Baru
              </Button>
            </Card.Header>
            <Card.Body>
              {alert.show && (
                <Alert variant={alert.variant} className="mb-3">
                  {alert.message}
                </Alert>
              )}

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="inbox" title={
                  <span>
                    <i className="fas fa-inbox me-2"></i>Kotak Masuk
                  </span>
                }>
                  <div className="message-list">
                    {getFilteredMessages().map((message) => (
                      <Card key={message.id} className="mb-2">
                        <Card.Body className="py-2">
                          <Row className="align-items-center">
                            <Col md={3}>
                              <strong>{message.nama_pengirim}</strong>
                              <br />
                              <small className="text-muted">{message.role_pengirim}</small>
                            </Col>
                            <Col md={4}>
                              <div className="fw-bold">{message.judul}</div>
                              <div className="text-truncate text-muted" style={{maxWidth: '200px'}}>
                                {message.pesan}
                              </div>
                            </Col>
                            <Col md={2}>
                              {getStatusBadge(message.status)}
                            </Col>
                            <Col md={2}>
                              <small className="text-muted">
                                {new Date(message.created_at).toLocaleDateString('id-ID')}
                              </small>
                            </Col>
                            <Col md={1}>
                              {message.status === 'Terkirim' && message.penerima_id === currentUser.id && (
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => markAsRead(message.id)}
                                >
                                  <i className="fas fa-check"></i>
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                    {getFilteredMessages().length === 0 && (
                      <div className="text-center text-muted py-4">
                        <i className="fas fa-inbox fa-3x mb-3"></i>
                        <p>Tidak ada pesan</p>
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab eventKey="sent" title={
                  <span>
                    <i className="fas fa-paper-plane me-2"></i>Terkirim
                  </span>
                }>
                  <div className="message-list">
                    {getFilteredMessages().map((message) => (
                      <Card key={message.id} className="mb-2">
                        <Card.Body className="py-2">
                          <Row className="align-items-center">
                            <Col md={3}>
                              <strong>Kepada: {message.nama_penerima || 'Kelas'}</strong>
                              <br />
                              {message.nama_kelas && (
                                <small className="text-muted">Kelas: {message.nama_kelas}</small>
                              )}
                            </Col>
                            <Col md={4}>
                              <div className="fw-bold">{message.judul}</div>
                              <div className="text-truncate text-muted" style={{maxWidth: '200px'}}>
                                {message.pesan}
                              </div>
                            </Col>
                            <Col md={2}>
                              {getStatusBadge(message.status)}
                            </Col>
                            <Col md={3}>
                              <small className="text-muted">
                                {new Date(message.created_at).toLocaleDateString('id-ID')}
                              </small>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey="class" title={
                  <span>
                    <i className="fas fa-users me-2"></i>Pesan Kelas
                  </span>
                }>
                  <div className="message-list">
                    {getFilteredMessages().map((message) => (
                      <Card key={message.id} className="mb-2">
                        <Card.Body className="py-2">
                          <Row className="align-items-center">
                            <Col md={3}>
                              <strong>{message.nama_pengirim}</strong>
                              <br />
                              <small className="text-muted">Kelas: {message.nama_kelas}</small>
                            </Col>
                            <Col md={6}>
                              <div className="fw-bold">{message.judul}</div>
                              <div className="text-truncate text-muted" style={{maxWidth: '300px'}}>
                                {message.pesan}
                              </div>
                            </Col>
                            <Col md={3}>
                              <small className="text-muted">
                                {new Date(message.created_at).toLocaleDateString('id-ID')}
                              </small>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Form */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Pesan Baru</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipe Pesan</Form.Label>
                  <Form.Select
                    name="tipe"
                    value={formData.tipe}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Pribadi">Pesan Pribadi</option>
                    <option value="Kelas">Pesan Kelas</option>
                    <option value="Umum">Pengumuman Umum</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                {formData.tipe === 'Pribadi' ? (
                  <Form.Group className="mb-3">
                    <Form.Label>Penerima</Form.Label>
                    <Form.Select
                      name="penerima_id"
                      value={formData.penerima_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih Penerima</option>
                      {users.filter(user => user.id !== currentUser.id).map(user => (
                        <option key={user.id} value={user.id}>
                          {user.nama} ({user.role})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                ) : formData.tipe === 'Kelas' ? (
                  <Form.Group className="mb-3">
                    <Form.Label>Kelas</Form.Label>
                    <Form.Select
                      name="kelas_id"
                      value={formData.kelas_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih Kelas</option>
                      {kelas.map(kelasItem => (
                        <option key={kelasItem.id} value={kelasItem.id}>
                          {kelasItem.nama_kelas}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                ) : null}
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Judul <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                required
                placeholder="Masukkan judul pesan"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pesan <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="pesan"
                value={formData.pesan}
                onChange={handleInputChange}
                required
                placeholder="Tulis pesan Anda di sini..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              <i className="fas fa-paper-plane me-2"></i>Kirim
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Komunikasi;
