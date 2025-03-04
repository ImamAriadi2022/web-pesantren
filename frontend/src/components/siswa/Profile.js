import React, { useState } from 'react';
import { Container, Row, Col, Image, ListGroup } from 'react-bootstrap';

const Profile = () => {
  const [siswa] = useState({
    id: 1,
    namaSiswa: 'Santri 1',
    nisn: '1234567890',
    kelas: '10A',
    waliKelas: 'Ustadz 1',
    semester: 'Ganjil',
    waliSiswa: 'Orang Tua 1',
    alamat: 'Jl. Pesantren No. 1',
    telepon: '081234567890',
    email: 'santri1@example.com',
    foto: '/landing/masjid1.jpg', // Ganti dengan path foto profil siswa
  });

  return (
    <Container>
      <h2>Profil Siswa</h2>
      <Row className="mt-4">
        <Col md={4} className="text-center">
          <Image src={siswa.foto} roundedCircle fluid style={{ width: '200px', height: '200px' }} />
        </Col>
        <Col md={8} className='text-start'>
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Nama Siswa:</strong> {siswa.namaSiswa}</ListGroup.Item>
            <ListGroup.Item><strong>NISN:</strong> {siswa.nisn}</ListGroup.Item>
            <ListGroup.Item><strong>Kelas:</strong> {siswa.kelas}</ListGroup.Item>
            <ListGroup.Item><strong>Wali Kelas:</strong> {siswa.waliKelas}</ListGroup.Item>
            <ListGroup.Item><strong>Semester:</strong> {siswa.semester}</ListGroup.Item>
            <ListGroup.Item><strong>Wali Siswa:</strong> {siswa.waliSiswa}</ListGroup.Item>
            <ListGroup.Item><strong>Alamat:</strong> {siswa.alamat}</ListGroup.Item>
            <ListGroup.Item><strong>Telepon:</strong> {siswa.telepon}</ListGroup.Item>
            <ListGroup.Item><strong>Email:</strong> {siswa.email}</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;