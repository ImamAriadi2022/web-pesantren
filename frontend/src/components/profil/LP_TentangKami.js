import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const LP_TentangKami = () => {
  return (
    <section style={{ padding: '3rem 0' }}>
      <Container>
        <div className="mb-5 text-start">
          <h2>Tentang Kami</h2>
          <p>Berikut adalah sejarah tentang kami</p>
        </div>
        <div>
          <Row className="mb-5">
            <Col md={4}>
              <img
                src="path/to/pimpinan.jpg"
                alt="Foto Pimpinan"
                className="img-fluid mb-3"
                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
              />
            </Col>
            <Col md={8} className="text-start">
              <h3>Sambutan</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </Col>
          </Row>
          <div className="text-start">
            <h3>Sejarah</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default LP_TentangKami;