import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';

const LP_Asrama = () => {
  const [asramaData, setAsramaData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Fetch data asrama dari backend
  const fetchAsramaData = async () => {
    try {
      const res = await fetch('http://localhost/web-pesantren/backend/api/public/getAsramaPublic.php');
      const json = await res.json();
      if (json.success) setAsramaData(json.data);
    } catch (error) {
      console.error('Error fetching asrama data:', error);
    }
  };

  useEffect(() => {
    fetchAsramaData();
  }, []);

  const filteredAsrama = asramaData.filter(asrama => 
    asrama.nama.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAsrama.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAsrama.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section style={{ padding: '3rem 0' }}>
      <Container>
        <div className="mb-5 text-start">
          <h2>Data Asrama</h2>
          <p>Berikut adalah data dari asrama kami</p>
        </div>
        <div className="mb-3">
          <Row>
            <Col md={8} className="d-flex gap-2">
              <Button variant="outline-primary">Salin</Button>
              <Button variant="outline-primary">CSV</Button>
              <Button variant="outline-primary">Excel</Button>
              <Button variant="outline-primary">PDF</Button>
              <Button variant="outline-primary">Cetak</Button>
              <Button variant="outline-primary">Kolom</Button>
            </Col>
            <Col md={4} className="text-end">
              <Form.Control
                type="text"
                placeholder="Cari Asrama"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
          </Row>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nama Asrama</th>
              <th>Kapasitas</th>
              <th>Lokasi</th>
              <th>Jenis</th>
              <th>Penanggung Jawab</th>
              <th>Fasilitas</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(asrama => (
              <tr key={asrama.id}>
                <td>{asrama.nama}</td>
                <td>{asrama.kapasitas}</td>
                <td>{asrama.lokasi}</td>
                <td>{asrama.jenis}</td>
                <td>{asrama.penanggungJawab}</td>
                <td>{asrama.fasilitas}</td>
                <td>{asrama.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-between">
          <Button variant="outline-primary" onClick={handlePrev} disabled={currentPage === 1}>Previous</Button>
          <Button variant="outline-primary" onClick={handleNext} disabled={currentPage === totalPages}>Next</Button>
        </div>
      </Container>
    </section>
  );
}

export default LP_Asrama;