import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Image, ListGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../utils/auth';

const Profile = () => {
  const { santriId, currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    nama: '',
    nis: '',
    jenis_kelamin: '',
    tanggal_lahir: '',
    tempat_lahir: '',
    alamat: '',
    no_hp: '',
    nama_wali: '',
    no_hp_wali: '',
    foto: ''
  });
  const [kelas, setKelas] = useState([]);

  useEffect(() => {
    fetchProfileData();
    fetchKelas();
  }, []);

  const fetchProfileData = async () => {
    if (!santriId) {
      setError('Data santri tidak ditemukan. Silakan login ulang.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://teralab.my.id/backend/api/santri/getProfile.php?santri_id=${santriId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setProfileData(result.data);
        // Set data untuk edit
        setEditData({
          nama: result.data.nama || '',
          nis: result.data.nis || '',
          jenis_kelamin: result.data.jenis_kelamin || '',
          tanggal_lahir: result.data.tanggal_lahir || '',
          tempat_lahir: result.data.tempat_lahir || '',
          alamat: result.data.alamat || '',
          no_hp: result.data.no_hp || '',
          nama_wali: result.data.nama_wali || '',
          no_hp_wali: result.data.no_hp_wali || '',
          foto: result.data.foto || '',
          kelas_id: result.data.kelas_id || ''
        });
      } else {
        setError(result.message || 'Gagal mengambil data profil');
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Terjadi kesalahan saat mengambil data profil');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data kelas untuk dropdown
  const fetchKelas = async () => {
    try {
      const res = await fetch('https://teralab.my.id/backend/api/kelas/getAllClass.php');
      const json = await res.json();
      if (json.success && json.data) {
        setKelas(json.data);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
      setKelas([]);
    }
  };

  // Handle edit santri
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/santri/updateSantri.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editData,
          id: santriId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Profil berhasil diperbarui!');
        setShowEditModal(false);
        fetchProfileData(); // Refresh data
      } else {
        alert(result.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat memperbarui profil');
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('https://teralab.my.id/backend/api/santri/deleteSantri.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: santriId })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Akun berhasil dihapus!');
        // Redirect to login or home page
        window.location.href = '/login';
      } else {
        alert(result.message || 'Gagal menghapus akun');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Terjadi kesalahan saat menghapus akun');
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error!</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!profileData) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Informasi</Alert.Heading>
        <p>Data profil tidak ditemukan.</p>
      </Alert>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Profil Santri</h2>
        <div>
          <Button 
            variant="warning" 
            className="me-2" 
            onClick={handleEditProfile}
          >
            <FaEdit className="me-1" /> Edit Profil
          </Button>
          <Button 
            variant="danger" 
            onClick={() => setShowDeleteModal(true)}
          >
            <FaTrash className="me-1" /> Hapus Akun
          </Button>
        </div>
      </div>
      <Row className="mt-4">
        <Col md={4} className="text-center">
          <Image 
            src={profileData.foto || '/landing/masjid1.jpg'} 
            roundedCircle 
            fluid 
            style={{ width: '200px', height: '200px', objectFit: 'cover' }} 
          />
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Data Pribadi</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Nama Lengkap:</strong> 
                  <span>{profileData.nama}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>NIS:</strong> 
                  <span>{profileData.nis}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Jenis Kelamin:</strong> 
                  <span>{profileData.jenis_kelamin}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Tempat Lahir:</strong> 
                  <span>{profileData.tempat_lahir || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Tanggal Lahir:</strong> 
                  <span>{formatDate(profileData.tanggal_lahir)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Alamat:</strong> 
                  <span>{profileData.alamat || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>No HP:</strong> 
                  <span>{profileData.no_hp || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Status:</strong> 
                  <span>
                    <span className={`badge ${
                      profileData.status === 'Aktif' ? 'bg-success' :
                      profileData.status === 'Lulus' ? 'bg-primary' :
                      profileData.status === 'Keluar' ? 'bg-danger' : 'bg-secondary'
                    }`}>
                      {profileData.status}
                    </span>
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {profileData.kelas && (
            <Card className="mt-3">
              <Card.Header>
                <h5 className="mb-0">Data Akademik</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Kelas:</strong> 
                    <span>{profileData.kelas}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {profileData.asrama && (
            <Card className="mt-3">
              <Card.Header>
                <h5 className="mb-0">Data Asrama</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Asrama:</strong> 
                    <span>{profileData.asrama}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Nomor Kamar:</strong> 
                    <span>{profileData.nomor_kamar || '-'}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          <Card className="mt-3">
            <Card.Header>
              <h5 className="mb-0">Data Wali</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Nama Wali:</strong> 
                  <span>{profileData.nama_wali || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>No HP Wali:</strong> 
                  <span>{profileData.no_hp_wali || '-'}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Edit Profile */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Profil Santri</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Foto Profil</Form.Label>
              <Form.Control type="file" onChange={handleImageUpload} accept="image/*" />
              {editData.foto && (
                <img 
                  src={editData.foto.startsWith('data:') ? editData.foto : `https://teralab.my.id/backend/api/santri/${editData.foto}`} 
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
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={editData.nama} 
                onChange={(e) => setEditData({ ...editData, nama: e.target.value })} 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>NIS <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={editData.nis} 
                onChange={(e) => setEditData({ ...editData, nis: e.target.value })} 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Kelamin <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                value={editData.jenis_kelamin} 
                onChange={(e) => setEditData({ ...editData, jenis_kelamin: e.target.value })}
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tempat Lahir</Form.Label>
              <Form.Control 
                type="text" 
                value={editData.tempat_lahir} 
                onChange={(e) => setEditData({ ...editData, tempat_lahir: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Lahir</Form.Label>
              <Form.Control 
                type="date" 
                value={editData.tanggal_lahir} 
                onChange={(e) => setEditData({ ...editData, tanggal_lahir: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alamat</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={editData.alamat} 
                onChange={(e) => setEditData({ ...editData, alamat: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>No HP</Form.Label>
              <Form.Control 
                type="text" 
                value={editData.no_hp} 
                onChange={(e) => setEditData({ ...editData, no_hp: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Wali</Form.Label>
              <Form.Control 
                type="text" 
                value={editData.nama_wali} 
                onChange={(e) => setEditData({ ...editData, nama_wali: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>No HP Wali</Form.Label>
              <Form.Control 
                type="text" 
                value={editData.no_hp_wali} 
                onChange={(e) => setEditData({ ...editData, no_hp_wali: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kelas</Form.Label>
              <Form.Select 
                value={editData.kelas_id || ''} 
                onChange={(e) => setEditData({ ...editData, kelas_id: e.target.value })}
              >
                <option value="">Pilih Kelas</option>
                {kelas.map(k => (
                  <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            <FaTimes className="me-1" /> Batal
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            <FaSave className="me-1" /> Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Konfirmasi Hapus Akun</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FaTrash className="text-danger mb-3" size={48} />
            <h5>Apakah Anda yakin ingin menghapus akun ini?</h5>
            <p className="text-muted">
              Tindakan ini tidak dapat dibatalkan. Semua data profil dan riwayat akan dihapus permanen.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            <FaTimes className="me-1" /> Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            <FaTrash className="me-1" /> Ya, Hapus Akun
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
