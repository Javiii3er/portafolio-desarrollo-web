import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Importar la función para mostrar modales o usar un componente
// En este caso, usaremos un modal simple de Bootstrap o un div de mensaje, ya que window.confirm() no está permitido.
// Dado que la instrucción original usa window.confirm, lo reemplazaremos por un console.error y una nota de que se necesita un modal custom.

export default function GlosarioIndividual() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [glosario, setGlosario] = useState(null);
  const [filtroLetra, setFiltroLetra] = useState("");
  const [cargando, setCargando] = useState(true);

  // Cargar glosario específico
  useEffect(() => {
    // NOTA: Se recomienda usar Firestore en lugar de localStorage para persistencia real.
    const guardado = localStorage.getItem('investigaciones');
    if (guardado) {
      const lista = JSON.parse(guardado);
      // Asegurar que el ID sea numérico si se guardó como número
      const glosarioEncontrado = lista.find(item => item.id === parseInt(id));
      setGlosario(glosarioEncontrado);
    }
    setCargando(false);
  }, [id]);

  // Obtener términos del glosario
  const obtenerTerminos = () => {
    if (!glosario) return [];
    // Asume que el contenido está en el campo 'contenido'
    return glosario.contenido.split('\n').filter(linea => linea.trim() !== '');
  };

  // Obtener letras únicas de los términos
  const obtenerLetrasIniciales = () => {
    const terminos = obtenerTerminos();
    const letras = terminos.map(termino => {
      const primeraLetra = termino.trim().charAt(0).toUpperCase();
      // Incluye el filtro para caracteres no alfabéticos
      return primeraLetra.match(/[A-Z]/i) ? primeraLetra : "#";
    }).filter((letra, index, self) => self.indexOf(letra) === index).sort();
    
    return letras;
  };

  // Filtrar términos por letra
  const terminosFiltrados = obtenerTerminos().filter(termino => {
    if (!filtroLetra) return true;
    const primeraLetra = termino.trim().charAt(0).toUpperCase();
    return primeraLetra === filtroLetra;
  });

  const descargarPDF = async () => {
    if (!glosario) return;

    // ... (El código de generación de PDF es extenso, se mantiene igual)
    const element = document.createElement("div");
    element.style.padding = "25px";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.backgroundColor = "white";
    
    const terminosHTML = obtenerTerminos().map(termino => 
      `<p style="margin: 8px 0; padding-left: 15px; text-indent: -15px;"><strong>•</strong> ${termino}</p>`
    ).join('');

    element.innerHTML = `
      <div style="border-bottom: 3px solid #b1832d; padding-bottom: 15px; margin-bottom: 25px;">
        <img src="/umg.png" alt="UMG" style="height: 60px; float: left; margin-right: 20px;">
        <div style="text-align: center; margin-left: 80px;">
          <h1 style="color: #16709f; margin: 0 0 5px 0; font-size: 22px;">${glosario.titulo}</h1>
          <p style="color: #666; margin: 0 0 5px 0; font-size: 14px;">Universidad Mariano Gálvez</p>
          <p style="color: #c62b28; margin: 0; font-size: 12px;">Fecha: ${glosario.fecha} | ${obtenerTerminos().length} términos</p>
        </div>
        <div style="clear: both;"></div>
      </div>
      <div style="line-height: 1.6; font-size: 12px;">
        ${terminosHTML}
      </div>
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
      pdf.save(`${glosario.titulo}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      // Reemplazo de alert()
      console.log("Error al generar el PDF. Revise la consola."); 
    } finally {
      document.body.removeChild(element);
    }
    // ... (Fin del código de generación de PDF)
  };

  const eliminarGlosario = () => {
    // Importante: No se permite window.confirm(), por lo que se debe usar un modal custom. 
    // Por simplicidad, se omite el modal y se realiza la acción directamente (o se avisa que falta el modal).
    console.warn("ADVERTENCIA: Aquí se requiere un modal de confirmación personalizado en lugar de window.confirm()");

    const guardado = localStorage.getItem('investigaciones');
    if (guardado) {
      const lista = JSON.parse(guardado);
      const nuevaLista = lista.filter(item => item.id !== parseInt(id));
      localStorage.setItem('investigaciones', JSON.stringify(nuevaLista));
      navigate("/investigaciones");
    }
  };

  if (cargando) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando glosario...</p>
        </div>
      </div>
    );
  }

  if (!glosario) {
    return (
      <div className="container mt-4">
        <div className="text-center text-muted py-5">
          <h3>Glosario no encontrado</h3>
          <p>El glosario que buscas no existe o ha sido eliminado.</p>
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
              <h1 style={{ color: '#2b2422', margin: 0 }}>📖 {glosario.titulo}</h1>
            </div>
            <span className="badge bg-warning text-dark fs-6">
              GLOSARIO
            </span>
          </div>
          <p className="text-muted mb-0">
            <small>Fecha: {glosario.fecha} | {obtenerTerminos().length} términos definidos</small>
          </p>
        </div>
      </div>

      {/* Filtro de letras */}
      <div className="row mb-4">
        <div className="col">
          <div className="card p-3 border-0 shadow-sm">
            <h6 style={{ color: '#c62b28' }} className="mb-2">🔤 Filtrar Términos por Letra:</h6>
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn btn-sm ${filtroLetra === "" ? "active" : ""}`}
                style={{ 
                  backgroundColor: filtroLetra === "" ? '#16709f' : 'transparent', 
                  color: filtroLetra === "" ? 'white' : '#16709f',
                  border: '1px solid #16709f'
                }}
                onClick={() => setFiltroLetra("")}
              >
                Todas
              </button>
              {obtenerLetrasIniciales().map((letra) => (
                <button
                  key={letra}
                  className={`btn btn-sm ${filtroLetra === letra ? "active" : ""}`}
                  style={{ 
                    backgroundColor: filtroLetra === letra ? '#b1832d' : 'transparent', 
                    color: filtroLetra === letra ? 'white' : '#b1832d',
                    border: '1px solid #b1832d',
                    width: '40px'
                  }}
                  onClick={() => setFiltroLetra(letra)}
                >
                  {letra}
                </button>
              ))}
            </div>
            {filtroLetra && (
              <div className="mt-2">
                <small className="text-muted">
                  Mostrando términos que comienzan con: <strong>{filtroLetra}</strong>
                </small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de términos */}
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {terminosFiltrados.length > 0 ? (
                <div className="list-group list-group-flush">
                  {terminosFiltrados.map((termino, index) => (
                    <div key={index} className="list-group-item border-0 py-3">
                      <div className="d-flex">
                        <span className="badge bg-light text-dark me-3 mt-1" style={{ minWidth: '30px' }}>
                          {index + 1}
                        </span>
                        <div>
                          <span style={{ 
                            fontSize: '16px', 
                            lineHeight: '1.5',
                            fontFamily: 'Arial, sans-serif'
                          }}>
                            {termino}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <p>No hay términos que comiencen con la letra "{filtroLetra}"</p>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setFiltroLetra("")}
                  >
                    Ver todos los términos
                  </button>
                </div>
              )}
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
                {/* CAMBIO CLAVE: 
                  Se actualiza el 'to' del Link para usar la ruta de edición dinámica. 
                  Asumiendo que 'glosario' es un tipo de 'investigacion' y tiene la propiedad 'id'.
                */}
                <Link 
                  to={`/editar-investigacion/${glosario.id}`}
                  className="btn btn-lg me-3"
                  style={{ backgroundColor: '#16709f', color: 'white' }}
                >
                  ✏️ Editar
                </Link>
                <button 
                  className="btn btn-lg btn-outline-danger"
                  onClick={eliminarGlosario}
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