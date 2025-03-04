import React, { useState } from 'react';
import { Button, Container, Nav, Navbar, NavDropdown, Modal, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogin = () => {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';
    const pengajarEmail = 'pengajar@example.com';
    const pengajarPassword = 'password123';
    const siswaEmail = 'siswa@example.com';
    const siswaPassword = 'password123';

    if (email === adminEmail && password === adminPassword) {
      alert('Login berhasil sebagai Admin!');
      handleClose();
      navigate('/admin');
    } else if (email === pengajarEmail && password === pengajarPassword) {
      alert('Login berhasil sebagai Pengajar!');
      handleClose();
      navigate('/pengajar');
    } else if (email === siswaEmail && password === siswaPassword) {
      alert('Login berhasil sebagai Siswa!');
      handleClose();
      navigate('/siswa');
    } else {
      alert('Email atau kata sandi salah');
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
            <img
              src="path/to/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
              alt="Logo"
            />
            <div style={{ marginLeft: '10px' }}>
              Nama Brand
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
    </>
  );
};

export default CustomNavbar;