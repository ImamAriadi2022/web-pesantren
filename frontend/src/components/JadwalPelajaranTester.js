import { useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../utils/auth';
import { quickLogin } from '../utils/loginTest';
import JadwalPelajaran from './santri/JadwalPelajaran';

const JadwalPelajaranTester = () => {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [showJadwal, setShowJadwal] = useState(false);

  const handleQuickLogin = (loginFunction, userType) => {
    const success = loginFunction();
    if (success) {
      setShowJadwal(false); // Reset tampilan jadwal
      setTimeout(() => {
        window.location.reload(); // Refresh untuk update auth state
      }, 100);
    } else {
      alert(`Gagal login sebagai ${userType}`);
    }
  };

  const testUsers = [
    {
      name: 'Ahmad Santri 1',
      id: 1,
      action: () => quickLogin.loginAsSantri1(),
      type: 'Santri'
    },
    {
      name: 'Fatimah Santri 2', 
      id: 2,
      action: () => quickLogin.loginAsSantri2(),
      type: 'Santri'
    },
    {
      name: 'Ali Santri 3',
      id: 3,
      action: () => quickLogin.loginAsSantri3(),
      type: 'Santri'
    }
  ];

  if (process.env.NODE_ENV === 'production') {
    return null; // Jangan tampilkan di production
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h5>🧪 Jadwal Pelajaran Tester - Development Only</h5>
        </Card.Header>
        <Card.Body>
          {isLoggedIn ? (
            <Alert variant="success">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Status:</strong> Login sebagai {currentUser?.nama} 
                  <Badge bg="primary" className="ms-2">{currentUser?.role}</Badge>
                  <br />
                  <small className="text-muted">ID: {currentUser?.id}</small>
                </div>
                <Button variant="outline-danger" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </Alert>
          ) : (
            <Alert variant="warning">
              <strong>Belum Login:</strong> Pilih salah satu santri untuk testing
            </Alert>
          )}

          <Row className="mb-3">
            <Col>
              <h6>Quick Login untuk Testing:</h6>
              <div className="d-flex gap-2 flex-wrap">
                {testUsers.map((user, index) => (
                  <Button
                    key={index}
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleQuickLogin(user.action, user.type)}
                    disabled={isLoggedIn && currentUser?.id === user.id}
                  >
                    {user.name} (ID: {user.id})
                  </Button>
                ))}
              </div>
            </Col>
          </Row>

          {isLoggedIn && currentUser?.role === 'Santri' && (
            <Row>
              <Col>
                <div className="d-flex gap-2 mb-3">
                  <Button 
                    variant={showJadwal ? "success" : "primary"}
                    onClick={() => setShowJadwal(!showJadwal)}
                  >
                    {showJadwal ? "Hide" : "Show"} Jadwal Pelajaran
                  </Button>
                </div>
                
                {showJadwal && (
                  <Card>
                    <Card.Header>
                      <h6>Komponen Jadwal Pelajaran - User: {currentUser?.nama}</h6>
                    </Card.Header>
                    <Card.Body>
                      <JadwalPelajaran />
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
          )}

          {isLoggedIn && currentUser?.role !== 'Santri' && (
            <Alert variant="info">
              <strong>Info:</strong> Jadwal Pelajaran hanya dapat diakses oleh role Santri. 
              Saat ini login sebagai {currentUser?.role}.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JadwalPelajaranTester;
