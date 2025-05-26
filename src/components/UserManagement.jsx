import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase"; // Asegúrate que esté correctamente importado
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({ 
    nombre: "", 
    correo: "", 
    rol: "",
    contrasena: "" 
  });
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState(null);
  const navigate = useNavigate();

  const usuariosRef = collection(db, "usuarios");

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const snapshot = await getDocs(usuariosRef);
        const lista = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setUsuarios(lista);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    
    obtenerUsuarios();
  }, []);

  const handleChange = (e) => {
    setFormulario({ 
      ...formulario, 
      [e.target.name]: e.target.value 
    });
  };

  const crearUsuario = async () => {
  const { nombre, correo, rol, contrasena } = formulario;

  if (!nombre || !correo || !rol || !contrasena) {
    alert("Por favor complete todos los campos");
    return;
  }

  try {
    // 1. Verificar si el correo ya está en Firestore
    const snapshot = await getDocs(usuariosRef);
    const yaExiste = snapshot.docs.some(doc => doc.data().correo === correo);

    if (yaExiste) {
      alert("Este correo ya está registrado en la base de datos.");
      return;
    }

    // 2. Crear usuario en Firebase Authentication
    await createUserWithEmailAndPassword(auth, correo, contrasena);

    // 3. Guardar en Firestore sin contraseña
    await addDoc(usuariosRef, { nombre, correo, rol });

    // 4. Actualizar lista
    const updatedSnapshot = await getDocs(usuariosRef);
    setUsuarios(updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // 5. Limpiar formulario
    setFormulario({ nombre: "", correo: "", rol: "", contrasena: "" });

    alert("Usuario creado exitosamente.");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("Este correo ya está registrado en Firebase Auth.");
    } else {
      console.error("Error al crear usuario:", error);
      alert("Error al crear usuario: " + error.message);
    }
  }


    try {
      await addDoc(usuariosRef, formulario);
      const snapshot = await getDocs(usuariosRef);
      setUsuarios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFormulario({ nombre: "", correo: "", rol: "", contrasena: "" });
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const seleccionarUsuario = (usuario) => {
    setFormulario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      contrasena: usuario.contrasena || ""
    });
    setUsuarioSeleccionadoId(usuario.id);
  };

  const actualizarUsuario = async () => {
    if (!usuarioSeleccionadoId) return;
    
    try {
      const docRef = doc(db, "usuarios", usuarioSeleccionadoId);
      await updateDoc(docRef, formulario);
      const snapshot = await getDocs(usuariosRef);
      setUsuarios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFormulario({ nombre: "", correo: "", rol: "", contrasena: "" });
      setUsuarioSeleccionadoId(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const eliminarUsuario = async () => {
    if (!usuarioSeleccionadoId) return;
    
    try {
      const docRef = doc(db, "usuarios", usuarioSeleccionadoId);
      await deleteDoc(docRef);
      const snapshot = await getDocs(usuariosRef);
      setUsuarios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFormulario({ nombre: "", correo: "", rol: "", contrasena: "" });
      setUsuarioSeleccionadoId(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const irAlDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5">Gestión de Usuarios</h2>

      <div className="card shadow-sm p-4 mb-5">
        <h4 className="mb-3">Formulario</h4>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              name="correo"
              value={formulario.correo}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="contrasena"
              value={formulario.contrasena}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Rol</label>
            <select
              className="form-select"
              name="rol"
              value={formulario.rol}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              <option value="coordinador">Coordinador</option>
              <option value="docente">Docente</option>
              <option value="estudiante">Estudiante</option>
            </select>
          </div>
        </div>

        <div className="d-flex gap-3">
          <button 
            onClick={crearUsuario}
            className="btn btn-success w-100"
          >
            Crear
          </button>
          <button 
            onClick={actualizarUsuario}
            className="btn btn-warning w-100"
            disabled={!usuarioSeleccionadoId}
          >
            Actualizar
          </button>
          <button 
            onClick={eliminarUsuario}
            className="btn btn-danger w-100"
            disabled={!usuarioSeleccionadoId}
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="card shadow-sm p-4 mb-5">
        <h4 className="mb-3">Lista de Usuarios</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No hay usuarios registrados</td>
                </tr>
              ) : (
                usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <button
                        onClick={() => seleccionarUsuario(usuario)}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center">
        <button onClick={irAlDashboard} className="btn btn-secondary px-5">
          Menú Principal
        </button>
      </div>
    </div>
  );
}