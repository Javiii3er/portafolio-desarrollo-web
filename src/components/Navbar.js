import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    // Mantenemos las clases y la sombra de tu versión actual
    <nav className="navbar navbar-expand-lg umg-navbar shadow-sm">
      <div className="container-fluid">
        {/* Marca MEJORADA: Incluye el logo pequeño y el texto */}
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <img 
            src="/umg.png" 
            alt="UMG" 
            style={{ height: '30px', marginRight: '8px' }} // Logo pequeño
          />
          {/* Usamos el color dorado para el texto del portafolio, si está definido en tu CSS */}
          <span className="umg-text-dorado">Portafolio Académico</span>
        </Link>

        {/* Botón de Hamburguesa para Móviles (Necesario para responsividad) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavUMG"
          aria-controls="navbarNavUMG"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido del Navbar */}
        <div className="collapse navbar-collapse" id="navbarNavUMG">
          <ul className="navbar-nav me-auto">
            {/* Mantener todos los enlaces de navegación claros */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/investigaciones">Investigaciones</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/proyectos">Proyectos</Link>
            </li>
          </ul>

          {/* Texto Contextual a la derecha */}
          <span className="navbar-text umg-text-dorado fw-semibold">
            Universidad Mariano Gálvez
          </span>
        </div>
      </div>
    </nav>
  );
}