import { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaWhatsapp } from 'react-icons/fa';

const LP_Kontak = () => {
  const [settings, setSettings] = useState({});

  // Fetch website settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/get_settings.php');
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default settings if API fails
      setSettings({
        email_instansi: 'info@pesantrenwalisongo.com',
        whatsapp: '+62 812-3456-7890',
        telp: '0724-123456',
        alamat: 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung'
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    const whatsappNumber = settings.whatsapp?.replace(/[^0-9]/g, '');
    const instituteName = settings.nama_instansi || settings.nama_pesantren || 'Pondok Pesantren';
    const message = `Halo, saya ingin bertanya tentang ${instituteName}`;
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleEmailClick = () => {
    window.open(`mailto:${settings.email_instansi}`, '_blank');
  };

  return (
    <section style={{ padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
      <Container>
        <div className="text-center mb-5">
          <h2 style={{ color: '#006400', marginBottom: '1rem' }}>Kontak Kami</h2>
          <p style={{ fontSize: '1.1rem' }}>
            Untuk bertanya terkait kendala apapun itu, dapat menghubungi pada Pusat bantuan dibawah ini
          </p>
          {(settings.nama_instansi || settings.nama_pesantren) && (
            <h5 style={{ color: '#006400', marginTop: '1rem' }}>
              {settings.nama_instansi || settings.nama_pesantren}
            </h5>
          )}
        </div>
        
        <Row className="mb-5">
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <FaWhatsapp 
                  size={50} 
                  style={{ color: '#25D366', marginBottom: '1rem' }} 
                />
                <h5 style={{ color: '#006400' }}>WhatsApp</h5>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {settings.whatsapp ? `+${settings.whatsapp}` : '+62 812-3456-7890'}
                </p>
                <button 
                  className="btn btn-success"
                  onClick={handleWhatsAppClick}
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                  disabled={!settings.whatsapp}
                >
                  Chat WhatsApp
                </button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <FaEnvelope 
                  size={50} 
                  style={{ color: '#006400', marginBottom: '1rem' }} 
                />
                <h5 style={{ color: '#006400' }}>Email</h5>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {settings.email_instansi || 'info@pesantrenwalisongo.com'}
                </p>
                <button 
                  className="btn"
                  onClick={handleEmailClick}
                  style={{ backgroundColor: '#006400', borderColor: '#006400', color: 'white' }}
                  disabled={!settings.email_instansi}
                >
                  Kirim Email
                </button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <FaPhone 
                  size={50} 
                  style={{ color: '#006400', marginBottom: '1rem' }} 
                />
                <h5 style={{ color: '#006400' }}>Telepon</h5>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {settings.telp || 'Tidak tersedia'}
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <FaMapMarkerAlt 
                  size={50} 
                  style={{ color: '#006400', marginBottom: '1rem' }} 
                />
                <h5 style={{ color: '#006400' }}>Alamat</h5>
                <p style={{ fontSize: '1rem' }}>
                  {settings.alamat || 'Alamat belum diatur'}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Website Information if available */}
        {settings.website && (
          <Row className="mb-4">
            <Col md={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <h5 style={{ color: '#006400' }}>Website Resmi</h5>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    <a 
                      href={settings.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#006400', textDecoration: 'none' }}
                    >
                      {settings.website}
                    </a>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default LP_Kontak;
