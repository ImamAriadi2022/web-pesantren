import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { FaDownload, FaEnvelope, FaEye, FaSave, FaTrash, FaWhatsapp } from 'react-icons/fa';

const KelolaPsb = () => {
  const [psb, setPsb] = useState(null);
  const [formPsb, setFormPsb] = useState({ 
    id: null, 
    tahunAjaran: '', 
    whatsappPanitia: '', 
    emailPanitia: '', 
    brosur: '',
    alamatPesantren: '',
    websitePesantren: '',
    statusPendaftaran: 'Buka'
  });
  const [brosurFile, setBrosurFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    fetchPsbData();
  }, []);

  const fetchPsbData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://teralab.my.id/backend/api/get_settings.php');
      const result = await response.json();
      if (result.success && result.data) {
        const psbData = {
          id: 1,
          tahunAjaran: result.data.tahun_ajaran || '',
          whatsappPanitia: result.data.whatsapp || '',
          emailPanitia: result.data.email_instansi || '',
          brosur: result.data.psb_pdf || '',
          alamatPesantren: result.data.alamat || '',
          websitePesantren: result.data.website || '',
          statusPendaftaran: result.data.status_psb || 'Buka'
        };
        setPsb(psbData);
        setFormPsb(psbData);
      }
    } catch (error) {
      console.error('Error fetching PSB data:', error);
      setError('Gagal memuat data PSB');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePsb = async () => {
    if (!window.confirm('Yakin ingin menghapus data PSB ini?')) return;
    
    setLoading(true);
    try {
      const response = await fetch('https://teralab.my.id/backend/api/save_settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tahun_ajaran: '',
          whatsapp: '',
          email_instansi: '',
          alamat: '',
          website: '',
          status_psb: 'Tutup',
          psb_pdf: ''
        })
      });
      const result = await response.json();
      if (result.success) {
        setPsb(null);
        setFormPsb({ 
          id: null, 
          tahunAjaran: '', 
          whatsappPanitia: '', 
          emailPanitia: '', 
          brosur: '',
          alamatPesantren: '',
          websitePesantren: '',
          statusPendaftaran: 'Tutup'
        });
        setSuccess('Data PSB berhasil dihapus');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Gagal menghapus data PSB');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan saat menghapus data');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePsb = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    
    try {
      const formData = new FormData();
      
      // Only append fields that have values
      if (formPsb.tahunAjaran.trim()) formData.append('tahun_ajaran', formPsb.tahunAjaran);
      if (formPsb.whatsappPanitia.trim()) formData.append('whatsapp', formPsb.whatsappPanitia);
      if (formPsb.emailPanitia.trim()) formData.append('email_instansi', formPsb.emailPanitia);
      if (formPsb.alamatPesantren.trim()) formData.append('alamat', formPsb.alamatPesantren);
      if (formPsb.websitePesantren.trim()) formData.append('website', formPsb.websitePesantren);
      if (formPsb.statusPendaftaran) formData.append('status_psb', formPsb.statusPendaftaran);
      
      if (brosurFile) {
        formData.append('psb_pdf', brosurFile);
      } else if (formPsb.brosur) {
        formData.append('psb_pdf_path', formPsb.brosur);
      }

      const response = await fetch('https://teralab.my.id/backend/api/save_settings.php', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        setSuccess('Data PSB berhasil disimpan');
        await fetchPsbData();
        setBrosurFile(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Gagal menyimpan data PSB');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrosurFile(file);
      setFormPsb({ ...formPsb, brosur: file.name });
    }
  };

  return (
    <div className="d-flex">
      <div className="w-50 p-3">
        <h2>Kelola PSB</h2>
        
        {loading && <Spinner animation="border" className="mb-3" />}
        
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {success && <Alert variant="success" className="mb-3">{success}</Alert>}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tahun Ajaran PSB</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Contoh: 2024/2025" 
              value={formPsb.tahunAjaran} 
              onChange={(e) => setFormPsb({ ...formPsb, tahunAjaran: e.target.value })} 
            />
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>WhatsApp Panitia</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="62812345678" 
                  value={formPsb.whatsappPanitia} 
                  onChange={(e) => setFormPsb({ ...formPsb, whatsappPanitia: e.target.value })} 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email Panitia</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="psb@pesantren.ac.id" 
                  value={formPsb.emailPanitia} 
                  onChange={(e) => setFormPsb({ ...formPsb, emailPanitia: e.target.value })} 
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Alamat Pesantren</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Alamat lengkap pesantren"
              value={formPsb.alamatPesantren} 
              onChange={(e) => setFormPsb({ ...formPsb, alamatPesantren: e.target.value })} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Website Pesantren</Form.Label>
            <Form.Control 
              type="url" 
              placeholder="https://pesantren.ac.id"
              value={formPsb.websitePesantren} 
              onChange={(e) => setFormPsb({ ...formPsb, websitePesantren: e.target.value })} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status Pendaftaran</Form.Label>
            <Form.Select 
              value={formPsb.statusPendaftaran} 
              onChange={(e) => setFormPsb({ ...formPsb, statusPendaftaran: e.target.value })}
            >
              <option value="Buka">Buka</option>
              <option value="Tutup">Tutup</option>
              <option value="Segera">Segera</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Brosur Pendaftaran (PDF)</Form.Label>
            <Form.Control type="file" accept="application/pdf" onChange={handlePdfUpload} />
            {formPsb.brosur && (
              <div className="mt-2">
                <small className="text-muted d-block">File: {formPsb.brosur}</small>
                <div className="mt-1">
                  <Button 
                    size="sm" 
                    variant="outline-success" 
                    href="https://teralab.my.id/backend/api/download_brosur.php"
                    target="_blank"
                    className="me-2"
                  >
                    <FaDownload className="me-1" />
                    Download Brosur
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline-info"
                    href={`https://teralab.my.id/backend/${formPsb.brosur}`}
                    target="_blank"
                  >
                    <FaEye className="me-1" />
                    Preview PDF
                  </Button>
                </div>
              </div>
            )}
          </Form.Group>

          <div className="d-flex justify-content-between">
            <div>
              <Button variant="primary" onClick={handleSavePsb} disabled={loading}>
                <FaSave className="me-2" />
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
              <Button variant="danger" className="ms-2" onClick={handleDeletePsb} disabled={loading}>
                <FaTrash className="me-2" />
                Hapus
              </Button>
            </div>
            <Button 
              variant="outline-primary" 
              onClick={() => setPreviewMode(!previewMode)}
            >
              <FaEye className="me-2" />
              {previewMode ? 'Sembunyikan Preview' : 'Tampilkan Preview'}
            </Button>
          </div>
        </Form>
      </div>
      
      {previewMode && (
        <div className="w-50 p-3 border-start">
          <h3 className="mb-4">
            <FaEye className="me-2" />
            Preview Landing Page PSB
          </h3>
          
          <Card className="mb-3">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Informasi Pendaftaran Santri Baru</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12} className="mb-3">
                  <h6 className="text-primary">Tahun Ajaran</h6>
                  <p className="mb-2">{formPsb.tahunAjaran || 'Belum diatur'}</p>
                </Col>
                
                <Col md={12} className="mb-3">
                  <h6 className="text-primary">Status Pendaftaran</h6>
                  <Badge 
                    bg={formPsb.statusPendaftaran === 'Buka' ? 'success' : 
                        formPsb.statusPendaftaran === 'Tutup' ? 'danger' : 'warning'}
                    className="fs-6"
                  >
                    {formPsb.statusPendaftaran || 'Belum diatur'}
                  </Badge>
                </Col>

                <Col md={12} className="mb-3">
                  <h6 className="text-primary">Alamat Pesantren</h6>
                  <p className="mb-2">{formPsb.alamatPesantren || 'Belum diatur'}</p>
                </Col>

                <Col md={12} className="mb-3">
                  <h6 className="text-primary">Website</h6>
                  <p className="mb-2">
                    {formPsb.websitePesantren ? (
                      <a href={formPsb.websitePesantren} target="_blank" rel="noopener noreferrer">
                        {formPsb.websitePesantren}
                      </a>
                    ) : 'Belum diatur'}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Kontak Panitia PSB</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    <FaWhatsapp className="text-success me-2" />
                    <div>
                      <small className="text-muted">WhatsApp</small>
                      <p className="mb-0">{formPsb.whatsappPanitia || 'Belum diatur'}</p>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    <FaEnvelope className="text-primary me-2" />
                    <div>
                      <small className="text-muted">Email</small>
                      <p className="mb-0">{formPsb.emailPanitia || 'Belum diatur'}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {formPsb.brosur && (
            <Card className="mb-3">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">Brosur Pendaftaran</h5>
              </Card.Header>
              <Card.Body className="text-center">
                <FaDownload className="text-info mb-2" style={{fontSize: '2rem'}} />
                <p className="mb-2">Brosur tersedia untuk diunduh</p>
                <small className="text-muted d-block mb-2">File: {formPsb.brosur}</small>
                <div className="mb-3">
                  <Button 
                    size="sm" 
                    variant="info" 
                    href="https://teralab.my.id/backend/api/download_brosur.php"
                    target="_blank"
                    className="me-2"
                  >
                    <FaDownload className="me-1" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline-info"
                    onClick={() => setShowPdfPreview(!showPdfPreview)}
                  >
                    <FaEye className="me-1" />
                    {showPdfPreview ? 'Sembunyikan' : 'Tampilkan'} Preview
                  </Button>
                </div>
                
                {showPdfPreview && (
                  <div className="mt-3">
                    <div 
                      style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        overflow: 'hidden' 
                      }}
                    >
                      <iframe
                        src={`https://teralab.my.id/backend/${formPsb.brosur}`}
                        width="100%"
                        height="300px"
                        title="Preview Brosur PSB"
                        style={{ border: 'none' }}
                      />
                    </div>
                    <small className="text-muted d-block mt-2">
                      Preview brosur PSB dalam iframe. Klik "Download" untuk melihat ukuran penuh.
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default KelolaPsb;
