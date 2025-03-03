import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaTrash, FaFilePdf } from 'react-icons/fa';

const KelolaPsb = () => {
  const [psb, setPsb] = useState({
    id: 1,
    tahunAjaran: '2023/2024',
    whatsappPanitia: '08123456789',
    emailPanitia: 'panitia@example.com',
    brosur: 'path/to/brosur1.pdf'
  });

  const [formPsb, setFormPsb] = useState({ ...psb });

  const handleDeletePsb = () => {
    setPsb(null);
    setFormPsb({ id: null, tahunAjaran: '', whatsappPanitia: '', emailPanitia: '', brosur: '' });
  };

  const handleSavePsb = () => {
    setPsb({ ...formPsb, id: 1 });
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormPsb({ ...formPsb, brosur: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="d-flex">
      <div className="w-50 p-3">
        <h2>Kelola PSB</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tahun Ajaran PSB</Form.Label>
            <Form.Control type="text" placeholder="Tahun Ajaran PSB" value={formPsb.tahunAjaran} onChange={(e) => setFormPsb({ ...formPsb, tahunAjaran: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>WhatsApp Panitia</Form.Label>
            <Form.Control type="text" placeholder="WhatsApp Panitia" value={formPsb.whatsappPanitia} onChange={(e) => setFormPsb({ ...formPsb, whatsappPanitia: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email Panitia</Form.Label>
            <Form.Control type="email" placeholder="Email Panitia" value={formPsb.emailPanitia} onChange={(e) => setFormPsb({ ...formPsb, emailPanitia: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Brosur Pendaftaran (PDF)</Form.Label>
            <Form.Control type="file" accept="application/pdf" onChange={handlePdfUpload} />
            {formPsb.brosur && <p className="mt-2">Brosur telah diunggah</p>}
          </Form.Group>
          <Button variant="primary" onClick={handleSavePsb}>Simpan</Button>
          <Button variant="danger" className="ms-2" onClick={handleDeletePsb}><FaTrash /> Hapus</Button>
        </Form>
      </div>
      <div className="w-50 p-3">
        <h2>Pratinjau Brosur</h2>
        {formPsb.brosur && (
          <object
            data={formPsb.brosur}
            type="application/pdf"
            width="100%"
            height="500px"
          >
            <p>Pratinjau brosur tidak dapat ditampilkan. <a href={formPsb.brosur} target="_blank" rel="noopener noreferrer">Unduh PDF</a></p>
          </object>
        )}
      </div>
    </div>
  );
};

export default KelolaPsb;