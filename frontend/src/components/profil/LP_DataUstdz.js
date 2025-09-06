import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

const LP_DataUstdz = () => {
  const [ustdzData, setUstdzData] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch data ustadz dari backend
  const fetchUstdzData = async () => {
    try {
      console.log('Fetching ustadz data for public view...');
      const res = await fetch('https://teralab.my.id/backend/api/ustadz/getUstadz.php');
      const json = await res.json();
      console.log('Public Ustadz API Response:', json);
      
      if (json.success && json.data) {
        setUstdzData(json.data);
        console.log('Ustadz data loaded for public:', json.data.length, 'records');
      } else {
        console.error('API returned error:', json.message);
        setUstdzData([]);
      }
    } catch (error) {
      console.error('Error fetching ustadz data:', error);
      setUstdzData([]);
    }
  };

  useEffect(() => {
    fetchUstdzData();
  }, []);

  const filteredUstdz = ustdzData.filter(ustdz => {
    const matchesSearch = search === '' || 
      (ustdz.nama || '').toLowerCase().includes(search.toLowerCase()) ||
      (ustdz.nip || ustdz.nomor_identitas || '').toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
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
                <Col md={4} key={ustdz.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <div className="text-center pt-3">
                      {ustdz.foto ? (
                        <img 
                          src={`https://teralab.my.id/backend/api/ustadz/${ustdz.foto}`} 
                          alt={ustdz.nama} 
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover', 
                            borderRadius: '50%',
                            border: '3px solid #006400'
                          }} 
                        />
                      ) : (
                        <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center mx-auto"
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            color: 'white',
                            fontSize: '2rem',
                            fontWeight: 'bold'
                          }}>
                          {ustdz.nama ? ustdz.nama.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <Card.Body>
                      <Card.Title style={{ color: '#006400', fontSize: '1.1rem', textAlign: 'center' }}>
                        {ustdz.nama}
                      </Card.Title>
                      <Card.Text style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                        <strong>NIP:</strong> {ustdz.nip || ustdz.nomor_identitas || 'Belum ada NIP'}<br />
                        <strong>Jenis Kelamin:</strong> {ustdz.jenis_kelamin}
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
