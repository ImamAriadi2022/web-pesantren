import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { FaEdit, FaSave, FaSync, FaTrash } from 'react-icons/fa';

const PengaturanWeb = () => {
  const [settings, setSettings] = useState({
    judul_web: '',
    tagline_web: '',
    caption_web: '',
    tentang_web: '',
    footer_web: '',
    logo_web: '',
    nama_instansi: '',
    nama_pimpinan: '',
    nik_pimpinan: '',
    alamat: '',
    email_instansi: '',
    telp: '',
    whatsapp: '',
    website: '',
    psb_pdf: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [originalSettings, setOriginalSettings] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState('');
  
  // Refs for file inputs
  const logoInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/get_settings.php');
      const result = await response.json();
      if (result.success) {
        const data = result.data || {};
        setSettings(data);
        setOriginalSettings(data);
      } else {
        setMessage('Error fetching settings: ' + result.message);
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage('Error fetching settings. Please check your connection.');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logo_web: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImageUpload = () => {
    // Clear the file input using ref
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
    // Clear the logo_web value completely
    setSettings({ ...settings, logo_web: '' });
    
    console.log('Logo cleared from form'); // Debug log
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran file tidak boleh lebih dari 3 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, psb_pdf: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPdfUpload = () => {
    // Clear the file input using ref
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
    // Clear the psb_pdf value
    setSettings({ ...settings, psb_pdf: '' });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      // Only send changed fields
      const changedFields = {};
      Object.keys(settings).forEach(key => {
        if (settings[key] !== originalSettings[key]) {
          changedFields[key] = settings[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        setMessage('Tidak ada perubahan untuk disimpan.');
        setMessageType('info');
        setSaving(false);
        return;
      }

      const response = await fetch('http://localhost/web-pesantren/backend/api/save_settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changedFields),
      });
      
      const result = await response.json();
      if (result.success) {
        setMessage('Pengaturan berhasil disimpan!');
        setMessageType('success');
        setOriginalSettings(settings); // Update original settings
        // Refresh data to make sure it's in sync
        setTimeout(() => {
          fetchSettings();
        }, 1000);
      } else {
        setMessage('Error: ' + result.message);
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Please try again.');
      setMessageType('danger');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setMessage('Form telah direset ke data asli.');
    setMessageType('info');
  };

  const getChangedFields = () => {
    const changed = {};
    Object.keys(settings).forEach(key => {
      if (settings[key] !== originalSettings[key]) {
        changed[key] = {
          old: originalSettings[key],
          new: settings[key]
        };
      }
    });
    return changed;
  };

  const handleDeleteField = (fieldName) => {
    setFieldToDelete(fieldName);
    setShowDeleteModal(true);
  };

  const confirmDeleteField = async () => {
    try {
      setSaving(true);
      
      // For file fields, also clear the file input
      if (fieldToDelete === 'logo_web' && logoInputRef.current) {
        logoInputRef.current.value = '';
      }
      if (fieldToDelete === 'psb_pdf' && pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
      
      // Set field value to empty string (null)
      const updatedSettings = { ...settings, [fieldToDelete]: '' };
      setSettings(updatedSettings);
      
      console.log('Sending to database:', { [fieldToDelete]: '' }); // Debug log
      
      // Save the null value to database
      const response = await fetch('http://localhost/web-pesantren/backend/api/save_settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldToDelete]: '' }),
      });
      
      const result = await response.json();
      console.log('Database response:', result); // Debug log
      
      if (result.success) {
        setMessage(`Field ${fieldToDelete} berhasil dikosongkan!`);
        setMessageType('success');
        setShowDeleteModal(false);
        setFieldToDelete('');
        // Update original settings to reflect the change
        setOriginalSettings(updatedSettings);
      } else {
        setMessage('Error: ' + result.message);
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Error clearing field:', error);
      setMessage('Error clearing field. Please try again.');
      setMessageType('danger');
    } finally {
      setSaving(false);
    }
  };

  const handleClearField = (fieldName) => {
    setSettings({ ...settings, [fieldName]: '' });
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pengaturan Web</h2>
        <div>
          <Button variant="outline-secondary" onClick={fetchSettings} disabled={loading}>
            <FaSync /> Refresh
          </Button>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Memuat data pengaturan...</p>
        </div>
      )}

      {/* Changed Fields Preview */}
      <Form>
        {/* Judul dan Tagline */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Judul Web</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('judul_web')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('judul_web')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="text"
                name="judul_web"
                value={settings.judul_web || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Tagline Web</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('tagline_web')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('tagline_web')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="text"
                name="tagline_web"
                value={settings.tagline_web || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Caption dan Tentang Web */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Caption Web</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('caption_web')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('caption_web')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                as="textarea"
                rows={3}
                name="caption_web"
                value={settings.caption_web || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Tentang Web</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('tentang_web')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('tentang_web')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                as="textarea"
                rows={3}
                name="tentang_web"
                value={settings.tentang_web || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Footer dan Logo */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Footer Web</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('footer_web')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('footer_web')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="text"
                name="footer_web"
                value={settings.footer_web || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Logo Web</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={handleClearImageUpload}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('logo_web')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                ref={logoInputRef}
              />
              {settings.logo_web && (
                <div className="mt-2">
                  <small className="text-muted">Logo saat ini:</small>
                  <div className="mt-1">
                    <img 
                      src={settings.logo_web} 
                      alt="Current Logo" 
                      style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Informasi Instansi */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Nama Instansi</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('nama_instansi')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('nama_instansi')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="text"
                name="nama_instansi"
                value={settings.nama_instansi || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Nama Pimpinan</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('nama_pimpinan')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('nama_pimpinan')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="text"
                name="nama_pimpinan"
                value={settings.nama_pimpinan || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* NIK dan Alamat Instansi */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>NIK Pimpinan</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('nik_pimpinan')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('nik_pimpinan')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="text"
                name="nik_pimpinan"
                value={settings.nik_pimpinan || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Alamat Instansi</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('alamat')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('alamat')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                as="textarea"
                rows={3}
                name="alamat"
                value={settings.alamat || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Kontak */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Email Instansi</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('email_instansi')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('email_instansi')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="email"
                name="email_instansi"
                value={settings.email_instansi || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Telepon</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('telp')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('telp')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="text"
                name="telp"
                value={settings.telp || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>WhatsApp</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('whatsapp')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('whatsapp')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="text"
                name="whatsapp"
                value={settings.whatsapp || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Website dan PSB PDF */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Website</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => handleClearField('website')}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('website')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control
                type="url"
                name="website"
                value={settings.website || ''}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>PSB PDF</Form.Label>
                <div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={handleClearPdfUpload}
                    className="me-1"
                  >
                    <FaEdit /> Clear
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteField('psb_pdf')}
                  >
                    <FaTrash /> Kosongkan
                  </Button>
                </div>
              </div>
              <Form.Control 
                type="file" 
                accept=".pdf" 
                onChange={handlePdfUpload}
                ref={pdfInputRef}
              />
              {settings.psb_pdf && (
                <div className="mt-2">
                  <small className="text-muted">PDF saat ini: </small>
                  <span className="badge bg-success">File tersedia</span>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            onClick={handleSaveSettings}
            disabled={saving || Object.keys(getChangedFields()).length === 0}
          >
            {saving ? <Spinner animation="border" size="sm" className="me-2" /> : <FaSave className="me-2" />}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
          
          <Button 
            variant="outline-secondary" 
            onClick={handleReset}
            disabled={Object.keys(getChangedFields()).length === 0}
          >
            Reset
          </Button>
        </div>
      </Form>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Kosongkan Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apakah Anda yakin ingin mengosongkan field <strong>{fieldToDelete}</strong>?</p>
          <p className="text-warning">
            <small>
              <strong>Info:</strong> Field akan dikosongkan dan disimpan ke database.
            </small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteField}
            disabled={saving}
          >
            {saving ? <Spinner animation="border" size="sm" className="me-2" /> : <FaTrash className="me-2" />}
            {saving ? 'Mengosongkan...' : 'Kosongkan'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PengaturanWeb;
