import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Button variant="dark" onClick={toggleSidebar} className="me-2">
          <FaBars />
        </Button>
        <Navbar.Brand href="/santri">Santri Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/santri/profile">Profile</Nav.Link>
            <Nav.Link href="/">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;