import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppNavbar from "../components/Navbar"; // Asegúrate de importar tu Navbar

const Dashboard = () => {
  const modulos = [
    { nombre: "Gestión de Usuarios", descripcion: "Crear, editar y eliminar usuarios.", ruta: "/UserManagement" },
    { nombre: "Gestión de Proyectos", descripcion: "Registrar y administrar proyectos.", ruta: "/proyectos" },
    { nombre: "Seguimiento de Proyectos", descripcion: "Registrar avances e hitos.", ruta: "/seguimiento" },
    { nombre: "Bitácoras", descripcion: "Visualizar y detallar bitácoras de campo.", ruta: "/bitacoras" },
    
    { nombre: "Evaluacion y Estado del Proyecto", descripcion: "Ver estado actual e historial.", ruta: "/estado" },
    { nombre: "Reportes", descripcion: "Buscar, listar y exportar en PDF.", ruta: "/reportes" }
  ];

  return (
    <>
      <AppNavbar />

      <Container className="mt-5">
        <h2 className="text-center mb-4">Módulo Principal</h2>
        <Row className="justify-content-center">
          {modulos.map((modulo, idx) => (
            <Col key={idx} md={4} className="mb-4">
              <Card className="h-100 shadow border-0 animate__animated animate__fadeIn">
                <Card.Body>
                  <Card.Title className="text-primary fw-bold">{modulo.nombre}</Card.Title>
                  <Card.Text className="text-muted">{modulo.descripcion}</Card.Text>
                  <Link to={modulo.ruta} className="btn btn-outline-primary w-100">
                    Acceder
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
