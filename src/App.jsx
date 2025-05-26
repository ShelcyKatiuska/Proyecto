import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard"; // <- Importa el Dashboard
import UserManagement from "./components/UserManagement.jsx";
import "./App.css";
import Projects from "./Pages/Projects.jsx";
import AdvanceForm from "./components/AdvanceForm.jsx";
import BitacoraRegistro from "./components/BitacoraRegistro.jsx";
import CambioEstadoProyecto from "./components/CambioEstadoProyecto.jsx";
import ProyectosReporte from "./components/ProyectosReporte.jsx";

function App() {
  return (
    <Router>
      <div className="container mt-3">
       

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Nueva ruta */}
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/proyectos" element={<Projects />} />
          <Route path="/seguimiento" element={<AdvanceForm />} />
          <Route path="/bitacoras" element={<BitacoraRegistro />} />
          <Route path="/estado" element={<CambioEstadoProyecto />} />
          <Route path="/reportes" element= {<ProyectosReporte />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
