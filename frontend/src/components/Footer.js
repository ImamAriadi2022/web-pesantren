import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#006400', color: '#ffffff', padding: '1rem 0' }}>
      <Container>
        <Row>
          <Col md={6} className="text-start">
            <p>&copy; 2025 Pondok Pesantren Walisongo Lampung Utara</p>
          </Col>
          <Col md={6} className="text-end">
            <p>Kontak: info@pesantrenwalisongo.com</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;