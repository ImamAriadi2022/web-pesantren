import { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { FaDownload, FaEnvelope, FaFileAlt, FaWhatsapp } from 'react-icons/fa';

const LP_Psb = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Fetch PSB settings data from admin API
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://teralab.my.id/backend/api/get_settings.php');
      const result = await response.json();
      
      if (result.success && result.data) {
        setSettings(result.data);
        setError('');
      } else {
        throw new Error('Failed to fetch PSB data');
      }
    } catch (error) {
      console.error('Error fetching PSB settings:', error);
      setError('Gagal memuat data PSB. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    const whatsappNumber = settings.whatsapp?.replace(/[^0-9]/g, '');
    const message = 'Halo, saya ingin bertanya tentang Penerimaan Santri Baru';
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleEmailClick = () => {
    if (settings.email_instansi) {
      window.open(`mailto:${settings.email_instansi}?subject=Pertanyaan tentang PSB`);
    }
  };

  const handleDownloadBrosur = () => {
    window.open('https://teralab.my.id/backend/api/download_brosur.php', '_blank');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Memuat informasi PSB...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <section style={{ padding: '3rem 0' }}>
      <Container>
        <div className="mb-5 text-start">
          <h2 style={{ color: '#006400' }}>Penerimaan Santri Baru</h2>
          <p style={{ fontSize: '1.1rem' }}>
            Berikut adalah informasi mengenai penerimaan santri baru di {settings.nama_instansi || 'Pondok Pesantren Walisongo Lampung Utara'}
          </p>
          {settings.psb_tahun_ajaran && (
            <div className="alert alert-info">
              <strong>Tahun Ajaran:</strong> {settings.psb_tahun_ajaran} | 
              <strong> Status:</strong> <span className={`badge ${settings.psb_status === 'Dibuka' ? 'bg-success' : 'bg-warning'}`}>
                {settings.psb_status}
              </span>
              {settings.psb_kuota && (
                <>
                  <strong> | Kuota:</strong> {settings.psb_kuota} santri
                </>
              )}
              {settings.psb_biaya_pendaftaran && (
                <>
                  <strong> | Biaya:</strong> {settings.psb_biaya_pendaftaran}
                </>
              )}
            </div>
          )}
        </div>
        
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#006400', color: 'white' }}>
                <h5 className="mb-0">
                  <FaFileAlt className="me-2" />
                  Brosur Penerimaan Santri Baru
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <FaFileAlt size={50} className="mb-3 text-success" />
                  <h5>Brosur Penerimaan Santri Baru</h5>
                  <p>Download brosur lengkap untuk informasi detail tentang PSB</p>
                  
                  <button 
                    className="btn btn-success"
                    onClick={handleDownloadBrosur}
                  >
                    <FaDownload className="me-2" />
                    Download Brosur PDF
                  </button>
                  
                  {showPdfPreview && (
                    <div className="mt-4">
                      <h6>Preview Brosur:</h6>
                      <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <iframe
                          src="https://teralab.my.id/backend/api/download_brosur.php"
                          width="100%"
                          height="100%"
                          style={{ border: 'none', borderRadius: '8px' }}
                          title="Preview Brosur PSB"
                        />
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="btn btn-outline-secondary btn-sm mt-2"
                    onClick={() => setShowPdfPreview(!showPdfPreview)}
                  >
                    {showPdfPreview ? 'Sembunyikan' : 'Tampilkan'} Preview
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="mb-4 border-0 shadow">
              <Card.Header style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #006400' }}>
                <h5 style={{ color: '#006400', margin: 0 }}>Informasi Pendaftaran</h5>
              </Card.Header>
              <Card.Body>
                <p style={{ lineHeight: '1.6' }}>
                  Jika ada informasi yang kurang jelas dapat menghubungi panitia pendaftaran melalui kontak dibawah ini:
                </p>
                
                <div className="d-grid gap-3">
                  <div 
                    className="d-flex align-items-center p-3 rounded"
                    style={{ backgroundColor: '#f0fff0', border: '1px solid #d4edda', cursor: 'pointer' }}
                    onClick={handleWhatsAppClick}
                  >
                    <FaWhatsapp 
                      style={{ fontSize: '30px', color: '#25D366', marginRight: '15px' }} 
                    />
                    <div>
                      <strong style={{ color: '#006400' }}>WhatsApp</strong>
                      <br />
                      <span>{settings.whatsapp || '+62 812-3456-7890'}</span>
                    </div>
                  </div>
                  
                  <div 
                    className="d-flex align-items-center p-3 rounded"
                    style={{ backgroundColor: '#f0fff0', border: '1px solid #d4edda', cursor: 'pointer' }}
                    onClick={handleEmailClick}
                  >
                    <FaEnvelope 
                      style={{ fontSize: '30px', color: '#006400', marginRight: '15px' }} 
                    />
                    <div>
                      <strong style={{ color: '#006400' }}>Email</strong>
                      <br />
                      <span style={{ fontSize: '0.9rem' }}>
                        {settings.email_instansi || 'info@pesantrenwalisongo.com'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* <div className="mt-4 p-3" style={{ backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
                  <h6 style={{ color: '#006400', marginBottom: '10px' }}>Jam Pelayanan:</h6>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Senin - Jumat: 08:00 - 16:00 WIB<br />
                    Sabtu: 08:00 - 12:00 WIB<br />
                    Minggu: Libur
                  </p>
                </div> */}
                
                {settings.psb_persyaratan && (
                  <div className="mt-4 p-3" style={{ backgroundColor: '#fff8e1', borderRadius: '8px', border: '1px solid #ffeb3b' }}>
                    <h6 style={{ color: '#006400', marginBottom: '10px' }}>Persyaratan Pendaftaran:</h6>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
                      {settings.psb_persyaratan}
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LP_Psb;
