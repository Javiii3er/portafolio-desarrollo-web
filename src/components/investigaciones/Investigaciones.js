import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Asumiendo que este componente existe y maneja la lógica visual del modal
import ModalConfirmacion from "../ModalConfirmacion"; 

export default function Investigaciones() {
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para almacenar el ID del ítem que se va a eliminar
  const [itemAEliminar, setItemAEliminar] = useState(null);

  // Cargar datos al iniciar - CON MODIFICACIÓN
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      // Primero intentar cargar desde localStorage
      const guardado = localStorage.getItem('investigaciones');
      
      if (guardado && JSON.parse(guardado).length > 0) {
        // Si hay datos en localStorage, usarlos
        setLista(JSON.parse(guardado));
      } else {
        try {
          // Si no hay datos o la lista está vacía, cargar desde el JSON estático
          const response = await fetch('/data/investigaciones.json');
          if (response.ok) {
            const datosIniciales = await response.json();
            setLista(datosIniciales);
            // Opcional: guardar en localStorage para futuras sesiones
            localStorage.setItem('investigaciones', JSON.stringify(datosIniciales));
          } else {
            console.warn('No se pudo cargar el JSON inicial. Verifique que /data/investigaciones.json exista.');
          }
        } catch (error) {
          console.error('Error cargando datos iniciales:', error);
        }
      }
    };

    cargarDatosIniciales();
  }, []);

  // Filtrar investigaciones
  const investigacionesFiltradas = lista.filter(inv => 
    inv.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    inv.contenido.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 1. Abre el modal y guarda el ID del item a eliminar
  const iniciarEliminacion = (id) => {
    setItemAEliminar(id);
    setShowModal(true);
  };

  // 2. Ejecuta la eliminación tras la confirmación del modal
  const confirmarEliminacion = () => {
    if (itemAEliminar) {
      const nuevaLista = lista.filter(item => item.id !== itemAEliminar);
      setLista(nuevaLista);
      localStorage.setItem('investigaciones', JSON.stringify(nuevaLista));
    }
    // Cierra y limpia el estado
    setShowModal(false);
    setItemAEliminar(null);
  };

  const getBadgeColor = (tipo) => {
    switch(tipo) {
      case 'glosario': return 'bg-warning text-dark';
      case 'ensayo': return 'bg-info text-white';
      case 'reporte': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getIcon = (tipo) => {
    switch(tipo) {
      case 'glosario': return '📖';
      case 'ensayo': return '📝';
      case 'reporte': return '📊';
      default: return '📚';
    }
  };

  return (
    <div className="container mt-4">
      {/* Componente Modal de Confirmación */}
      <ModalConfirmacion
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmarEliminacion}
        titulo="Eliminar investigación"
        mensaje="¿Estás seguro de que quieres eliminar esta investigación? Esta acción no se puede deshacer."
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
      />

      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 style={{ color: '#2b2422', borderBottom: '2px solid #b1832d', paddingBottom: '10px' }}>
            📚 Mis Investigaciones
          </h2>
          <p className="text-muted">
            Explora todas tus investigaciones y glosarios académicos
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
              placeholder="Buscar en investigaciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          </div>
        <div className="col-md-4 text-end">
          <Link 
            to="/nueva-investigacion" 
            className="btn w-100"
            style={{ backgroundColor: '#c62b28', color: 'white' }}
          >
            ➕ Nueva Investigación
          </Link>
        </div>
      </div>

      {/* Cards de Investigaciones */}
      {lista.length > 0 && (
        <div className="row">
          {investigacionesFiltradas.map((investigacion) => (
            <div key={investigacion.id} className="col-lg-6 mb-4">
              <Link 
                to={investigacion.tipo === 'glosario' ? `/glosario/${investigacion.id}` : `/investigacion/${investigacion.id}`}
                className="text-decoration-none"
              >
                <div className="card shadow-sm border-0 h-100 hover-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title text-dark" style={{ flex: 1 }}>
                        {getIcon(investigacion.tipo)} {investigacion.titulo}
                      </h5>
                      <span className={`badge ${getBadgeColor(investigacion.tipo)}`}>
                        {investigacion.tipo.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="card-text text-muted small mb-2">
                      <strong>Fecha:</strong> {investigacion.fecha}
                    </p>

                    {/* Vista previa del contenido */}
                    <div className="contenido-previa small text-muted">
                      {investigacion.tipo === 'glosario' 
                        ? `📋 ${investigacion.contenido.split('\n').length} términos definidos`
                        : `${investigacion.contenido.substring(0, 120)}...`
                      }
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                      <small className="text-primary">
                        👆 Click para ver {investigacion.tipo === 'glosario' ? 'glosario completo' : 'investigación completa'}
                      </small>
                      <div>
                        <Link
                          to={`/editar-investigacion/${investigacion.id}`}
                          className="btn btn-outline-primary btn-sm me-1"
                          // Evita que el click en el botón de editar active la navegación del Link principal
                          onClick={(e) => e.stopPropagation()} 
                        >
                          ✏️
                        </Link>
                        {/* CAMBIO CLAVE: Llama a iniciarEliminacion para mostrar el modal */}
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            iniciarEliminacion(investigacion.id);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Estados vacíos */}
      {lista.length === 0 && (
        <div className="text-center text-muted mt-5 py-5">
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
          <h5 style={{ color: '#16709f' }}>No hay investigaciones guardadas</h5>
          <p>Comienza agregando tu primera investigación.</p>
          <Link 
            to="/nueva-investigacion" 
            className="btn mt-3"
            style={{ backgroundColor: '#16709f', color: 'white' }}
          >
            ➕ Crear Primera Investigación
          </Link>
        </div>
      )}

      {lista.length > 0 && investigacionesFiltradas.length === 0 && (
        <div className="text-center text-muted mt-5 py-5">
          <p>No se encontraron resultados para "{busqueda}".</p>
          <button 
            className="btn btn-link" 
            onClick={() => setBusqueda("")}
          >
            Ver todas las investigaciones
          </button>
        </div>
      )}
    </div>
  );
}