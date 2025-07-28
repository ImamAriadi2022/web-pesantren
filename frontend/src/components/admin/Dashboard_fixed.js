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
        <Col md={4}>
          <Card 
            onClick={() => handleCardClick('/admin/kelola-pengguna')} 
            style={{ cursor: 'pointer' }}
            className="shadow-sm border-0 bg-gradient"
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-primary">Admin</Card.Title>
                  <Card.Text className="h3 text-dark">
                    {stats.userRoles.admin}
                  </Card.Text>
                </div>
                <i className="fas fa-user-shield fa-2x text-primary opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            onClick={() => handleCardClick('/admin/ustadz-ustadzah')} 
            style={{ cursor: 'pointer' }}
            className="shadow-sm border-0 bg-gradient"
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-success">Pengajar</Card.Title>
                  <Card.Text className="h3 text-dark">
                    {stats.userRoles.pengajar}
                  </Card.Text>
                </div>
                <i className="fas fa-chalkboard-teacher fa-2x text-success opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            onClick={() => handleCardClick('/admin/data-santri')} 
            style={{ cursor: 'pointer' }}
            className="shadow-sm border-0 bg-gradient"
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-info">Santri</Card.Title>
                  <Card.Text className="h3 text-dark">
                    {stats.userRoles.santri}
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
        <Col md={3}>
          <Card 
            onClick={() => handleCardClick('/admin/data-santri')} 
            style={{ cursor: 'pointer' }}
            className="shadow-sm border-0"
          >
            <Card.Body>
              <Card.Title className="text-primary">Total Santri Aktif</Card.Title>
              <Card.Text className="h3 text-dark">
                {stats.totalSantri}
              </Card.Text>
              <small className="text-muted">Santri yang sedang aktif</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card 
            onClick={() => handleCardClick('/admin/ustadz-ustadzah')} 
            style={{ cursor: 'pointer' }}
            className="shadow-sm border-0"
          >
            <Card.Body>
              <Card.Title className="text-success">Total Pengajar</Card.Title>
              <Card.Text className="h3 text-dark">
                {stats.totalPengajar}
              </Card.Text>
              <small className="text-muted">Ustadz & Ustadzah aktif</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card 
            onClick={() => handleCardClick('/admin/kelola-asrama')} 
            style={{ cursor: 'pointer' }}
            className="shadow-sm border-0"
          >
            <Card.Body>
              <Card.Title className="text-warning">Total Asrama</Card.Title>
              <Card.Text className="h3 text-dark">
                {stats.totalAsrama}
              </Card.Text>
              <small className="text-muted">Asrama yang tersedia</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card 
            onClick={() => handleCardClick('/admin/kelola-kelas')} 
            style={{ cursor: 'pointer' }}
            className="shadow-sm border-0"
          >
            <Card.Body>
              <Card.Title className="text-info">Total Kelas</Card.Title>
              <Card.Text className="h3 text-dark">
                {stats.totalKelas}
              </Card.Text>
              <small className="text-muted">Kelas aktif</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-primary">
                <i className="fas fa-chart-line me-2"></i>
                Aktivitas Nilai (30 hari terakhir)
              </Card.Title>
              <Card.Text className="h4 text-dark">
                {stats.recentActivities.nilai}
              </Card.Text>
              <small className="text-muted">Nilai yang diinput dalam 30 hari terakhir</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-success">
                <i className="fas fa-user-check me-2"></i>
                Aktivitas Absensi (30 hari terakhir)
              </Card.Title>
              <Card.Text className="h4 text-dark">
                {stats.recentActivities.absensi}
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
