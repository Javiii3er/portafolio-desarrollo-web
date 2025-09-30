import { useEffect } from "react";

export default function ModalConfirmacion({ 
  isOpen, 
  onClose, 
  onConfirm, 
  titulo = "Confirmar acción",
  mensaje = "¿Estás seguro de que quieres realizar esta acción?",
  textoConfirmar = "Sí, eliminar",
  textoCancelar = "Cancelar" 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0" style={{ backgroundColor: '#c62b28', color: 'white' }}>
            <h5 className="modal-title">⚠️ {titulo}</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body py-4">
            <p className="mb-0" style={{ fontSize: '16px', lineHeight: '1.5' }}>
              {mensaje}
            </p>
          </div>
          <div className="modal-footer border-0">
            <button 
              type="button" 
              className="btn btn-outline-secondary" 
              onClick={onClose}
            >
              {textoCancelar}
            </button>
            <button 
              type="button" 
              className="btn"
              style={{ backgroundColor: '#c62b28', color: 'white' }}
              onClick={onConfirm}
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}