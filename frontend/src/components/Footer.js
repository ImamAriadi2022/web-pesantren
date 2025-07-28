import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
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
        footer_web: 'Pondok Pesantren Walisongo Lampung Utara',
        email_instansi: 'info@pesantrenwalisongo.com',
        telp: '0724-123456',
        alamat_instansi: 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung'
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <footer style={{ backgroundColor: '#006400', color: '#ffffff', padding: '2rem 0' }}>
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 style={{ marginBottom: '1rem' }}>
              {settings.footer_web || 'Pondok Pesantren Walisongo Lampung Utara'}
            </h5>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qur'ani yang berakhlak mulia.
            </p>
          </Col>
          
          <Col md={4} className="mb-3">
            <h6 style={{ marginBottom: '1rem' }}>Kontak Kami</h6>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope style={{ marginRight: '10px', fontSize: '14px' }} />
              <span style={{ fontSize: '0.9rem' }}>
                {settings.email_instansi || 'info@pesantrenwalisongo.com'}
              </span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaPhone style={{ marginRight: '10px', fontSize: '14px' }} />
              <span style={{ fontSize: '0.9rem' }}>
                {settings.telp || '0724-123456'}
              </span>
            </div>
          </Col>
          
          <Col md={4} className="mb-3">
            <h6 style={{ marginBottom: '1rem' }}>Alamat</h6>
            <div className="d-flex align-items-start">
              <FaMapMarkerAlt style={{ marginRight: '10px', fontSize: '14px', marginTop: '3px' }} />
              <span style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                {settings.alamat_instansi || 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung'}
              </span>
            </div>
          </Col>
        </Row>
        
        <hr style={{ borderColor: '#ffffff', opacity: 0.3, margin: '1.5rem 0' }} />
        
        <Row>
          <Col className="text-center">
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              &copy; {new Date().getFullYear()} {settings.footer_web || 'Pondok Pesantren Walisongo Lampung Utara'}. 
              Semua hak cipta dilindungi.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;