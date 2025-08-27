import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaTrash, FaFilePdf } from 'react-icons/fa';

const KelolaPsb = () => {
  const [psb, setPsb] = useState(null);
  const [formPsb, setFormPsb] = useState({ 
    id: null, 
    tahunAjaran: '', 
    whatsappPanitia: '', 
    emailPanitia: '', 
    brosur: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPsbData();
  }, []);

  const fetchPsbData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/get_settings.php');
      const result = await response.json();
      if (result.success && result.data) {
        const psbData = {
          id: 1,
          tahunAjaran: result.data.tahun_ajaran || '',
          whatsappPanitia: result.data.whatsapp || '',
          emailPanitia: result.data.email_instansi || '',
          brosur: result.data.psb_pdf || ''
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
      const response = await fetch('http://localhost/web-pesantren/backend/api/save_settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tahun_ajaran: '',
          whatsapp: '',
          email_instansi: '',
          psb_pdf: ''
        })
      });
      const result = await response.json();
      if (result.success) {
        setPsb(null);
        setFormPsb({ id: null, tahunAjaran: '', whatsappPanitia: '', emailPanitia: '', brosur: '' });
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
    if (!formPsb.tahunAjaran || !formPsb.whatsappPanitia || !formPsb.emailPanitia) {
      setError('Semua field wajib diisi');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/save_settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tahun_ajaran: formPsb.tahunAjaran,
          whatsapp: formPsb.whatsappPanitia,
          email_instansi: formPsb.emailPanitia,
          psb_pdf: formPsb.brosur
        })
      });
      const result = await response.json();
      if (result.success) {
        setPsb({ ...formPsb, id: 1 });
        setSuccess('Data PSB berhasil disimpan');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Gagal menyimpan data PSB');
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
        
        {loading && <Spinner animation="border" className="mb-3" />}
        
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {success && <Alert variant="success" className="mb-3">{success}</Alert>}
        
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
