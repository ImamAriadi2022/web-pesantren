import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Alert } from 'react-bootstrap';
import { FaEnvelope, FaWhatsapp, FaDownload, FaFileAlt } from 'react-icons/fa';

const LP_Psb = () => {
  const [settings, setSettings] = useState({});
  const [pdfError, setPdfError] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Fetch PSB and settings data
  const fetchSettings = async () => {
    try {
      const [settingsResponse, psbResponse] = await Promise.all([
        fetch('http://localhost/web-pesantren/backend/api/public/getSettingsPublic.php'),
        fetch('http://localhost/web-pesantren/backend/api/public/getPsbPublic.php')
      ]);
      
      const settingsResult = await settingsResponse.json();
      const psbResult = await psbResponse.json();
      
      if (settingsResult.success && psbResult.success) {
        setSettings({
          ...settingsResult.data,
          ...psbResult.data
        });
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default settings if API fails
      setSettings({
        whatsapp: '+62 812-3456-7890',
        email_instansi: 'info@pesantrenwalisongo.com',
        psb_pdf: '/documents/brosur-psb.pdf',
        nama_instansi: 'Pondok Pesantren Walisongo Lampung Utara',
        tahun_ajaran: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
        status: 'Dibuka'
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    const whatsappNumber = settings.whatsapp?.replace(/[^0-9]/g, '');
    const message = 'Halo, saya ingin bertanya tentang Penerimaan Santri Baru';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${settings.email_instansi}?subject=Pertanyaan PSB`, '_blank');
  };

  const handleDownloadPDF = () => {
    if (settings.psb_pdf) {
      const link = document.createElement('a');
      link.href = settings.psb_pdf;
      link.download = 'Brosur-PSB.pdf';
      link.click();
    }
  };

  return (
    <section style={{ padding: '3rem 0' }}>
      <Container>
        <div className="mb-5 text-start">
          <h2 style={{ color: '#006400' }}>Penerimaan Santri Baru</h2>
          <p style={{ fontSize: '1.1rem' }}>
            Berikut adalah informasi mengenai penerimaan santri baru di {settings.nama_instansi || 'Pondok Pesantren Walisongo Lampung Utara'}
          </p>
          {settings.tahun_ajaran && (
            <div className="alert alert-info">
              <strong>Tahun Ajaran:</strong> {settings.tahun_ajaran} | 
              <strong> Status:</strong> <span className={`badge ${settings.status === 'Dibuka' ? 'bg-success' : 'bg-warning'}`}>
                {settings.status}
              </span>
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
                {settings.psb_pdf && !pdfError ? (
                  <div style={{ height: '500px' }}>
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
                      <Viewer 
                        fileUrl={settings.psb_pdf} 
                        plugins={[defaultLayoutPluginInstance]}
                        onLoadError={() => setPdfError(true)}
                      />
                    </Worker>
                  </div>
                ) : (
                  <Alert variant="warning" className="text-center">
                    <FaFileAlt size={50} className="mb-3" />
                    <h5>Dokumen PSB Tidak Tersedia</h5>
                    <p>Silakan hubungi panitia pendaftaran untuk mendapatkan informasi lebih lanjut.</p>
                    <button 
                      className="btn btn-outline-primary me-2"
                      onClick={handleDownloadPDF}
                      disabled={!settings.psb_pdf}
                    >
                      <FaDownload className="me-2" />
                      Download Brosur
                    </button>
                  </Alert>
                )}
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
                
                <div className="mt-4 p-3" style={{ backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
                  <h6 style={{ color: '#006400', marginBottom: '10px' }}>Jam Pelayanan:</h6>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Senin - Jumat: 08:00 - 16:00 WIB<br />
                    Sabtu: 08:00 - 12:00 WIB<br />
                    Minggu: Libur
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LP_Psb;