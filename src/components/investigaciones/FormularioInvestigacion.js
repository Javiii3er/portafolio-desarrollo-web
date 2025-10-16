// FormularioInvestigacion.js
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalConfirmacion from "../ModalConfirmacion";

export default function FormularioInvestigacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  
  const [texto, setTexto] = useState("");
  const [titulo, setTitulo] = useState("");
  const [tipoContenido, setTipoContenido] = useState("todo");
  const [esEdicion, setEsEdicion] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Cargar investigación si estamos editando
  useEffect(() => {
    if (id) {
      const guardado = localStorage.getItem('investigaciones');
      if (guardado) {
        const lista = JSON.parse(guardado);
        const investigacion = lista.find(item => item.id === parseInt(id));
        
        if (investigacion) {
          setTitulo(investigacion.titulo);
          setTexto(investigacion.contenido);
          setTipoContenido(investigacion.tipo);
          setEsEdicion(true);
        }
      }
    }
  }, [id]);

  // Funciones MEJORADAS para el editor enriquecido
  const aplicarFormato = (comando, valor = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Intentar usar execCommand primero
      const exito = document.execCommand(comando, false, valor);
      
      if (!exito) {
        // Fallback manual para negrita
        if (comando === 'bold') {
          const seleccion = window.getSelection();
          if (seleccion.toString()) {
            const range = seleccion.getRangeAt(0);
            const span = document.createElement('strong');
            span.textContent = seleccion.toString();
            range.deleteContents();
            range.insertNode(span);
          }
        }
        // Fallback manual para cursiva
        else if (comando === 'italic') {
          const seleccion = window.getSelection();
          if (seleccion.toString()) {
            const range = seleccion.getRangeAt(0);
            const span = document.createElement('em');
            span.textContent = seleccion.toString();
            range.deleteContents();
            range.insertNode(span);
          }
        }
      }
      
      // Actualizar el estado
      setTexto(editorRef.current.innerHTML);
    }
  };

  const insertarCaratula = () => {
    const caratula = `
      <div style="text-align: center; margin-bottom: 40px; padding: 30px; border: 2px solid #b1832d; border-radius: 10px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
        <img src="/umg.png" alt="UMG" style="height: 80px; margin-bottom: 20px;">
        <h1 style="color: #16709f; margin: 10px 0; font-size: 24px;">UNIVERSIDAD MARIANO GÁLVEZ DE GUATEMALA</h1>
        <h2 style="color: #2b2422; margin: 10px 0; font-size: 20px;">FACULTAD DE INGENIERÍA EN SISTEMAS</h2>
        <div style="margin: 20px 0;">
          <p style="margin: 5px 0; color: #c62b28;"><strong>DOCENTE:</strong> Carmelo Estuardo Mayen Monterroso</p>
          <p style="margin: 5px 0; color: #c62b28;"><strong>CURSO:</strong> Desarrollo Web</p>
          <p style="margin: 5px 0; color: #c62b28;"><strong>ESTUDIANTE:</strong> José Luis</p>
          <p style="margin: 5px 0; color: #c62b28;"><strong>CARNET:</strong> [Tu Carnet]</p>
        </div>
        <h3 style="color: #b1832d; margin: 20px 0; font-size: 22px;">${titulo || '[Título de la Investigación]'}</h3>
        <p style="color: #666; margin: 0;">Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
      </div>
      <br>
    `;
    
    if (editorRef.current) {
      // Insertar al principio
      editorRef.current.innerHTML = caratula + editorRef.current.innerHTML;
      setTexto(editorRef.current.innerHTML);
    }
  };

  // Función MEJORADA para manejar cambios
  const manejarCambioEditor = () => {
    if (editorRef.current) {
      setTexto(editorRef.current.innerHTML);
    }
  };

  const guardarInvestigacion = () => {
    if (!texto.trim() || !titulo.trim()) {
      alert("Por favor, completa el título y el contenido");
      return;
    }
    
    const guardado = localStorage.getItem('investigaciones');
    const listaExistente = guardado ? JSON.parse(guardado) : [];
    
    let nuevaLista;

    if (esEdicion) {
      nuevaLista = listaExistente.map(item => 
        item.id === parseInt(id) 
          ? {
              ...item,
              titulo: titulo,
              contenido: texto,
              tipo: tipoContenido
            }
          : item
      );
    } else {
      const nuevaInvestigacion = {
        id: Date.now(),
        titulo: titulo,
        contenido: texto,
        fecha: new Date().toLocaleDateString('es-ES'),
        tipo: tipoContenido
      };
      nuevaLista = [...listaExistente, nuevaInvestigacion];
    }

    localStorage.setItem('investigaciones', JSON.stringify(nuevaLista));
    navigate("/investigaciones");
  };

  const handleCancelar = () => {
    if (texto.trim() || titulo.trim()) {
      setShowModal(true);
    } else {
      navigate("/investigaciones");
    }
  };

  const confirmarCancelar = () => {
    setShowModal(false);
    navigate("/investigaciones");
  };

  // Función para limpiar formato
  const limpiarFormato = () => {
    if (editorRef.current) {
      document.execCommand('removeFormat', false, null);
      document.execCommand('unlink', false, null);
      setTexto(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="container mt-4">
      {/* Modal de Confirmación */}
      <ModalConfirmacion
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmarCancelar}
        titulo="Cancelar edición"
        mensaje="¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados."
        textoConfirmar="Sí, cancelar"
        textoCancelar="Seguir editando"
      />

      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: '#2b2422' }}>
              {esEdicion ? '✏️ Editar Investigación' : '📝 Nueva Investigación'}
            </h2>
            <button 
              className="btn btn-outline-secondary"
              onClick={handleCancelar}
            >
              ⬅️ Volver
            </button>
          </div>

          {/* Formulario */}
          <div className="card p-4 shadow-sm border-0">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label"><strong>📄 Título:</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: Análisis de Machine Learning"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label"><strong>📑 Tipo de contenido:</strong></label>
                  <select 
                    className="form-select"
                    value={tipoContenido}
                    onChange={(e) => setTipoContenido(e.target.value)}
                  >
                    <option value="todo">Investigación General</option>
                    <option value="glosario">Glosario/Términos</option>
                    <option value="ensayo">Ensayo</option>
                    <option value="reporte">Reporte</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Barra de herramientas MEJORADA del editor */}
            <div className="mb-3">
              <label className="form-label"><strong>🖊️ Contenido:</strong></label>
              
              <div className="card mb-3 border-0" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="card-body py-2">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    {/* Grupo Formato de Texto */}
                    <div className="btn-group" role="group">
                      <button 
                        type="button" 
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => aplicarFormato('bold')}
                        title="Negrita (Ctrl+B)"
                      >
                        <strong>B</strong>
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => aplicarFormato('italic')}
                        title="Cursiva (Ctrl+I)"
                      >
                        <em>I</em>
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => aplicarFormato('underline')}
                        title="Subrayado (Ctrl+U)"
                      >
                        <u>U</u>
                      </button>
                    </div>
                    
                    {/* Grupo Alineación */}
                    <div className="btn-group" role="group">
                      <button 
                        type="button" 
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => aplicarFormato('justifyLeft')}
                        title="Alinear izquierda"
                      >
                        ⬅️
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => aplicarFormato('justifyCenter')}
                        title="Centrar"
                      >
                        ⬜
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => aplicarFormato('justifyRight')}
                        title="Alinear derecha"
                      >
                        ➡️
                      </button>
                    </div>

                    {/* Grupo Listas */}
                    <div className="btn-group" role="group">
                      <button 
                        type="button" 
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => aplicarFormato('insertUnorderedList')}
                        title="Lista con viñetas"
                      >
                        • Lista
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => aplicarFormato('insertOrderedList')}
                        title="Lista numerada"
                      >
                        1. Lista
                      </button>
                    </div>

                    {/* Grupo Utilidades */}
                    <div className="btn-group" role="group">
                      <button 
                        type="button" 
                        className="btn btn-outline-primary btn-sm"
                        onClick={insertarCaratula}
                        title="Insertar carátula UMG"
                      >
                        🏛️ Carátula
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-warning btn-sm"
                        onClick={limpiarFormato}
                        title="Limpiar formato"
                      >
                        🧹 Limpiar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Área de edición MEJORADA */}
              <div
                ref={editorRef}
                contentEditable
                className="form-control"
                style={{ 
                  minHeight: '400px', 
                  maxHeight: '600px',
                  overflowY: 'auto',
                  border: '1px solid #ced4da',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  backgroundColor: 'white',
                  lineHeight: '1.6',
                  fontFamily: 'Arial, sans-serif',
                  outline: 'none'
                }}
                onInput={manejarCambioEditor}
                onBlur={manejarCambioEditor}
                dangerouslySetInnerHTML={{ __html: texto }}
              />
              
              <div className="mt-2">
                <small className="text-muted">
                  💡 <strong>Instrucciones:</strong> Selecciona texto y usa los botones para aplicar formato
                </small>
              </div>
            </div>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <button 
                className="btn btn-lg"
                onClick={guardarInvestigacion}
                disabled={!texto.trim() || !titulo.trim()}
                style={{ 
                  backgroundColor: esEdicion ? '#b1832d' : '#16709f', 
                  color: 'white',
                  minWidth: '200px'
                }}
              >
                {esEdicion ? '💾 Guardar Cambios' : '💾 Guardar Investigación'}
              </button>
              <button 
                className="btn btn-outline-secondary btn-lg"
                onClick={handleCancelar}
                style={{ minWidth: '120px' }}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>

          {/* Guía de uso MEJORADA */}
          <div className="card mt-4 border-0 shadow-sm">
            <div className="card-body">
              <h6 style={{ color: '#c62b28' }}>🎯 Cómo usar el editor:</h6>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled small">
                    <li>• <strong>Selecciona texto</strong> y haz click en los botones de formato</li>
                    <li>• <strong>Negrita:</strong> Resalta texto → click en <strong>B</strong></li>
                    <li>• <strong>Cursiva:</strong> Resalta texto → click en <em>I</em></li>
                    <li>• <strong>Subrayado:</strong> Resalta texto → click en <u>U</u></li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled small">
                    <li>• <strong>Carátula UMG:</strong> Click en 🏛️ Carátula</li>
                    <li>• <strong>Listas:</strong> Usa • Lista o 1. Lista</li>
                    <li>• <strong>Limpiar:</strong> 🧹 para quitar formato</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}