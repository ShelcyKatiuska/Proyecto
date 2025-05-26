// src/components/BitacoraRegistro.jsx
import { useState, useEffect, useRef } from "react";
import { db, storage, auth } from "../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function BitacoraRegistro() {
  const [form, setForm] = useState({
    fecha: "",
    ubicacion: "",
    observaciones: "",
  });
  const [foto, setFoto] = useState(null);
  const [bitacoras, setBitacoras] = useState([]);
  const fotoInputRef = useRef(null);

  // Referencia a la colección Firestore
  const bitacorasRef = collection(db, "bitacoras");

  // Cargar bitácoras al montar
  useEffect(() => {
    cargarBitacoras();
  }, []);

  
  const cargarBitacoras = async () => {
    try {
      const snap = await getDocs(bitacorasRef);
      const lista = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBitacoras(lista);
    } catch (error) {
      console.error("Error al cargar bitácoras:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fecha || !form.ubicacion || !form.observaciones) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!auth.currentUser) {
      alert("No hay usuario autenticado, inicia sesión.");
      return;
    }

    // Validación básica de la imagen
    if (foto) {
      if (!foto.type.startsWith("image/")) {
        alert("Solo puedes subir archivos de imagen.");
        return;
      }
      if (foto.size > 5 * 1024 * 1024) {
        alert("La imagen es demasiado grande (máximo 5MB).");
        return;
      }
    }

    try {
      let fotoUrl = "";

      if (foto) {
        // Referencia única en Storage para la imagen
        const storageRef = ref(storage, `bitacoras/${Date.now()}_${foto.name}`);

        // Subir imagen
        await uploadBytes(storageRef, foto);

        // Obtener URL descargable
        fotoUrl = await getDownloadURL(storageRef);
      }

      // Guardar documento en Firestore
      await addDoc(bitacorasRef, {
        fecha: Timestamp.fromDate(new Date(form.fecha)),
        ubicacion: form.ubicacion,
        observaciones: form.observaciones,
        fotoUrl,
        createdAt: Timestamp.now(),
        userEmail: auth.currentUser.email,
      });

      alert("Bitácora registrada con éxito.");
      setForm({ fecha: "", ubicacion: "", observaciones: "" });
      setFoto(null);
      if (fotoInputRef.current) fotoInputRef.current.value = "";
      cargarBitacoras();
    } catch (error) {
      console.error("Error al guardar bitácora:", error);
      alert("No se pudo guardar la bitácora: " + error.message);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Gestión de Bitácoras</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="card p-4 shadow mb-5">
        <h4 className="mb-3">Registrar nueva bitácora</h4>

        <div className="mb-3">
          <label className="form-label">Fecha *</label>
          <input
            type="date"
            name="fecha"
            className="form-control"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ubicación *</label>
          <input
            type="text"
            name="ubicacion"
            className="form-control"
            value={form.ubicacion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Observaciones *</label>
          <textarea
            name="observaciones"
            className="form-control"
            value={form.observaciones}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fotografía (opcional)</label>
          <input
            type="file"
            ref={fotoInputRef}
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Guardar Bitácora
        </button>
      </form>

      {/* Lista de bitácoras */}
      <div className="card p-4 shadow">
        <h4 className="mb-3">Lista de Bitácoras</h4>
        {bitacoras.length === 0 ? (
          <p>No hay bitácoras registradas.</p>
        ) : (
          <ul className="list-group">
            {bitacoras.map((b) => (
              <li
                key={b.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{b.fecha.toDate().toLocaleDateString()}</strong> – {b.ubicacion}
                  <br />
                  <small>{b.observaciones}</small>
                </div>
                {b.fotoUrl && (
                  <img
                    src={b.fotoUrl}
                    alt="Evidencia"
                    style={{ maxHeight: 50, borderRadius: 4 }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
