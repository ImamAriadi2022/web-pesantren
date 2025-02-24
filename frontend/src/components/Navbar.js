import React from 'react';
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

const CustomNavbar = () => {
return (
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
                        <NavDropdown.Item href="#action/3.2">Option 2</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Option 3</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#psb">PSB</Nav.Link>
                    <Nav.Link href="#kontak">Kontak</Nav.Link>
                    <Button variant="outline-light" href="#login">Login</Button>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
);
}

export default CustomNavbar;