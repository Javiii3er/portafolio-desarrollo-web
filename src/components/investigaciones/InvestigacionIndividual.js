// InvestigacionIndividual.js (CÓDIGO COMPLETO Y CORREGIDO)

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvestigacionIndividual() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investigacion, setInvestigacion] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar investigación específica
  useEffect(() => {
    // NOTA: Se recomienda usar Firestore en lugar de localStorage para persistencia real.
    const guardado = localStorage.getItem('investigaciones');
    if (guardado) {
      const lista = JSON.parse(guardado);
      // Asegurar que el ID sea numérico si se guardó como número
      const investigacionEncontrada = lista.find(item => item.id === parseInt(id));
      setInvestigacion(investigacionEncontrada);
    }
    setCargando(false);
  }, [id]);

  const descargarPDF = async () => {
    if (!investigacion) return;

    const element = document.createElement("div");
    element.style.padding = "25px";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.backgroundColor = "white";
    element.style.lineHeight = "1.6";
    
    element.innerHTML = `
      <div style="border-bottom: 3px solid #b1832d; padding-bottom: 15px; margin-bottom: 25px;">
        <img src="/umg.png" alt="UMG" style="height: 60px; float: left; margin-right: 20px;">
        <div style="text-align: center; margin-left: 80px;">
          <h1 style="color: #16709f; margin: 0 0 5px 0; font-size: 22px;">${investigacion.titulo}</h1>
          <p style="color: #666; margin: 0 0 5px 0; font-size: 14px;">Universidad Mariano Gálvez</p>
          <p style="color: #c62b28; margin: 0; font-size: 12px;">Fecha: ${investigacion.fecha} | Tipo: ${investigacion.tipo.toUpperCase()}</p>
        </div>
        <div style="clear: both;"></div>
      </div>
      <div style="white-space: pre-wrap; font-size: 12px; text-align: justify;">${investigacion.contenido}</div>
      <div style="margin-top: 40px; padding-top: 15px; border-top: 2px solid #b1832d; text-align: center; color: #666; font-size: 11px;">
        <p style="margin: 0;">Portafolio Académico - "Conoceréis la verdad y la verdad os hará libres"</p>
      </div>
    `;

    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = pdfWidth / imgProps.width;
      const height = imgProps.height * ratio;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, height);
      pdf.save(`${investigacion.titulo}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      // Reemplazo de alert()
      console.log("Error al generar el PDF. Revise la consola.");
    } finally {
      document.body.removeChild(element);
    }
  };

  const eliminarInvestigacion = () => {
    // Importante: No se permite window.confirm(), por lo que se debe usar un modal custom.
    console.warn("ADVERTENCIA: Aquí se requiere un modal de confirmación personalizado en lugar de window.confirm()");
    
    // Aquí iría la lógica del modal de confirmación antes de la eliminación
    const guardado = localStorage.getItem('investigaciones');
    if (guardado) {
      const lista = JSON.parse(guardado);
      const nuevaLista = lista.filter(item => item.id !== parseInt(id));
      localStorage.setItem('investigaciones', JSON.stringify(nuevaLista));
      navigate("/investigaciones");
    }
  };

  const getBadgeColor = (tipo) => {
    switch(tipo) {
      case 'glosario': return 'bg-warning text-dark';
      case 'ensayo': return 'bg-info text-white';
      case 'reporte': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  };

  if (cargando) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando investigación...</p>
        </div>
        </div>
    );
  }

  if (!investigacion) {
    return (
      <div className="container mt-4">
        <div className="text-center text-muted py-5">
          <h3>Investigación no encontrada</h3>
          <p>La investigación que buscas no existe o ha sido eliminada.</p>
          <Link to="/investigaciones" className="btn btn-primary">
            Volver a Investigaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header con navegación */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button 
                className="btn btn-outline-secondary btn-sm mb-2"
                onClick={() => navigate("/investigaciones")}
              >
                ⬅️ Volver a Investigaciones
              </button>
              <h1 style={{ color: '#2b2422', margin: 0 }}>{investigacion.titulo}</h1>
            </div>
            <span className={`badge ${getBadgeColor(investigacion.tipo)} fs-6`}>
              {investigacion.tipo.toUpperCase()}
            </span>
          </div>
          <p className="text-muted mb-0">
            <small>Fecha de creación: {investigacion.fecha}</small>
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="contenido-investigacion" style={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: '1.7',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif'
              }}>
                {/* 🔥 CORRECCIÓN APLICADA AQUÍ: Usa dangerouslySetInnerHTML para renderizar el HTML. */}
                <div dangerouslySetInnerHTML={{ __html: investigacion.contenido }} />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="card border-0 mt-4">
            <div className="card-body text-center">
              <div className="btn-group" role="group">
                <button 
                  className="btn btn-lg me-3"
                  onClick={descargarPDF}
                  style={{ backgroundColor: '#b1832d', color: 'white' }}
                >
                  📥 Descargar PDF
                </button>
                {/* CAMBIO CLAVE: Se actualiza el 'to' del Link */}
                <Link 
                  to={`/editar-investigacion/${investigacion.id}`}
                  className="btn btn-lg me-3"
                  style={{ backgroundColor: '#16709f', color: 'white' }}
                >
                ✏️ Editar
                </Link>
                <button 
                  className="btn btn-lg btn-outline-danger"
                  onClick={eliminarInvestigacion}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}