import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ProjectForm() {
  const [formulario, setFormulario] = useState({
    titulo: "",
    area: "",
    objetivos: "",
    cronograma: "",
    presupuesto: "",
    institucion: "",
    integrantes: [{ nombre: "", apellido: "", identificacion: "", grado: "" }],
    observaciones: "",
  });

  const proyectosRef = collection(db, "proyectos");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleIntegranteChange = (index, e) => {
    const nuevosIntegrantes = [...formulario.integrantes];
    nuevosIntegrantes[index][e.target.name] = e.target.value;
    setFormulario({ ...formulario, integrantes: nuevosIntegrantes });
  };

  const agregarIntegrante = () => {
    setFormulario({
      ...formulario,
      integrantes: [
        ...formulario.integrantes,
        { nombre: "", apellido: "", identificacion: "", grado: "" },
      ],
    });
  };

  const eliminarIntegrante = (index) => {
    const nuevos = formulario.integrantes.filter((_, i) => i !== index);
    setFormulario({ ...formulario, integrantes: nuevos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(proyectosRef, formulario);
      alert("Proyecto registrado exitosamente.");
      setFormulario({
        titulo: "",
        area: "",
        objetivos: "",
        cronograma: "",
        presupuesto: "",
        institucion: "",
        integrantes: [{ nombre: "", apellido: "", identificacion: "", grado: "" }],
        observaciones: "",
      });
    } catch (error) {
      console.error("Error al registrar proyecto:", error);
      alert("Hubo un error al registrar el proyecto.");
    }
  };

  const volverAlMenu = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Registrar Nuevo Proyecto</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Área</label>
          <input
            type="text"
            name="area"
            value={formulario.area}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Objetivos</label>
          <textarea
            name="objetivos"
            value={formulario.objetivos}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cronograma</label>
          <input
            type="text"
            name="cronograma"
            value={formulario.cronograma}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Presupuesto</label>
          <input
            type="number"
            name="presupuesto"
            value={formulario.presupuesto}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Institución</label>
          <input
            type="text"
            name="institucion"
            value={formulario.institucion}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Integrantes del equipo</label>
          {formulario.integrantes.map((integrante, index) => (
            <div key={index} className="border p-3 mb-2 rounded">
              <div className="row g-2 mb-2">
                <div className="col">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={integrante.nombre}
                    onChange={(e) => handleIntegranteChange(index, e)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={integrante.apellido}
                    onChange={(e) => handleIntegranteChange(index, e)}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row g-2">
                <div className="col">
                  <input
                    type="text"
                    name="identificacion"
                    placeholder="Identificación"
                    value={integrante.identificacion}
                    onChange={(e) => handleIntegranteChange(index, e)}
                    className="form-control"
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="grado"
                    placeholder="Grado escolar"
                    value={integrante.grado}
                    onChange={(e) => handleIntegranteChange(index, e)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="mt-2 text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => eliminarIntegrante(index)}
                >
                  Eliminar integrante
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={agregarIntegrante}
          >
            + Agregar integrante
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Observaciones adicionales</label>
          <textarea
            name="observaciones"
            value={formulario.observaciones}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Registrar Proyecto
        </button>

        <div className="text-center mt-4">
          <button className="btn btn-secondary px-5" onClick={volverAlMenu}>
            Volver al Menú
          </button>
        </div>
      </form>
    </div>
  );
}
