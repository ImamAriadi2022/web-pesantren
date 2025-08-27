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
      console.log('Fetching asrama data for public view...');
      const res = await fetch('http://localhost/web-pesantren/backend/api/asrama/getAsrama.php');
      const json = await res.json();
      console.log('Public Asrama API Response:', json);
      
      if (json.success && json.data) {
        setAsramaData(json.data);
        console.log('Asrama data loaded for public:', json.data.length, 'records');
      } else {
        console.error('API returned error:', json.message);
        setAsramaData([]);
      }
    } catch (error) {
      console.error('Error fetching asrama data:', error);
      setAsramaData([]);
    }
  };

  useEffect(() => {
    fetchAsramaData();
  }, []);

  const filteredAsrama = asramaData.filter(asrama => 
    (asrama.nama_asrama || '').toLowerCase().includes(search.toLowerCase()) ||
    (asrama.kode_asrama || '').toLowerCase().includes(search.toLowerCase()) ||
    (asrama.lokasi || '').toLowerCase().includes(search.toLowerCase())
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
        {currentItems.length > 0 ? (
          <Table striped bordered hover>
            <thead style={{ backgroundColor: '#006400', color: 'white' }}>
              <tr>
                <th>Nama Asrama</th>
                {/* <th>Kode</th> */}
                <th>Kapasitas</th>
                <th>Penghuni</th>
                <th>Lokasi</th>
                <th>Jenis</th>
                <th>Penanggung Jawab</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(asrama => (
                <tr key={asrama.id}>
                  <td><strong>{asrama.nama_asrama}</strong></td>
                  {/* <td>{asrama.kode_asrama}</td> */}
                  <td>
                    <span className={`badge ${
                      ((asrama.jumlah_penghuni || 0) / asrama.kapasitas * 100) >= 90 ? 'bg-danger' :
                      ((asrama.jumlah_penghuni || 0) / asrama.kapasitas * 100) >= 70 ? 'bg-warning' : 'bg-success'
                    }`}>
                      {asrama.kapasitas} tempat
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {asrama.jumlah_penghuni || 0} santri
                    </span>
                  </td>
                  <td>{asrama.lokasi}</td>
                  <td>
                    <span className={`badge ${asrama.jenis === 'Putra' ? 'bg-primary' : 'bg-secondary'}`}>
                      {asrama.jenis}
                    </span>
                  </td>
                  <td>{asrama.penanggung_jawab || '-'}</td>
                  <td>
                    <span className={`badge ${
                      asrama.status === 'aktif' ? 'bg-success' : 
                      asrama.status === 'renovasi' ? 'bg-warning' : 'bg-danger'
                    }`}>
                      {asrama.status === 'aktif' ? 'Aktif' : 
                       asrama.status === 'renovasi' ? 'Renovasi' : 
                       asrama.status === 'nonaktif' ? 'Non-aktif' : asrama.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center p-5">
            <h5 style={{ color: '#6c757d' }}>Tidak ada data asrama yang ditemukan</h5>
            <p>Data asrama akan ditampilkan setelah tersedia di database.</p>
          </div>
        )}
        <div className="d-flex justify-content-between">
          <Button variant="outline-primary" onClick={handlePrev} disabled={currentPage === 1}>Previous</Button>
          <Button variant="outline-primary" onClick={handleNext} disabled={currentPage === totalPages}>Next</Button>
        </div>
      </Container>
    </section>
  );
}

export default LP_Asrama;
