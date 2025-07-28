import { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    userRoles: { admin: 0, pengajar: 0, santri: 0 },
    totalSantri: 0,
    totalPengajar: 0,
    totalAsrama: 0,
    totalKelas: 0,
    recentActivities: { nilai: 0, absensi: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost/web-pesantren/backend/api/dashboard/getUserStats.php');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError('Gagal memuat statistik dashboard');
        console.error('Error fetching stats:', result.message);
      }
    } catch (error) {
      setError('Koneksi ke server gagal');
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (path) => {
    navigate(path);
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
      {error && (
        <Alert variant="warning" className="mt-3">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}
      
      {/* User Roles Statistics */}
      <Row className="mt-4">
        <Col md={4} className="mb-3">
          <Card 
            onClick={() => handleCardClick('/admin/kelola-pengguna')} 
            style={{ cursor: 'pointer', height: '120px' }}
            className="shadow-sm border-0 bg-gradient h-100"
          >
            <Card.Body className="d-flex align-items-center">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <Card.Title className="text-primary mb-1">Admin</Card.Title>
                  <Card.Text className="h3 text-dark mb-0">
                    {stats.userRoles?.admin || 0}
                  </Card.Text>
                </div>
                <i className="fas fa-user-shield fa-2x text-primary opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card 
            onClick={() => handleCardClick('/admin/ustadz-ustadzah')} 
            style={{ cursor: 'pointer', height: '120px' }}
            className="shadow-sm border-0 bg-gradient h-100"
          >
            <Card.Body className="d-flex align-items-center">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <Card.Title className="text-success mb-1">Pengajar</Card.Title>
                  <Card.Text className="h3 text-dark mb-0">
                    {stats.userRoles?.pengajar || 0}
                  </Card.Text>
                </div>
                <i className="fas fa-chalkboard-teacher fa-2x text-success opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card 
            onClick={() => handleCardClick('/admin/data-santri')} 
            style={{ cursor: 'pointer', height: '120px' }}
            className="shadow-sm border-0 bg-gradient h-100"
          >
            <Card.Body className="d-flex align-items-center">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <Card.Title className="text-info mb-1">Santri</Card.Title>
                  <Card.Text className="h3 text-dark mb-0">
                    {stats.userRoles?.santri || 0}
                  </Card.Text>
                </div>
                <i className="fas fa-user-graduate fa-2x text-info opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Statistics */}
      <Row className="mt-4">
        <Col md={3} className="mb-3">
          <Card 
            onClick={() => handleCardClick('/admin/data-santri')} 
            style={{ cursor: 'pointer', height: '140px' }}
            className="shadow-sm border-0 h-100"
          >
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="text-primary mb-2">Total Santri Aktif</Card.Title>
              <Card.Text className="h3 text-dark mb-1">
                {stats.totalSantri || 0}
              </Card.Text>
              <small className="text-muted">Santri yang sedang aktif</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card 
            onClick={() => handleCardClick('/admin/ustadz-ustadzah')} 
            style={{ cursor: 'pointer', height: '140px' }}
            className="shadow-sm border-0 h-100"
          >
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="text-success mb-2">Total Pengajar</Card.Title>
              <Card.Text className="h3 text-dark mb-1">
                {stats.totalPengajar || 0}
              </Card.Text>
              <small className="text-muted">Ustadz & Ustadzah aktif</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card 
            onClick={() => handleCardClick('/admin/kelola-asrama')} 
            style={{ cursor: 'pointer', height: '140px' }}
            className="shadow-sm border-0 h-100"
          >
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="text-warning mb-2">Total Asrama</Card.Title>
              <Card.Text className="h3 text-dark mb-1">
                {stats.totalAsrama || 0}
              </Card.Text>
              <small className="text-muted">Asrama yang tersedia</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card 
            onClick={() => handleCardClick('/admin/kelola-kelas')} 
            style={{ cursor: 'pointer', height: '140px' }}
            className="shadow-sm border-0 h-100"
          >
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="text-info mb-2">Total Kelas</Card.Title>
              <Card.Text className="h3 text-dark mb-1">
                {stats.totalKelas || 0}
              </Card.Text>
              <small className="text-muted">Kelas aktif</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row className="mt-4">
        <Col md={6} className="mb-3">
          <Card className="shadow-sm border-0 h-100" style={{ height: '140px' }}>
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="text-primary mb-2">
                <i className="fas fa-chart-line me-2"></i>
                Aktivitas Nilai (30 hari terakhir)
              </Card.Title>
              <Card.Text className="h4 text-dark mb-1">
                {stats.recentActivities?.nilai || 0}
              </Card.Text>
              <small className="text-muted">Nilai yang diinput dalam 30 hari terakhir</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="shadow-sm border-0 h-100" style={{ height: '140px' }}>
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="text-success mb-2">
                <i className="fas fa-user-check me-2"></i>
                Aktivitas Absensi (30 hari terakhir)
              </Card.Title>
              <Card.Text className="h4 text-dark mb-1">
                {stats.recentActivities?.absensi || 0}
              </Card.Text>
              <small className="text-muted">Absensi yang dicatat dalam 30 hari terakhir</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
