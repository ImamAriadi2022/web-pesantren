import { useEffect, useState } from 'react';
import { Col, Container, Image, ListGroup, Row } from 'react-bootstrap';

const Profile = () => {
  const [pengajar, setPengajar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data profil pengajar dari backend
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/ustadz/getProfile.php?user_id=2');
      const json = await res.json();
      if (json.success) {
        setPengajar(json.data);
      } else {
        // Fallback data jika belum ada di database
        setPengajar({
          id: 1,
          nama: 'Ustadz 1',
          nik: '1987654321',
          bidang_keahlian: 'Matematika',
          alamat: 'Jl. Pesantren No. 1',
          telepon: '081234567890',
          email: 'ustadz1@example.com',
          foto: '/landing/masjid1.jpg'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Data fallback
      setPengajar({
        id: 1,
        nama: 'Ustadz 1',
        nik: '1987654321',
        bidang_keahlian: 'Matematika',
        alamat: 'Jl. Pesantren No. 1',
        telepon: '081234567890',
        email: 'ustadz1@example.com',
        foto: '/landing/masjid1.jpg'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pengajar) {
    return <div>Data profil tidak ditemukan.</div>;
  }

  return (
    <Container>
      <h2>Profil Pengajar</h2>
      <Row className="mt-4">
        <Col md={4} className="text-center">
          <Image src={pengajar.foto} roundedCircle fluid style={{ width: '200px', height: '200px' }} />
        </Col>
        <Col md={8} className='text-start'>
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Nama Pengajar:</strong> {pengajar.nama}</ListGroup.Item>
            <ListGroup.Item><strong>NIK:</strong> {pengajar.nik}</ListGroup.Item>
            <ListGroup.Item><strong>Bidang Keahlian:</strong> {pengajar.bidang_keahlian}</ListGroup.Item>
            <ListGroup.Item><strong>Alamat:</strong> {pengajar.alamat}</ListGroup.Item>
            <ListGroup.Item><strong>Telepon:</strong> {pengajar.telepon}</ListGroup.Item>
            <ListGroup.Item><strong>Email:</strong> {pengajar.email}</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
