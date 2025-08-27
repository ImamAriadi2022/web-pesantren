import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

const LP_DataSantri = () => {
  const [santriData, setSantriData] = useState([]);
  const [kelasData, setKelasData] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  // Fetch data kelas untuk filter
  const fetchKelasData = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/kelas/getAllClass.php');
      const json = await res.json();
      if (json.success && json.data) {
        setKelasData(json.data);
        console.log('Kelas data loaded for filter:', json.data.length, 'records');
      }
    } catch (error) {
      console.error('Error fetching kelas data:', error);
      setKelasData([]);
    }
  };

  // Fetch data santri dari backend
  const fetchSantriData = async () => {
    try {
      console.log('Fetching santri data for public view...');
      const res = await fetch('http://localhost/web-pesantren/backend/api/santri/getSantri.php');
      const json = await res.json();
      console.log('Public Santri API Response:', json);
      
      if (json.success && json.data) {
        setSantriData(json.data);
        console.log('Santri data loaded for public:', json.data.length, 'records');
      } else {
        console.error('API returned error:', json.message);
        setSantriData([]);
      }
    } catch (error) {
      console.error('Error fetching santri data:', error);
      setSantriData([]);
    }
  };

  useEffect(() => {
    fetchSantriData();
    fetchKelasData();
  }, []);

  const filteredSantri = santriData.filter(santri => {
    const matchesKelas = filter === '' || santri.kelas_id === filter || santri.nama_kelas?.includes(filter);
    const matchesSearch = search === '' || 
      (santri.nama || '').toLowerCase().includes(search.toLowerCase()) ||
      (santri.nis || '').toLowerCase().includes(search.toLowerCase());
    
    return matchesKelas && matchesSearch;
  });

  return (
    <section style={{ padding: '3rem 0', minHeight: '80vh' }}>
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
                    <option value="">Semua Kelas</option>
                    {kelasData.map(kelas => (
                      <option key={kelas.id} value={kelas.id}>{kelas.nama_kelas}</option>
                    ))}
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
            {filteredSantri.length > 0 ? (
              filteredSantri.map(santri => (
                <Col md={4} key={santri.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    {santri.foto && (
                      <div className="text-center pt-3">
                        <img 
                          src={`http://localhost/web-pesantren/backend/api/santri/${santri.foto}`} 
                          alt={santri.nama} 
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover', 
                            borderRadius: '50%',
                            border: '3px solid #006400'
                          }} 
                        />
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title style={{ color: '#006400', fontSize: '1.1rem', textAlign: 'center' }}>
                        {santri.nama}
                      </Card.Title>
                      <Card.Text style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                        <strong>Kelas:</strong> {santri.nama_kelas || 'Belum ditentukan'}<br />
                        <strong>Jenis Kelamin:</strong> {santri.jenis_kelamin}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col md={12}>
                <div className="text-center p-5">
                  <h5 style={{ color: '#6c757d' }}>Tidak ada data santri yang ditemukan</h5>
                  <p>Data santri akan ditampilkan setelah tersedia di database.</p>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Container>
    </section>
  );
}

export default LP_DataSantri;
