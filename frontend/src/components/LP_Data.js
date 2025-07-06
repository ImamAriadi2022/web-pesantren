import { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

const LPData = () => {
  const [data, setData] = useState([]);

  // Fetch data statistik dari backend
  const fetchStatsData = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/public/getStatsPublic.php');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (error) {
      console.error('Error fetching stats data:', error);
      // Fallback data jika error
      setData([
        {
          id: 1,
          title: 'Total Santri',
          value: 0,
          logo: 'path/to/logo1.png',
          alt: 'Total Santri Logo'
        },
        {
          id: 2,
          title: 'Total Pengajar',
          value: 0,
          logo: 'path/to/logo2.png',
          alt: 'Total Pengajar Logo'
        },
        {
          id: 3,
          title: 'Total Asrama',
          value: 0,
          logo: 'path/to/logo3.png',
          alt: 'Total Asrama Logo'
        }
      ]);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);
  return (
    <section style={{ padding: '3rem 0' }}>
      <Container style={{ border: '1px solid #006400', borderRadius: '10px', padding: '2rem' }}>
        <Row>
          {data.map(item => (
            <Col md={4} key={item.id}>
              <Card className="text-center" style={{ border: 'none' }}>
                <Card.Body>
                  <img
                    src={item.logo}
                    alt={item.alt}
                    className="img-fluid mb-3"
                    style={{ width: '50px', height: '50px' }}
                  />
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.value}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default LPData;