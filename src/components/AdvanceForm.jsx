import { useState } from "react";
import { db, storage } from "../services/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdvanceForm() {
  const [formData, setFormData] = useState({ fecha: "", descripcion: "" });
  const [files, setFiles] = useState({ documento: null, foto: null });
  const [fileNames, setFileNames] = useState({ documento: "", foto: "" });
  const [uploadState, setUploadState] = useState({ loading: false, progress: 0 });

  const avancesRef = collection(db, "avances");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validación opcional de tipo MIME (actívala si lo necesitas)
    /*
    if (type === "documento" && !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      toast.error("Solo se permiten archivos PDF o Word");
      return;
    }
    */

    if (file.size > 10 * 1024 * 1024) {
      toast.error("El archivo es demasiado grande (máx. 10MB)");
      return;
    }

    setFiles(prev => ({ ...prev, [type]: file }));
    setFileNames(prev => ({ ...prev, [type]: file.name }));
  };

  const uploadFile = (file, path) => {
    return new Promise((resolve, reject) => {
      const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadState({ loading: true, progress });
        },
        (error) => {
          toast.error(`Error al subir ${file.name}: ${error.message}`);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(resolve)
            .catch(reject);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fecha || !formData.descripcion) {
      toast.error("Los campos de fecha y descripción son obligatorios");
      return;
    }

    setUploadState({ loading: true, progress: 0 });
    toast.info("Procesando el avance...");

    try {
      const uploadPromises = [];

      if (files.documento) {
        uploadPromises.push(
          uploadFile(files.documento, "documentos").then(url => ({ type: "documentoUrl", url }))
        );
      }

      if (files.foto) {
        uploadPromises.push(
          uploadFile(files.foto, "fotos").then(url => ({ type: "fotoUrl", url }))
        );
      }

      const uploadData = (await Promise.all(uploadPromises)).reduce((acc, curr) => {
        acc[curr.type] = curr.url;
        return acc;
      }, {});

      await addDoc(avancesRef, {
        ...formData,
        fecha: Timestamp.fromDate(new Date(formData.fecha)),
        ...uploadData,
        createdAt: Timestamp.now()
      });

      toast.success("¡Avance registrado exitosamente!");
      resetForm();
    } catch (error) {
      console.error("Error general:", error);
      toast.error(`Error: ${error.message || "Por favor intente nuevamente"}`);
    } finally {
      setUploadState({ loading: false, progress: 0 });
    }
  };

  const resetForm = () => {
    setFormData({ fecha: "", descripcion: "" });
    setFiles({ documento: null, foto: null });
    setFileNames({ documento: "", foto: "" });
    document.getElementById("documentoInput").value = "";
    document.getElementById("fotoInput").value = "";
  };

  const handleNavigation = () => {
    if (formData.fecha || formData.descripcion || files.documento || files.foto) {
      if (window.confirm("¿Estás seguro de salir? Tienes cambios sin guardar")) {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Registro de Avances</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Fecha *</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="form-control"
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción *</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="form-control"
            rows="5"
            required
            placeholder="Describa los logros, problemas encontrados y próximos pasos..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Documento (PDF, Word)</label>
          <input
            type="file"
            id="documentoInput"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "documento")}
            className="form-control"
            disabled={uploadState.loading}
          />
          {fileNames.documento && (
            <div className="mt-2 small d-flex align-items-center text-muted">
              <i className="bi bi-file-earmark-text me-2"></i>
              <span className="text-truncate">{fileNames.documento}</span>
              <button
                type="button"
                className="btn btn-sm btn-link text-danger ms-auto"
                onClick={() => {
                  setFiles(prev => ({ ...prev, documento: null }));
                  setFileNames(prev => ({ ...prev, documento: "" }));
                  document.getElementById("documentoInput").value = "";
                }}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">Fotografía</label>
          <input
            type="file"
            id="fotoInput"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileChange(e, "foto")}
            className="form-control"
            disabled={uploadState.loading}
          />
          {fileNames.foto && (
            <div className="mt-2 small d-flex align-items-center text-muted">
              <i className="bi bi-image me-2"></i>
              <span className="text-truncate">{fileNames.foto}</span>
              <button
                type="button"
                className="btn btn-sm btn-link text-danger ms-auto"
                onClick={() => {
                  setFiles(prev => ({ ...prev, foto: null }));
                  setFileNames(prev => ({ ...prev, foto: "" }));
                  document.getElementById("fotoInput").value = "";
                }}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          )}
        </div>

        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary py-2"
            disabled={uploadState.loading}
          >
            {uploadState.loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                {uploadState.progress > 0 ? `Subiendo ${uploadState.progress}%` : "Procesando..."}
              </>
            ) : "Registrar Avance"}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary py-2"
            onClick={handleNavigation}
            disabled={uploadState.loading}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver al Menú
          </button>
        </div>
      </form>
    </div>
  );
}
