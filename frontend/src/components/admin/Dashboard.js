import { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSantri: 0,
    totalPengajar: 0,
    totalAsrama: 0,
    totalPSB: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost/web-pesantren/backend/api/dashboard/getStats.php');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Error fetching stats:', result.message);
        // Fallback to default values
        setStats({
          totalSantri: 0,
          totalPengajar: 0,
          totalAsrama: 0,
          totalPSB: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to default values
      setStats({
        totalSantri: 0,
        totalPengajar: 0,
        totalAsrama: 0,
        totalPSB: 0
      });
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
      <Row className="mt-4">
        <Col md={3}>
          <Card 
            onClick={() => handleCardClick('/admin/data-santri')} 
            style={{ cursor: 'pointer' }}
            className="shadow-sm border-0"
          >
            <Card.Body>
              <Card.Title className="text-primary">Total Santri</Card.Title>
              <Card.Text className="h3 text-dark">
                {stats.totalSantri}
              </Card.Text>
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
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card 
            onClick={() => handleCardClick('/admin/kelola-psb')} 
            style={{ cursor: 'pointer' }}
            className="shadow-sm border-0"
          >
            <Card.Body>
              <Card.Title className="text-info">Total PSB</Card.Title>
              <Card.Text className="h3 text-dark">
                {stats.totalPSB}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;