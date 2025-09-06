import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useAuth } from '../../utils/auth';

const NotifikasiNilai = () => {
  const { santriId, currentUser } = useAuth();
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchNotifikasi();
  }, []);

  const fetchNotifikasi = async () => {
    if (!santriId) {
      console.error('Santri ID tidak ditemukan');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://teralab.my.id/backend/api/notifikasi/notifikasi_nilai.php?santri_id=${santriId}`);
      const data = await response.json();
      setNotifikasi(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifikasi:', error);
      setNotifikasi([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const markAsRead = async (notifikasiId) => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/notifikasi/notifikasi_nilai.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: notifikasiId,
          status: 'Sudah Dibaca'
        }),
      });

      const result = await response.json();
      if (result.success) {
        fetchNotifikasi();
        showAlert('Notifikasi ditandai sudah dibaca');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      showAlert('Gagal menandai notifikasi', 'danger');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifikasi.filter(n => n.status === 'Belum Dibaca');
      
      for (const notif of unreadNotifications) {
        await fetch('https://teralab.my.id/backend/api/notifikasi/notifikasi_nilai.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: notif.id,
            status: 'Sudah Dibaca'
          }),
        });
      }
      
      fetchNotifikasi();
      showAlert('Semua notifikasi ditandai sudah dibaca');
    } catch (error) {
      console.error('Error marking all as read:', error);
      showAlert('Gagal menandai semua notifikasi', 'danger');
    }
  };

  const getStatusBadge = (status) => {
    return status === 'Belum Dibaca' ? 
      <Badge bg="danger">Belum Dibaca</Badge> : 
      <Badge bg="success">Sudah Dibaca</Badge>;
  };

  const getNilaiBadge = (nilai) => {
    if (nilai >= 90) return <Badge bg="success">{nilai}</Badge>;
    if (nilai >= 80) return <Badge bg="info">{nilai}</Badge>;
    if (nilai >= 75) return <Badge bg="warning">{nilai}</Badge>;
    return <Badge bg="danger">{nilai}</Badge>;
  };

  const unreadCount = notifikasi.filter(n => n.status === 'Belum Dibaca').length;

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
              <h5 className="mb-0">
                <i className="fas fa-bell me-2"></i>
                Notifikasi Nilai 
                {unreadCount > 0 && (
                  <Badge bg="danger" className="ms-2">{unreadCount}</Badge>
                )}
              </h5>
              {unreadCount > 0 && (
                <Button variant="light" size="sm" onClick={markAllAsRead}>
                  <i className="fas fa-check-double me-2"></i>Tandai Semua Dibaca
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {alert.show && (
                <Alert variant={alert.variant} className="mb-3">
                  {alert.message}
                </Alert>
              )}

              {notifikasi.length > 0 ? (
                <div className="notification-list">
                  {notifikasi.map((notif) => (
                    <Card 
                      key={notif.id} 
                      className={`mb-3 ${notif.status === 'Belum Dibaca' ? 'border-primary' : 'border-light'}`}
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={1}>
                            <div className="text-center">
                              <i className={`fas fa-chart-line fa-2x ${notif.status === 'Belum Dibaca' ? 'text-primary' : 'text-muted'}`}></i>
                            </div>
                          </Col>
                          <Col md={6}>
                            <h6 className={`mb-1 ${notif.status === 'Belum Dibaca' ? 'fw-bold' : ''}`}>
                              Nilai Baru - {notif.nama_mapel}
                            </h6>
                            <p className="mb-1 text-muted">
                              {notif.pesan}
                            </p>
                            <small className="text-muted">
                              <i className="fas fa-clock me-1"></i>
                              {new Date(notif.created_at).toLocaleString('id-ID')}
                            </small>
                          </Col>
                          <Col md={2} className="text-center">
                            {getNilaiBadge(notif.nilai)}
                          </Col>
                          <Col md={2} className="text-center">
                            {getStatusBadge(notif.status)}
                          </Col>
                          <Col md={1} className="text-center">
                            {notif.status === 'Belum Dibaca' && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => markAsRead(notif.id)}
                                title="Tandai sudah dibaca"
                              >
                                <i className="fas fa-check"></i>
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-bell-slash fa-4x text-muted mb-3"></i>
                  <h5 className="text-muted">Belum Ada Notifikasi</h5>
                  <p className="text-muted">
                    Notifikasi nilai baru akan muncul di sini ketika pengajar mengupdate nilai Anda.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      {notifikasi.length > 0 && (
        <Row className="mt-4">
          <Col md={3}>
            <Card className="text-center border-0 bg-light">
              <Card.Body>
                <h4 className="text-primary">{notifikasi.length}</h4>
                <small className="text-muted">Total Notifikasi</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 bg-light">
              <Card.Body>
                <h4 className="text-danger">{unreadCount}</h4>
                <small className="text-muted">Belum Dibaca</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 bg-light">
              <Card.Body>
                <h4 className="text-success">{notifikasi.length - unreadCount}</h4>
                <small className="text-muted">Sudah Dibaca</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 bg-light">
              <Card.Body>
                <h4 className="text-info">
                  {notifikasi.filter(n => new Date(n.created_at) >= new Date(Date.now() - 7*24*60*60*1000)).length}
                </h4>
                <small className="text-muted">7 Hari Terakhir</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default NotifikasiNilai;
