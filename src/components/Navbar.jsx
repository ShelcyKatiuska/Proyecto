import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes añadir lógica de cierre de sesión con Firebase si usas autenticación
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/dashboard">📚 Sistema de Proyectos Escolares</Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="outline-light" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
