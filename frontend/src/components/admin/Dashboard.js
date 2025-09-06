import { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSantri: 0,
    totalPengajar: 0,
    totalAsrama: 0,
    totalKelas: 0,
    totalUsers: 0
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
      
      // Fetch data dari berbagai endpoint API
      const [santriRes, ustadzRes, asramaRes, kelasRes, usersRes] = await Promise.all([
        fetch('https://teralab.my.id/backend/api/santri/getSantri.php'),
        fetch('https://teralab.my.id/backend/api/ustadz/getUstadz.php'),
        fetch('https://teralab.my.id/backend/api/asrama/getAsrama.php'),
        fetch('https://teralab.my.id/backend/api/kelas/getAllClass.php'),
        fetch('https://teralab.my.id/backend/api/users/getUsers.php')
      ]);

      const [santriData, ustadzData, asramaData, kelasData, usersData] = await Promise.all([
        santriRes.json(),
        ustadzRes.json(),
        asramaRes.json(),
        kelasRes.json(),
        usersRes.json()
      ]);

      console.log('Dashboard API responses:', {
        santri: santriData,
        ustadz: ustadzData,
        asrama: asramaData,
        kelas: kelasData,
        users: usersData
      });

      setStats({
        totalSantri: santriData.success ? (santriData.data?.length || 0) : 0,
        totalPengajar: ustadzData.success ? (ustadzData.data?.length || 0) : 0,
        totalAsrama: asramaData.success ? (asramaData.data?.length || 0) : 0,
        totalKelas: kelasData.success ? (kelasData.data?.length || 0) : 0,
        totalUsers: usersData.success ? (usersData.data?.length || 0) : 0
      });

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
      
      {/* Main Statistics */}
      <Row className="mt-4">
        <Col md={4} className="mb-3">
          <Card 
            onClick={() => handleCardClick('/admin/kelola-pengguna')} 
            style={{ cursor: 'pointer', height: '140px' }}
            className="shadow-sm border-0 h-100"
          >
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="text-secondary mb-2">Total Pengguna</Card.Title>
              <Card.Text className="h3 text-dark mb-1">
                {stats.totalUsers || 0}
              </Card.Text>
              <small className="text-muted">Semua pengguna sistem</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card 
            onClick={() => handleCardClick('/admin/data-santri')} 
            style={{ cursor: 'pointer', height: '140px' }}
            className="shadow-sm border-0 h-100"
          >
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="text-primary mb-2">Total Santri</Card.Title>
              <Card.Text className="h3 text-dark mb-1">
                {stats.totalSantri || 0}
              </Card.Text>
              <small className="text-muted">Santri yang terdaftar</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
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
              <small className="text-muted">Ustadz & Ustadzah</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Facility Statistics */}
      <Row className="mt-4">
        <Col md={6} className="mb-3">
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
        <Col md={6} className="mb-3">
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
              <small className="text-muted">Kelas yang tersedia</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
