import { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, Image, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useAuth } from '../../utils/auth';

const Profile = () => {
  const { santriId, currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    if (!santriId) {
      setError('Data santri tidak ditemukan. Silakan login ulang.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost/web-pesantren/backend/api/santri/getProfile.php?santri_id=${santriId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setProfileData(result.data);
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
      <h2>Profil Santri</h2>
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
                  <strong>Tanggal Lahir:</strong> 
                  <span>{formatDate(profileData.tanggal_lahir)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Asal Sekolah:</strong> 
                  <span>{profileData.asal_sekolah || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Alamat:</strong> 
                  <span>{profileData.alamat || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Telepon:</strong> 
                  <span>{profileData.telepon || '-'}</span>
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
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Tanggal Masuk:</strong> 
                  <span>{formatDate(profileData.tanggal_masuk)}</span>
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
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Wali Kelas:</strong> 
                    <span>{profileData.wali_kelas || '-'}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Tahun Ajaran:</strong> 
                    <span>{profileData.tahun_ajaran || '-'}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Semester:</strong> 
                    <span>{profileData.semester || '-'}</span>
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
                  <strong>Pekerjaan Wali:</strong> 
                  <span>{profileData.pekerjaan_wali || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Alamat Wali:</strong> 
                  <span>{profileData.alamat_wali || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Telepon Wali:</strong> 
                  <span>{profileData.telepon_wali || '-'}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
