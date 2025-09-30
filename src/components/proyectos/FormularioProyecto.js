import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormularioProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState("");
  const [repositorio, setRepositorio] = useState("");
  const [sitioEnVivo, setSitioEnVivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [esEdicion, setEsEdicion] = useState(false);

  // Cargar proyecto si estamos editando
  useEffect(() => {
    if (id) {
      const guardado = localStorage.getItem('proyectos');
      if (guardado) {
        const lista = JSON.parse(guardado);
        const proyecto = lista.find(item => item.id === parseInt(id));
        
        if (proyecto) {
          setTitulo(proyecto.titulo);
          setRepositorio(proyecto.repositorio || "");
          setSitioEnVivo(proyecto.sitioEnVivo || "");
          setDescripcion(proyecto.descripcion || "");
          setEsEdicion(true);
        }
      }
    }
  }, [id]);

  const guardarProyecto = () => {
    if (!titulo.trim() || (!repositorio.trim() && !sitioEnVivo.trim())) return;
    
    const guardado = localStorage.getItem('proyectos');
    const listaExistente = guardado ? JSON.parse(guardado) : [];
    
    let nuevaLista;

    if (esEdicion) {
      // Modo edición - actualizar proyecto existente
      nuevaLista = listaExistente.map(item => 
        item.id === parseInt(id) 
          ? {
              ...item,
              titulo: titulo,
              repositorio: repositorio,
              sitioEnVivo: sitioEnVivo,
              descripcion: descripcion
            }
          : item
      );
    } else {
      // Modo creación - agregar nuevo proyecto
      const nuevoProyecto = {
        id: Date.now(),
        titulo: titulo,
        repositorio: repositorio,
        sitioEnVivo: sitioEnVivo,
        descripcion: descripcion,
        fecha: new Date().toLocaleDateString('es-ES')
      };
      nuevaLista = [...listaExistente, nuevoProyecto];
    }

    localStorage.setItem('proyectos', JSON.stringify(nuevaLista));
    navigate("/proyectos");
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: '#2b2422' }}>
              {esEdicion ? '✏️ Editar Proyecto' : '➕ Nuevo Proyecto'}
            </h2>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate("/proyectos")}
            >
              ⬅️ Volver
            </button>
          </div>

          {/* Formulario */}
          <div className="card p-4 shadow-sm border-0">
            <div className="mb-3">
              <label className="form-label">
                <strong>🚀 Título del Proyecto:</strong>
              </label>
              <input
                type="text"
                className="form-control"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Mi Portfolio Personal"
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <strong>📂 Repositorio (GitHub):</strong>
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={repositorio}
                    onChange={(e) => setRepositorio(e.target.value)}
                    placeholder="Ej: https://github.com/tu-usuario/tu-proyecto"
                  />
                  <small className="text-muted">
                    💡 Enlace al código fuente
                  </small>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <strong>🌐 Sitio en Vivo:</strong>
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={sitioEnVivo}
                    onChange={(e) => setSitioEnVivo(e.target.value)}
                    placeholder="Ej: https://tu-proyecto.netlify.app"
                  />
                  <small className="text-muted">
                    💡 Enlace donde está publicado
                  </small>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">
                <strong>📝 Descripción (Opcional):</strong>
              </label>
              <textarea
                className="form-control"
                rows="4"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe brevemente tu proyecto, tecnologías utilizadas, funcionalidades, etc."
              />
            </div>
            
            <div className="d-grid gap-2">
              <button 
                className="btn btn-lg"
                onClick={guardarProyecto}
                disabled={!titulo.trim() || (!repositorio.trim() && !sitioEnVivo.trim())}
                style={{ 
                  backgroundColor: esEdicion ? '#b1832d' : '#16709f', 
                  color: 'white' 
                }}
              >
                {esEdicion ? '💾 Guardar Cambios' : '💾 Guardar Proyecto'}
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate("/proyectos")}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="card mt-4 border-0 shadow-sm">
            <div className="card-body">
              <h6 style={{ color: '#c62b28' }}>💡 Información:</h6>
              <ul className="list-unstyled small text-muted">
                <li>• <strong>Título:</strong> Nombre identificador de tu proyecto</li>
                <li>• <strong>Repositorio:</strong> Enlace al código (GitHub, GitLab, etc.)</li>
                <li>• <strong>Sitio en Vivo:</strong> Donde está publicado (Netlify, Vercel, etc.)</li>
                <li>• <strong>Descripción:</strong> Detalles sobre tecnologías y funcionalidades</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}