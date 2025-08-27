import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const LPHero = () => {
  const [settings, setSettings] = useState({});

  // Fetch website settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/public/getSettingsPublic.php');
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default settings if API fails
      setSettings({
        nama_instansi: 'Pondok Pesantren Walisongo Lampung Utara',
        tagline_web: 'Institusi Madrasah Aliyah (MA) Plus'
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div style={{ backgroundColor: '#f0fff0', color: '#006400', padding: '3rem 0', height: '60vh' }}>
      <Container className="h-100">
        <Row className="align-items-center h-100">
          <Col md={6} className='text-start'>
            <h1>{settings.nama_instansi || 'Pondok Pesantren Walisongo Lampung Utara'}</h1>
            <p>{settings.tagline_web || 'Institusi Madrasah Aliyah (MA) Plus'}</p>
            {settings.caption_web && (
              <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
                {settings.caption_web}
              </p>
            )}
          </Col>
          <Col md={6} className='text-end'>
            <img
              src="/landing/masjid1.jpg"
              alt="Masjid Pesantren"
              className="img-fluid"
              style={{ maxWidth: '60%', height: 'auto'}}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LPHero;
