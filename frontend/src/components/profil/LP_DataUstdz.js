import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

const LP_DataUstdz = () => {
  const [ustdzData, setUstdzData] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  // Fetch data ustadz dari backend
  const fetchUstdzData = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/public/getUstadzPublic.php');
      const json = await res.json();
      if (json.success) setUstdzData(json.data);
    } catch (error) {
      console.error('Error fetching ustadz data:', error);
    }
  };

  useEffect(() => {
    fetchUstdzData();
  }, []);

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
            {filteredUstdz.length > 0 ? (
              filteredUstdz.map(ustdz => (
                <Col md={4} key={ustdz.id}>
                  <Card className="mb-4 shadow-sm">
                    <Card.Body>
                      <Card.Title style={{ color: '#006400' }}>{ustdz.name}</Card.Title>
                      <Card.Text>
                        <strong>Mata Pelajaran:</strong> {ustdz.mataPelajaran}<br />
                        <strong>Umur:</strong> {ustdz.umur} tahun<br />
                        <strong>Alamat:</strong> {ustdz.alamat}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col md={12}>
                <div className="text-center p-5">
                  <h5 style={{ color: '#6c757d' }}>Tidak ada data ustadz yang ditemukan</h5>
                  <p>Data ustadz akan ditampilkan setelah tersedia di database.</p>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Container>
    </section>
  );
}

export default LP_DataUstdz;