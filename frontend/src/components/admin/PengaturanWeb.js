import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const PengaturanWeb = () => {
  const [settings, setSettings] = useState({
    judulWeb: '',
    taglineWeb: '',
    captionWeb: '',
    tentangWeb: '',
    footerWeb: '',
    logoWeb: '',
    namaInstansi: '',
    namaPimpinan: '',
    nikPimpinan: '',
    alamatInstansi: '',
    emailInstansi: '',
    telp: '',
    whatsapp: '',
    psbPdf: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({ ...settings, logoWeb: reader.result });
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
      setSettings({ ...settings, psbPdf: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = () => {
    // Simpan pengaturan ke server atau local storage
    alert('Pengaturan berhasil disimpan');
  };

  return (
    <Container>
      <h2>Pengaturan Web</h2>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Judul Web</Form.Label>
              <Form.Control type="text" name="judulWeb" value={settings.judulWeb} onChange={handleChange} className="input-box" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Tagline Web</Form.Label>
              <Form.Control type="text" name="taglineWeb" value={settings.taglineWeb} onChange={handleChange} className="input-box" />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Caption Web</Form.Label>
          <Form.Control type="text" name="captionWeb" value={settings.captionWeb} onChange={handleChange} className="input-box" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tentang Web</Form.Label>
          <Form.Control as="textarea" rows={3} name="tentangWeb" value={settings.tentangWeb} onChange={handleChange} className="input-box" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Footer Web</Form.Label>
          <Form.Control type="text" name="footerWeb" value={settings.footerWeb} onChange={handleChange} className="input-box" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Logo Web</Form.Label>
          <Form.Control type="file" onChange={handleImageUpload} className="input-box" />
          {settings.logoWeb && <img src={settings.logoWeb} alt="Logo" width="100" height="100" className="mt-2" />}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Upload PDF PSB (Max 3 MB)</Form.Label>
          <Form.Control type="file" accept="application/pdf" onChange={handlePdfUpload} className="input-box" />
          {settings.psbPdf && <p>File PDF PSB telah diunggah</p>}
        </Form.Group>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Nama Instansi</Form.Label>
              <Form.Control type="text" name="namaInstansi" value={settings.namaInstansi} onChange={handleChange} className="input-box" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Nama Pimpinan</Form.Label>
              <Form.Control type="text" name="namaPimpinan" value={settings.namaPimpinan} onChange={handleChange} className="input-box" />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>NIK Pimpinan</Form.Label>
          <Form.Control type="text" name="nikPimpinan" value={settings.nikPimpinan} onChange={handleChange} className="input-box" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Alamat Instansi</Form.Label>
          <Form.Control type="text" name="alamatInstansi" value={settings.alamatInstansi} onChange={handleChange} className="input-box" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email Instansi</Form.Label>
          <Form.Control type="email" name="emailInstansi" value={settings.emailInstansi} onChange={handleChange} className="input-box" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Telepon</Form.Label>
          <Form.Control type="text" name="telp" value={settings.telp} onChange={handleChange} className="input-box" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>WhatsApp</Form.Label>
          <Form.Control type="text" name="whatsapp" value={settings.whatsapp} onChange={handleChange} className="input-box" />
        </Form.Group>
        <Button variant="primary" onClick={handleSaveSettings}>Simpan Pengaturan</Button>
      </Form>
      <h3 className="mt-5">Pratinjau Pengaturan</h3>
      <div className="preview-box text-start p-3 mt-3">
        <h4><strong>Judul: </strong>{settings.judulWeb}</h4>
        <p><strong>Tagline:</strong> {settings.taglineWeb}</p>
        <p><strong>Caption:</strong> {settings.captionWeb}</p>
        <p><strong>Tentang:</strong> {settings.tentangWeb}</p>
        <p><strong>Footer:</strong> {settings.footerWeb}</p>
        <strong>Logo Web </strong>
        {settings.logoWeb &&  <img src={settings.logoWeb} alt="Logo" width="100" height="100" />}
        <p><strong>Nama Instansi:</strong> {settings.namaInstansi}</p>
        <p><strong>Nama Pimpinan:</strong> {settings.namaPimpinan}</p>
        <p><strong>NIK Pimpinan:</strong> {settings.nikPimpinan}</p>
        <p><strong>Alamat Instansi:</strong> {settings.alamatInstansi}</p>
        <p><strong>Email Instansi:</strong> {settings.emailInstansi}</p>
        <p><strong>Telepon:</strong> {settings.telp}</p>
        <p><strong>WhatsApp:</strong> {settings.whatsapp}</p>
        {settings.psbPdf && <p>File PDF PSB telah diunggah</p>}
      </div>
    </Container>
  );
};

export default PengaturanWeb;