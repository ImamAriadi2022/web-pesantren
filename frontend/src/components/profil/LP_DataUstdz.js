import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ustdzData = [
  {
    id: 1,
    name: 'Nama Ustadz 1',
    mataPelajaran: 'Matematika',
    umur: 35,
    alamat: 'Jl. Contoh No. 1'
  },
  {
    id: 2,
    name: 'Nama Ustadzah 2',
    mataPelajaran: 'Bahasa Inggris',
    umur: 30,
    alamat: 'Jl. Contoh No. 2'
  },
  {
    id: 3,
    name: 'Nama Ustadz 3',
    mataPelajaran: 'Fisika',
    umur: 40,
    alamat: 'Jl. Contoh No. 3'
  }
];

const LP_DataUstdz = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const filteredUstdz = ustdzData.filter(ustdz => {
    return (
      (filter === '' || ustdz.mataPelajaran === filter) &&
      (search === '' || ustdz.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <section style={{ padding: '3rem 0', height: '80vh' }}>
      <Container>
        <div className="mb-5">
          <Row>
            <Col md={6} className="text-start">
              <h2>Data Ustadz dan Ustadzah</h2>
              <p>Berikut adalah data dari para ustadz dan ustadzah kami</p>
            </Col>
            <Col md={6} className="text-end">
              <Form className="d-flex justify-content-end">
                <Form.Group controlId="filter" className="me-2">
                  <Form.Control as="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">Filter Mata Pelajaran</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="Fisika">Fisika</option>
                  </Form.Control>
                </Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Cari Ustadz/Ustadzah"
                  className="me-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-success">Cari</Button>
              </Form>
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            {filteredUstdz.map(ustdz => (
              <Col md={4} key={ustdz.id}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{ustdz.name}</Card.Title>
                    <Card.Text>
                      <strong>Mata Pelajaran:</strong> {ustdz.mataPelajaran}<br />
                      <strong>Umur:</strong> {ustdz.umur} tahun<br />
                      <strong>Alamat:</strong> {ustdz.alamat}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  );
}

export default LP_DataUstdz;