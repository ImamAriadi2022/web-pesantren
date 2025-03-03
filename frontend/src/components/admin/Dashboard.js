import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col md={3}>
          <Card onClick={() => handleCardClick('/admin/data-santri')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total Santri</Card.Title>
              <Card.Text>
                1200
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card onClick={() => handleCardClick('/admin/ustadz-ustadzah')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total Pengajar</Card.Title>
              <Card.Text>
                150
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card onClick={() => handleCardClick('/admin/kelola-asrama')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total Asrama</Card.Title>
              <Card.Text>
                20
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card onClick={() => handleCardClick('/admin/kelola-psb')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total PSB</Card.Title>
              <Card.Text>
                300
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;