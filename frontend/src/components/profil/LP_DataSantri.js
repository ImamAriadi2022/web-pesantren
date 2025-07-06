import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

const LP_DataSantri = () => {
  const [santriData, setSantriData] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  // Fetch data santri dari backend
  const fetchSantriData = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/public/getSantriPublic.php');
      const json = await res.json();
      if (json.success) setSantriData(json.data);
    } catch (error) {
      console.error('Error fetching santri data:', error);
    }
  };

  useEffect(() => {
    fetchSantriData();
  }, []);

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
                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="5">Kelas 5</option>
                    <option value="6">Kelas 6</option>
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