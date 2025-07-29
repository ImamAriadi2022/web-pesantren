import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

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
    alamat_instansi: '',
    email_instansi: '',
    telp: '',
    whatsapp: '',
    psb_pdf: ''
  });

  useEffect(() => {
    // Fetch settings from backend
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost/web-pesantren/backend/api/get_settings.php');
        const result = await response.json();
        if (result.success) {
          setSettings(result.data || {
            judul_web: '',
            tagline_web: '',
            caption_web: '',
            tentang_web: '',
            footer_web: '',
            logo_web: '',
            nama_instansi: '',
            nama_pimpinan: '',
            nik_pimpinan: '',
            alamat_instansi: '',
            email_instansi: '',
            telp: '',
            whatsapp: '',
            psb_pdf: ''
          });
        } else {
          // Don't show alert on initial load
          console.error('Error fetching settings:', result.message);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({ ...settings, logo_web: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file tidak boleh lebih dari 3 MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({ ...settings, psb_pdf: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/save_settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <Container>
      <h2>Pengaturan Web</h2>
      <Form>
        {/* Judul dan Tagline */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Judul Web</Form.Label>
              <Form.Control
                type="text"
                name="judul_web" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.judul_web}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Tagline Web</Form.Label>
              <Form.Control
                type="text"
                name="tagline_web" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.tagline_web}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Caption dan Tentang Web */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Caption Web</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="caption_web" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.caption_web}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Tentang Web</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="tentang_web" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.tentang_web}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Footer dan Logo */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Footer Web</Form.Label>
              <Form.Control
                type="text"
                name="footer_web" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.footer_web}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Logo Web</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
            </Form.Group>
          </Col>
        </Row>

        {/* Informasi Instansi */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Nama Instansi</Form.Label>
              <Form.Control
                type="text"
                name="nama_instansi" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.nama_instansi}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Nama Pimpinan</Form.Label>
              <Form.Control
                type="text"
                name="nama_pimpinan" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.nama_pimpinan}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* NIK dan Alamat Instansi */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>NIK Pimpinan</Form.Label>
              <Form.Control
                type="text"
                name="nik_pimpinan" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.nik_pimpinan}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Alamat Instansi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="alamat_instansi" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.alamat_instansi}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Kontak */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Email Instansi</Form.Label>
              <Form.Control
                type="email"
                name="email_instansi" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.email_instansi}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Telepon</Form.Label>
              <Form.Control
                type="text"
                name="telp" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.telp}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>WhatsApp</Form.Label>
              <Form.Control
                type="text"
                name="whatsapp" // Perbaikan: Sesuaikan dengan nama properti di state
                value={settings.whatsapp}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" onClick={handleSaveSettings}>
          Simpan Pengaturan
        </Button>
      </Form>
    </Container>
  );
};

export default PengaturanWeb;