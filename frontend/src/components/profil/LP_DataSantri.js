import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const santriData = [
  {
    id: 1,
    name: 'Nama Santri 1',
    kelas: 'X',
    umur: 15,
    alamat: 'Jl. Contoh No. 1'
  },
  {
    id: 2,
    name: 'Nama Santri 2',
    kelas: 'XI',
    umur: 16,
    alamat: 'Jl. Contoh No. 2'
  },
  {
    id: 3,
    name: 'Nama Santri 3',
    kelas: 'XII',
    umur: 17,
    alamat: 'Jl. Contoh No. 3'
  }
];

const LP_DataSantri = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const filteredSantri = santriData.filter(santri => {
    return (
      (filter === '' || santri.kelas === filter) &&
      (search === '' || santri.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <section style={{ padding: '3rem 0', height: '80vh' }}>
      <Container>
        <div className="mb-5">
          <Row>
            <Col md={6} className="text-start">
              <h2>Data Santri</h2>
              <p>Berikut adalah data dari para santri kami</p>
            </Col>
            <Col md={6} className="text-end">
              <Form className="d-flex justify-content-end">
                <Form.Group controlId="filter" className="me-2">
                  <Form.Control as="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">Filter Santri</option>
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </Form.Control>
                </Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Cari Santri"
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
            {filteredSantri.map(santri => (
              <Col md={4} key={santri.id}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{santri.name}</Card.Title>
                    <Card.Text>
                      <strong>Kelas:</strong> {santri.kelas}<br />
                      <strong>Umur:</strong> {santri.umur} tahun<br />
                      <strong>Alamat:</strong> {santri.alamat}
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

export default LP_DataSantri;