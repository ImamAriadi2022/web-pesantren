import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const [settings, setSettings] = useState({});

  // Fetch website settings
  const fetchSettings = async () => {
    try {
      console.log('Fetching settings for footer...');
      const response = await fetch('https://teralab.my.id/backend/api/get_settings.php');
      const result = await response.json();
      console.log('Footer settings API response:', result);
      
      if (result.success && result.data) {
        setSettings(result.data);
        console.log('Footer settings loaded:', result.data);
      } else {
        console.error('API returned error:', result.message);
        // Set default settings if API fails
        setSettings({
          footer_web: 'Pondok Pesantren Walisongo Lampung Utara',
          email_instansi: 'info@pesantrenwalisongo.com',
          telp: '0724-123456',
          alamat: 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung',
          nama_instansi: 'Pondok Pesantren Walisongo'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default settings if API fails
      setSettings({
        footer_web: 'Pondok Pesantren Walisongo Lampung Utara',
        email_instansi: 'info@pesantrenwalisongo.com',
        telp: '0724-123456',
        alamat: 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung',
        nama_instansi: 'Pondok Pesantren Walisongo'
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <footer style={{ 
      backgroundColor: '#006400', 
      color: '#ffffff', 
      padding: '2rem 0',
      marginTop: 'auto',
      position: 'relative',
      zIndex: 1
    }}>
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 style={{ marginBottom: '1rem' }}>
              {settings.nama_instansi || settings.footer_web || 'Pondok Pesantren Walisongo Lampung Utara'}
            </h5>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              {settings.tentang_web || 'Lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qur\'ani yang berakhlak mulia.'}
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
            {settings.whatsapp && (
              <div className="d-flex align-items-center mb-2">
                <FaPhone style={{ marginRight: '10px', fontSize: '14px' }} />
                <span style={{ fontSize: '0.9rem' }}>
                  WhatsApp: {settings.whatsapp}
                </span>
              </div>
            )}
          </Col>
          
          <Col md={4} className="mb-3">
            <h6 style={{ marginBottom: '1rem' }}>Alamat</h6>
            <div className="d-flex align-items-start">
              <FaMapMarkerAlt style={{ marginRight: '10px', fontSize: '14px', marginTop: '3px' }} />
              <span style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                {settings.alamat || 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung'}
              </span>
            </div>
            {settings.website && (
              <div className="d-flex align-items-center mt-2">
                <span style={{ fontSize: '0.9rem' }}>
                  Website: <a href={settings.website} target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                    {settings.website}
                  </a>
                </span>
              </div>
            )}
          </Col>
        </Row>
        
        <hr style={{ borderColor: '#ffffff', opacity: 0.3, margin: '1.5rem 0' }} />
        
        <Row>
          <Col className="text-center">
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              &copy; {new Date().getFullYear()} {settings.nama_instansi || settings.footer_web || 'Pondok Pesantren Walisongo Lampung Utara'}. 
              Semua hak cipta dilindungi.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
