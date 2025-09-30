import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function Proyectos() {
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Cargar proyectos al iniciar
  useEffect(() => {
    const guardado = localStorage.getItem('proyectos');
    if (guardado) {
      setLista(JSON.parse(guardado));
    }
  }, []);

  // Filtrar proyectos
  const proyectosFiltrados = lista.filter(proyecto => 
    proyecto.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    proyecto.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    proyecto.repositorio.toLowerCase().includes(busqueda.toLowerCase()) ||
    proyecto.sitioEnVivo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const eliminarProyecto = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      const nuevaLista = lista.filter(item => item.id !== id);
      setLista(nuevaLista);
      localStorage.setItem('proyectos', JSON.stringify(nuevaLista));
    }
  };

  const abrirEnlace = (url, event) => {
    if (url) {
      event.stopPropagation();
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 style={{ color: '#2b2422', borderBottom: '2px solid #b1832d', paddingBottom: '10px' }}>
            💻 Mis Proyectos
          </h2>
          <p className="text-muted">
            Explora todos mis proyectos de programación y desarrollo
          </p>
        </div>
      </div>

      {/* Buscador y Acciones */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#16709f', color: 'white' }}>
              🔍
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar proyectos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4 text-end">
          <Link 
            to="/nuevo-proyecto" 
            className="btn w-100"
            style={{ backgroundColor: '#c62b28', color: 'white' }}
          >
            ➕ Nuevo Proyecto
          </Link>
        </div>
      </div>

      {/* Cards de Proyectos */}
      {lista.length > 0 && (
        <div className="row">
          {proyectosFiltrados.map((proyecto) => (
            <div key={proyecto.id} className="col-lg-6 mb-4">
              <div className="card shadow-sm border-0 h-100 hover-card">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title text-dark" style={{ flex: 1 }}>
                      🚀 {proyecto.titulo}
                    </h5>
                    <span className="badge bg-success">
                      PROYECTO
                    </span>
                  </div>
                  
                  {proyecto.descripcion ? (
                    <p className="card-text text-muted mb-3 flex-grow-0">
                      {proyecto.descripcion}
                    </p>
                  ) : (
                    <p className="card-text text-warning small mb-3 flex-grow-0">
                      ⚠️ Sin descripción - <Link to={`/editar-proyecto/${proyecto.id}`} className="text-warning">Agregar</Link>
                    </p>
                  )}

                  {/* Enlaces del proyecto */}
                  <div className="mb-3 flex-grow-0">
                    {proyecto.repositorio ? (
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-dark me-2">📂</span>
                        <button 
                          className="btn btn-sm btn-outline-dark text-start text-truncate"
                          style={{ maxWidth: '100%' }}
                          onClick={(e) => abrirEnlace(proyecto.repositorio, e)}
                          title={proyecto.repositorio}
                        >
                          Ver Código
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-secondary me-2">📂</span>
                        <span className="text-muted small">Sin repositorio</span>
                      </div>
                    )}
                    
                    {proyecto.sitioEnVivo ? (
                      <div className="d-flex align-items-center">
                        <span className="badge bg-primary me-2">🌐</span>
                        <button 
                          className="btn btn-sm btn-outline-primary text-start text-truncate"
                          style={{ maxWidth: '100%' }}
                          onClick={(e) => abrirEnlace(proyecto.sitioEnVivo, e)}
                          title={proyecto.sitioEnVivo}
                        >
                          Ver Sitio
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center">
                        <span className="badge bg-secondary me-2">🌐</span>
                        <span className="text-muted small">Sin sitio en vivo</span>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <small className="text-muted">
                      Creado: {proyecto.fecha}
                    </small>
                    <div>
                      <Link
                        to={`/editar-proyecto/${proyecto.id}`}
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        ✏️
                      </Link>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarProyecto(proyecto.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estados vacíos */}
      {lista.length === 0 && (
        <div className="text-center text-muted mt-5 py-5">
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>💻</div>
          <h5 style={{ color: '#16709f' }}>No hay proyectos guardados</h5>
          <p>Comienza agregando tu primer proyecto.</p>
          <Link 
            to="/nuevo-proyecto" 
            className="btn mt-3"
            style={{ backgroundColor: '#16709f', color: 'white' }}
          >
            ➕ Crear Primer Proyecto
          </Link>
        </div>
      )}

      {lista.length > 0 && proyectosFiltrados.length === 0 && (
        <div className="text-center text-muted mt-5 py-5">
          <p>No se encontraron resultados para "{busqueda}".</p>
          <button 
            className="btn btn-link" 
            onClick={() => setBusqueda("")}
          >
            Ver todos los proyectos
          </button>
        </div>
      )}
    </div>
  );
}