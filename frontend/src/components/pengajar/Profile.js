import React from 'react'; 
import { Container, Row, Col, Card } from 'react-bootstrap'; 
import { FaUser } from 'react-icons/fa';

const Profile = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Profil Pengajar
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-4">
                <h4>Halaman Profil Pengajar</h4>
                <p>Fitur profil pengajar akan segera tersedia</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
