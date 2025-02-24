import React, { useState } from 'react';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const asramaData = [
  { id: 1, nama: 'Asrama 1', kapasitas: 100, lokasi: 'Lokasi 1', jenis: 'Putra', penanggungJawab: 'Ustadz 1', fasilitas: 'Fasilitas 1', status: 'Aktif' },
  { id: 2, nama: 'Asrama 2', kapasitas: 80, lokasi: 'Lokasi 2', jenis: 'Putri', penanggungJawab: 'Ustadzah 2', fasilitas: 'Fasilitas 2', status: 'Aktif' },
  { id: 3, nama: 'Asrama 3', kapasitas: 120, lokasi: 'Lokasi 3', jenis: 'Putra', penanggungJawab: 'Ustadz 3', fasilitas: 'Fasilitas 3', status: 'Aktif' },
  { id: 4, nama: 'Asrama 4', kapasitas: 90, lokasi: 'Lokasi 4', jenis: 'Putri', penanggungJawab: 'Ustadzah 4', fasilitas: 'Fasilitas 4', status: 'Aktif' },
  { id: 5, nama: 'Asrama 5', kapasitas: 110, lokasi: 'Lokasi 5', jenis: 'Putra', penanggungJawab: 'Ustadz 5', fasilitas: 'Fasilitas 5', status: 'Aktif' },
  { id: 6, nama: 'Asrama 6', kapasitas: 70, lokasi: 'Lokasi 6', jenis: 'Putri', penanggungJawab: 'Ustadzah 6', fasilitas: 'Fasilitas 6', status: 'Aktif' },
  { id: 7, nama: 'Asrama 7', kapasitas: 130, lokasi: 'Lokasi 7', jenis: 'Putra', penanggungJawab: 'Ustadz 7', fasilitas: 'Fasilitas 7', status: 'Aktif' },
  { id: 8, nama: 'Asrama 8', kapasitas: 95, lokasi: 'Lokasi 8', jenis: 'Putri', penanggungJawab: 'Ustadzah 8', fasilitas: 'Fasilitas 8', status: 'Aktif' },
  { id: 9, nama: 'Asrama 9', kapasitas: 85, lokasi: 'Lokasi 9', jenis: 'Putra', penanggungJawab: 'Ustadz 9', fasilitas: 'Fasilitas 9', status: 'Aktif' },
  { id: 10, nama: 'Asrama 10', kapasitas: 75, lokasi: 'Lokasi 10', jenis: 'Putri', penanggungJawab: 'Ustadzah 10', fasilitas: 'Fasilitas 10', status: 'Aktif' },
];

const LP_Asrama = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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