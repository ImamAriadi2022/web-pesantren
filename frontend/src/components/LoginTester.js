import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../utils/auth';
import { quickLogin } from '../utils/loginTest';

const LoginTester = () => {
  const { currentUser, isLoggedIn, logout } = useAuth();

  const handleQuickLogin = (loginFunction, userType) => {
    const success = loginFunction();
    if (success) {
      window.location.reload(); // Refresh untuk update auth state
    } else {
      alert(`Gagal login sebagai ${userType}`);
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Jangan tampilkan di production
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h5>🧪 Login Tester - Development Only</h5>
        </Card.Header>
        <Card.Body>
          {isLoggedIn ? (
            <Alert variant="success">
              <strong>Status:</strong> Login sebagai {currentUser?.nama} ({currentUser?.role})
              <br />
              <strong>User ID:</strong> {currentUser?.id}
              {currentUser?.santri_id && (
                <>
                  <br />
                  <strong>Santri ID:</strong> {currentUser.santri_id}
                </>
              )}
              {currentUser?.ustadz_id && (
                <>
                  <br />
                  <strong>Ustadz ID:</strong> {currentUser.ustadz_id}
                </>
              )}
              <br />
              <Button variant="outline-danger" size="sm" className="mt-2" onClick={logout}>
                Logout
              </Button>
            </Alert>
          ) : (
            <Alert variant="warning">
              Belum login. Pilih user untuk testing:
            </Alert>
          )}

          <Row>
            <Col md={4}>
              <h6>👨‍🎓 Login sebagai Santri:</h6>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleQuickLogin(quickLogin.santri1, 'Santri 1')}
                >
                  Santri 1 - Muhammad Rizki
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleQuickLogin(quickLogin.santri2, 'Santri 2')}
                >
                  Santri 2 - Fatimah Azzahra
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleQuickLogin(quickLogin.santri3, 'Santri 3')}
                >
                  Santri 3 - Abdullah Al-Mahdi
                </Button>
              </div>
            </Col>
            
            <Col md={4}>
              <h6>👨‍🏫 Login sebagai Ustadz:</h6>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={() => handleQuickLogin(quickLogin.ustadz1, 'Ustadz 1')}
                >
                  Ustadz 1 - Ahmad Dahlan
                </Button>
              </div>
            </Col>
            
            <Col md={4}>
              <h6>👨‍💼 Login sebagai Admin:</h6>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleQuickLogin(quickLogin.admin, 'Admin')}
                >
                  Admin - Administrator
                </Button>
              </div>
            </Col>
          </Row>

          <Alert variant="info" className="mt-3">
            <small>
              <strong>Info:</strong> Komponen ini hanya muncul di development mode. 
              Gunakan untuk testing fitur yang memerlukan login dinamis.
            </small>
          </Alert>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginTester;
