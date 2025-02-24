import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LPHero = () => {
  return (
    <div style={{ backgroundColor: '#f0fff0', color: '#006400', padding: '3rem 0', height: '60vh' }}>
      <Container className="h-100">
        <Row className="align-items-center h-100">
          <Col md={6} className='text-start'>
            <h1>Pondok Pesantren Walisongo Lampung Utara</h1>
            <p>Institusi Madrasah Aliyah (MA) Plus</p>
          </Col>
          <Col md={6}>
            <img
              src="path/to/animation.png"
              alt="Animation"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LPHero;