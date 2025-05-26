import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProyectosReporte() {
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [cargando, setCargando] = useState(false);

  const cargarProyectos = async () => {
    setCargando(true);
    try {
      const snap = await getDocs(collection(db, "proyectos"));
      const lista = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Asegurar que los campos existan
        titulo: doc.data().titulo || "Sin título",
        institucion: doc.data().institucion || "Sin institución",
        docente: doc.data().docente || "Sin docente asignado",
        estado: doc.data().estado || "Sin estado"
      }));
      setProyectos(lista);
      toast.success("Proyectos cargados correctamente");
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      toast.error("Error al cargar proyectos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const filtrarProyectos = () => {
    return proyectos.filter(p => {
      const texto = busqueda.toLowerCase();
      if (filtro === "todos") return true;
      if (filtro === "institucion") return p.institucion.toLowerCase().includes(texto);
      if (filtro === "docente") return p.docente.toLowerCase().includes(texto);
      if (filtro === "titulo") return p.titulo.toLowerCase().includes(texto);
      if (filtro === "estado") return p.estado.toLowerCase().includes(texto);
      return true;
    });
  };

  const exportarPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm"
      });

      // Encabezado con logo y fecha
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Reporte generado el: " + new Date().toLocaleDateString(), 10, 10);
      
      // Título principal
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text("REPORTE DE PROYECTOS REGISTRADOS", 105, 20, { align: "center" });

      // Filtros aplicados
      doc.setFontSize(12);
      doc.text(`Filtros aplicados: ${filtro} - "${busqueda}"`, 105, 30, { align: "center" });

      // Tabla de proyectos
      autoTable(doc, {
        startY: 40,
        head: [['#', 'Título', 'Institución', 'Docente', 'Estado']],
        body: filtrarProyectos().map((p, i) => [
          i + 1,
          p.titulo,
          p.institucion,
          p.docente,
          p.estado
        ]),
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 60 },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
          4: { cellWidth: 30 }
        }
      });

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Página ${i} de ${pageCount}`, 280, 200, { align: "right" });
      }

      doc.save(`reporte_proyectos_${new Date().toISOString().slice(0,10)}.pdf`);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el reporte");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Visualización y Reporte de Proyectos</h2>

      <div className="card p-4 shadow mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar proyectos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">Todos los proyectos</option>
              <option value="titulo">Por título</option>
              <option value="institucion">Por institución</option>
              <option value="docente">Por docente</option>
              <option value="estado">Por estado</option>
            </select>
          </div>
          <div className="col-md-3 text-end">
            <button 
              className="btn btn-danger w-100" 
              onClick={exportarPDF}
              disabled={cargando || filtrarProyectos().length === 0}
            >
              {cargando ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-file-pdf me-2"></i>
              )}
              Generar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Listado de Proyectos</h5>
          <span className="badge bg-primary">
            {filtrarProyectos().length} registros
          </span>
        </div>

        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando proyectos...</p>
          </div>
        ) : filtrarProyectos().length === 0 ? (
          <div className="alert alert-warning">
            No se encontraron proyectos que coincidan con los filtros aplicados
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Título</th>
                  <th>Institución</th>
                  <th>Docente</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrarProyectos().map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.titulo}</td>
                    <td>{p.institucion}</td>
                    <td>{p.docente}</td>
                    <td>
                      <span className={`badge ${
                        p.estado === 'Completado' ? 'bg-success' : 
                        p.estado === 'En progreso' ? 'bg-warning text-dark' : 'bg-secondary'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}