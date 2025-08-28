import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { FaBook, FaCalendarAlt, FaEdit, FaMapMarkerAlt, FaPhone, FaTrash, FaUser } from 'react-icons/fa';
import { useAuth } from '../../utils/auth';

const Profile = () => {
  const { ustadzId, currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalProfile, setModalProfile] = useState({
    id: null,
    foto: '',
    nama: '',
    nip: '',
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    mata_pelajaran: '',
    alamat: '',
    no_hp: '',
    nomor_hp: '',
    email: '',
    status: 'Aktif'
  });

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    try {
      console.log('Fetching profile data...');
      console.log('ustadzId:', ustadzId);
      console.log('currentUser:', currentUser);
      
      const url = ustadzId 
        ? `http://localhost/web-pesantren/backend/api/ustadz/getProfile.php?ustadz_id=${ustadzId}`
        : `http://localhost/web-pesantren/backend/api/ustadz/getProfile.php?user_id=${currentUser.id}`;
      
      console.log('API URL:', url);
      
      const res = await fetch(url);
      const json = await res.json();
      console.log('API Response:', json);
      
      if (json.success && json.data) {
        setProfile(json.data);
        console.log('Profile data loaded:', json.data);
      } else {
        console.error('API returned error:', json.message);
        setError(json.message || 'Gagal memuat data profil');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Terjadi kesalahan saat memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [ustadzId, currentUser]);

  const handleEdit = () => {
    if (profile) {
      setModalProfile({
        ...profile,
        nomor_hp: profile.no_hp || profile.nomor_hp,
        tanggal_lahir: profile.tanggal_lahir ? profile.tanggal_lahir.split(' ')[0] : ''
      });
      setShowEditModal(true);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!modalProfile.nama || !modalProfile.nip) {
        setError('Nama dan NIP wajib diisi');
        setTimeout(() => setError(''), 3000);
        return;
      }
      
      // Prepare data for API
      const apiData = {
        ...modalProfile,
        jenisKelamin: modalProfile.jenis_kelamin,
        tanggalLahir: modalProfile.tanggal_lahir,
        telepon: modalProfile.nomor_hp || modalProfile.no_hp,
        tempat_lahir: modalProfile.tempat_lahir,
        mata_pelajaran: modalProfile.mata_pelajaran,
        email: modalProfile.email
      };

      console.log('Saving profile data:', apiData);
      
      const res = await fetch('http://localhost/web-pesantren/backend/api/ustadz/saveUstadz.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });
      const json = await res.json();
      console.log('Save response:', json);
      
      if (json.success) {
        setSuccess(json.message || 'Profil berhasil diperbarui!');
        setShowEditModal(false);
        fetchProfile(); // Refresh data
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(json.message || 'Gagal memperbarui profil');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Terjadi kesalahan saat menyimpan data');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setLoading(true);
      
      const res = await fetch('http://localhost/web-pesantren/backend/api/ustadz/deleteUstadz.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id })
      });
      const json = await res.json();
      
      if (json.success) {
        setSuccess('Profil berhasil dihapus!');
        setShowDeleteModal(false);
        // Redirect or handle post-delete logic
        setTimeout(() => {
          // You might want to redirect to login or another page
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(json.message || 'Gagal menghapus profil');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Terjadi kesalahan saat menghapus data');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Aktif': { variant: 'success', text: 'Aktif' },
      'aktif': { variant: 'success', text: 'Aktif' },
      'Tidak Aktif': { variant: 'danger', text: 'Tidak Aktif' },
      'nonaktif': { variant: 'danger', text: 'Tidak Aktif' },
      'cuti': { variant: 'warning', text: 'Cuti' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status || 'Aktif' };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  if (loading && !profile) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Memuat data profil...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: '#006400', marginBottom: 0 }}>Profil Saya</h2>
            <p className="text-muted mb-0">Kelola informasi profil Anda</p>
          </div>

          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

          {profile ? (
            <Card className="shadow-sm">
              <Card.Header style={{ backgroundColor: '#006400', color: 'white' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <FaUser className="me-2" />
                    Informasi Profil
                  </h5>
                  <div>
                    <Button variant="warning" size="sm" className="me-2" onClick={handleEdit}>
                      <FaEdit className="me-1" />
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                      <FaTrash className="me-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="text-center mb-3">
                    {profile.foto ? (
                      <img 
                        src={`http://localhost/web-pesantren/backend/api/ustadz/${profile.foto}`} 
                        alt={profile.nama}
                        style={{ 
                          width: '150px', 
                          height: '150px', 
                          objectFit: 'cover', 
                          borderRadius: '50%',
                          border: '3px solid #006400'
                        }} 
                      />
                    ) : (
                      <div 
                        className="bg-secondary rounded-circle d-flex align-items-center justify-content-center mx-auto"
                        style={{ 
                          width: '150px', 
                          height: '150px', 
                          color: 'white', 
                          fontSize: '48px',
                          border: '3px solid #006400'
                        }}
                      >
                        {profile.nama ? profile.nama.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <h4 className="mt-3 mb-1" style={{ color: '#006400' }}>{profile.nama}</h4>
                    <p className="text-muted mb-2">NIP: {profile.nip}</p>
                    {getStatusBadge(profile.status)}
                  </Col>
                  <Col md={8}>
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td style={{ width: '30%', fontWeight: 'bold' }}>
                            <FaUser className="me-2 text-primary" />
                            Nama Lengkap
                          </td>
                          <td>: {profile.nama || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'bold' }}>
                            <FaUser className="me-2 text-primary" />
                            NIP
                          </td>
                          <td>: {profile.nip || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'bold' }}>
                            <FaPhone className="me-2 text-success" />
                            Nomor HP
                          </td>
                          <td>: {profile.no_hp || profile.nomor_hp || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'bold' }}>
                            <FaBook className="me-2 text-warning" />
                            Mata Pelajaran
                          </td>
                          <td>: {profile.mata_pelajaran || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'bold' }}>
                            <FaMapMarkerAlt className="me-2 text-danger" />
                            Alamat
                          </td>
                          <td>: {profile.alamat || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'bold' }}>
                            <FaCalendarAlt className="me-2 text-info" />
                            Status
                          </td>
                          <td>: {getStatusBadge(profile.status)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center">
                <p className="text-muted">Data profil tidak ditemukan</p>
                <Button variant="primary" onClick={fetchProfile} disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Memuat...
                    </>
                  ) : (
                    'Muat Ulang'
                  )}
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nama Lengkap <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nama Lengkap"
                    value={modalProfile.nama}
                    onChange={(e) => setModalProfile({ ...modalProfile, nama: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>NIP <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nomor Induk Pegawai"
                    value={modalProfile.nip}
                    onChange={(e) => setModalProfile({ ...modalProfile, nip: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nomor HP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nomor HP"
                    value={modalProfile.nomor_hp || modalProfile.no_hp}
                    onChange={(e) => setModalProfile({ ...modalProfile, nomor_hp: e.target.value, no_hp: e.target.value })}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Mata Pelajaran</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mata Pelajaran yang Diampu"
                    value={modalProfile.mata_pelajaran}
                    onChange={(e) => setModalProfile({ ...modalProfile, mata_pelajaran: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Alamat</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Alamat Lengkap"
                value={modalProfile.alamat}
                onChange={(e) => setModalProfile({ ...modalProfile, alamat: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={modalProfile.status}
                onChange={(e) => setModalProfile({ ...modalProfile, status: e.target.value })}
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="cuti">Cuti</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Foto Profil</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setModalProfile({ ...modalProfile, foto: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {modalProfile.foto && (
                <img 
                  src={modalProfile.foto.startsWith('data:') ? modalProfile.foto : `http://localhost/web-pesantren/backend/api/ustadz/${modalProfile.foto}`}
                  alt="Preview" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    marginTop: '0.5rem'
                  }} 
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSaveProfile} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus Profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apakah Anda yakin ingin menghapus profil ini? Tindakan ini tidak dapat dibatalkan.</p>
          <div className="alert alert-warning">
            <strong>Peringatan:</strong> Menghapus profil akan menghapus semua data yang terkait dan Anda akan keluar dari sistem.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteProfile} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {loading ? 'Menghapus...' : 'Ya, Hapus Profil'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
