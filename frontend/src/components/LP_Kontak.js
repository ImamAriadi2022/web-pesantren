import { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaWhatsapp } from 'react-icons/fa';

const LP_Kontak = () => {
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
        email_instansi: 'info@pesantrenwalisongo.com',
        whatsapp: '+62 812-3456-7890',
        telp: '0724-123456',
        alamat_instansi: 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung'
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    const whatsappNumber = settings.whatsapp?.replace(/[^0-9]/g, '');
    const message = 'Halo, saya ingin bertanya tentang Pondok Pesantren Walisongo';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
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
                  {settings.whatsapp || '+62 812-3456-7890'}
                </p>
                <button 
                  className="btn btn-success"
                  onClick={handleWhatsAppClick}
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
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
                  {settings.telp || '0724-123456'}
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
                  {settings.alamat_instansi || 'Jl. Raya Pesantren No. 123, Lampung Utara, Lampung'}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.3333333333335!2d104.5833333!3d-4.0833333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDUnMDAuMCJTIDEwNMKwMzUnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '10px' }}
            allowFullScreen=""
            loading="lazy"
            title="Lokasi Pondok Pesantren"
          ></iframe>
        </div>
      </Container>
    </section>
  );
};

export default LP_Kontak;
