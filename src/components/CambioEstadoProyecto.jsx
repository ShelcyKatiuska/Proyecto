import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function CambioEstadoProyecto() {
  const [proyectos, setProyectos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [observacion, setObservacion] = useState("");
  const [historial, setHistorial] = useState([]);

  const estados = ["Formulación", "Evaluación", "Activo", "Inactivo", "Finalizado"];

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    const snap = await getDocs(collection(db, "proyectos"));
    const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProyectos(lista);
  };

  const cargarHistorial = async (idProyecto) => {
    const historialRef = collection(db, "proyectos", idProyecto, "historialEstados");
    const q = query(historialRef, orderBy("fecha", "desc"));
    const snap = await getDocs(q);
    const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setHistorial(lista);
  };

  const handleCambiarEstado = async () => {
    if (!seleccionado || !nuevoEstado || !observacion) {
      alert("Completa todos los campos");
      return;
    }

    const proyectoRef = doc(db, "proyectos", seleccionado.id);
    const historialRef = collection(proyectoRef, "historialEstados");

    await updateDoc(proyectoRef, {
      estadoActual: nuevoEstado
    });

    await addDoc(historialRef, {
      estado: nuevoEstado,
      observacion,
      fecha: new Date()
    });

    alert("Estado actualizado.");
    setNuevoEstado("");
    setObservacion("");
    cargarHistorial(seleccionado.id);
    cargarProyectos();
  };

  const seleccionarProyecto = (proyecto) => {
    setSeleccionado(proyecto);
    setNuevoEstado(proyecto.estadoActual || "");
    cargarHistorial(proyecto.id);
  };

  return (
    <div className="container my-5">
      <h2>Cambio de Estado del Proyecto</h2>

      <div className="mb-3">
        <label>Seleccionar Proyecto</label>
        <select
          className="form-select"
          onChange={(e) =>
            seleccionarProyecto(
              proyectos.find((p) => p.id === e.target.value)
            )
          }
        >
          <option value="">-- Selecciona --</option>
          {proyectos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.titulo}
            </option>
          ))}
        </select>
      </div>

      {seleccionado && (
        <div className="card p-3 shadow mb-4">
          <h5>{seleccionado.titulo}</h5>

          <div className="mb-2">
            <label>Nuevo Estado</label>
            <select
              className="form-select"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
            >
              <option value="">-- Selecciona estado --</option>
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label>Observación</label>
            <textarea
              className="form-control"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>

          <button onClick={handleCambiarEstado} className="btn btn-primary">
            Cambiar Estado
          </button>
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div className="card p-3 shadow">
          <h5>Historial de Cambios</h5>
          <ul className="list-group">
            {historial.map((h) => (
              <li key={h.id} className="list-group-item">
                <strong>{h.estado}</strong> - {h.observacion} <br />
                <small>{new Date(h.fecha.toDate()).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
