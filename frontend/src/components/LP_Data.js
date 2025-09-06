import { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { FaChalkboardTeacher, FaHome, FaUserGraduate } from 'react-icons/fa';

const LPData = () => {
  const [data, setData] = useState([]);

  // Map icon components
  const iconMap = {
    1: <FaUserGraduate style={{ fontSize: '50px', color: '#006400', marginBottom: '1rem' }} />,
    2: <FaChalkboardTeacher style={{ fontSize: '50px', color: '#006400', marginBottom: '1rem' }} />,
    3: <FaHome style={{ fontSize: '50px', color: '#006400', marginBottom: '1rem' }} />
  };

  // Fetch data statistik dari backend
  const fetchStatsData = async () => {
    try {
      const res = await fetch('https://teralab.my.id/backend/api/public/getStatsPublic.php');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        throw new Error(json.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching stats data:', error);
      // Fallback data jika error
      setData([
        {
          id: 1,
          title: 'Total Santri',
          value: 0,
          alt: 'Total Santri Logo'
        },
        {
          id: 2,
          title: 'Total Pengajar',
          value: 0,
          alt: 'Total Pengajar Logo'
        },
        {
          id: 3,
          title: 'Total Kelas',
          value: 0,
          alt: 'Total Kelas Logo'
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
                  {iconMap[item.id]}
                  <Card.Title style={{ color: '#006400', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {item.title}
                  </Card.Title>
                  <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold', color: '#006400' }}>
                    {item.value}
                  </Card.Text>
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
