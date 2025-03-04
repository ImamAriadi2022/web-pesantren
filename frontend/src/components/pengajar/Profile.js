import React, { useState } from 'react';
import { Container, Row, Col, Image, ListGroup } from 'react-bootstrap';

const Profile = () => {
  const [pengajar] = useState({
    id: 1,
    namaPengajar: 'Ustadz 1',
    nip: '1987654321',
    mataPelajaran: 'Matematika',
    alamat: 'Jl. Pesantren No. 1',
    telepon: '081234567890',
    email: 'ustadz1@example.com',
    foto: '/landing/masjid1.jpg', // Ganti dengan path foto profil pengajar
  });

  return (
    <Container>
      <h2>Profil Pengajar</h2>
      <Row className="mt-4">
        <Col md={4} className="text-center">
          <Image src={pengajar.foto} roundedCircle fluid style={{ width: '200px', height: '200px' }} />
        </Col>
        <Col md={8} className='text-start'>
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Nama Pengajar:</strong> {pengajar.namaPengajar}</ListGroup.Item>
            <ListGroup.Item><strong>NIP:</strong> {pengajar.nip}</ListGroup.Item>
            <ListGroup.Item><strong>Mata Pelajaran:</strong> {pengajar.mataPelajaran}</ListGroup.Item>
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