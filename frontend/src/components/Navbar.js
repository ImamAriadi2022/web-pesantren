import { useState, useEffect } from 'react';
import { Button, Container, Form, InputGroup, Modal, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaMosque } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({});
  const navigate = useNavigate();

  // Fetch website settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/api/public/getSettingsPublic.php');
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default settings if API fails
      setSettings({
        nama_instansi: 'Pondok Pesantren Walisongo',
        logo_web: '/images/logo.png'
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
const [forgotEmail, setForgotEmail] = useState('');

const handleForgotPassword = async () => {
  try {
    const response = await fetch('http://localhost/web-pesantren/backend/api/lupa.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });

    const result = await response.json();

    if (result.success) {
      alert(result.message);
      setShowForgotPassword(false);
    } else {
      alert(result.message || 'Gagal mengirim email reset password');
    }
  } catch (error) {
    console.error('Error in forgot password:', error);
    alert('Terjadi kesalahan saat memproses permintaan');
  }
};

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost/web-pesantren/backend/index.php?request=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert(`Login berhasil sebagai ${result.role}!`);
        handleClose();
  
        if (result.role === 'admin') {
          navigate('/admin');
        } else if (result.role === 'pengajar') {
          navigate('/pengajar');
        } else if (result.role === 'santri') {
          navigate('/santri');
        } else {
          alert(result.message || 'Login gagal');
        }
      } else {
        alert(result.message || 'Email atau password salah');
      }
    } catch (error) {
      console.error('Error in login:', error);
      alert('Terjadi kesalahan saat login');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Navbar style={{ backgroundColor: '#006400' }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <FaMosque 
              style={{ 
                fontSize: '30px', 
                color: 'white',
                marginRight: '10px'
              }} 
            />
            <div style={{ marginLeft: '10px' }}>
              {settings.nama_instansi || 'Pondok Pesantren Walisongo'}
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto gap-3">
              <Nav.Link href="/">Beranda</Nav.Link>
              <NavDropdown title="Profil Kami" id="basic-nav-dropdown">
                <NavDropdown.Item href="/tentang-kami">Tentang Kami</NavDropdown.Item>
                <NavDropdown.Item href="/data-santri">Data Santri</NavDropdown.Item>
                <NavDropdown.Item href="/data-ustadz">Data Ustadz</NavDropdown.Item>
                <NavDropdown.Item href="/asrama">Data Asrama</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/psb">PSB</Nav.Link>
              <Nav.Link href="/kontak">Kontak</Nav.Link>
              <Button variant="outline-light" style={{ backgroundColor: '#006400', borderColor: '#006400' }} onClick={handleShow}>Login</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

   {/* Modal Login */}
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Alamat Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Kata Sandi</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Tambahkan tautan "Lupa Kata Sandi?" */}
          <div className="mt-2">
            <a
              href="#"
              onClick={() => {
                setShow(false);
                setShowForgotPassword(true);
              }}
              style={{ fontSize: '0.9rem', color: '#006400', textDecoration: 'none' }}
            >
              Lupa Kata Sandi?
            </a>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Tutup
        </Button>
        <Button variant="primary" style={{ backgroundColor: '#006400', borderColor: '#006400' }} onClick={handleLogin}>
          Login
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Modal Lupa Kata Sandi */}
    <Modal show={showForgotPassword} onHide={() => setShowForgotPassword(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Lupa Kata Sandi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formForgotEmail">
            <Form.Label>Alamat Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Masukkan email Anda"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowForgotPassword(false)}>
          Tutup
        </Button>
        <Button variant="primary" style={{ backgroundColor: '#006400', borderColor: '#006400' }} onClick={handleForgotPassword}>
          Kirim
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default CustomNavbar;