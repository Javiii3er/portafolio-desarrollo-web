export default function Home() {
  const UMG_COLOR_AZUL = '#16709f'; // Azul
  const UMG_COLOR_ROJO = '#c62b28'; // Rojo
  const UMG_COLOR_ORO = '#b1832d'; // Dorado/Oro

  return (
    <div className="container mt-5">
      
      {/*Contenido principal centrado */}
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          
          {/* 1. Foto de Perfil*/}
          <img 
            src="/foto-perfil.jpeg"
            alt="José Luis" 
            className="rounded-circle mb-4 border border-3 shadow"
            style={{ 
              width: '140px', 
              height: '140px', 
              objectFit: 'cover',
              border: `3px solid ${UMG_COLOR_ORO}`
            }}
          />

          {/* 2. Información personal */}
          <div className="mb-4">
            <h1 className="display-4 fw-bold" style={{ color: UMG_COLOR_AZUL }}>
              ¡Hola, soy Javiii3r Rivera! 👋
            </h1>
            <p className="lead fs-4 fw-normal" style={{ color: UMG_COLOR_AZUL }}>
              Desarrollador Web & Estudiante de Programación
            </p>
          </div>

          {/* 3. Tarjeta de presentación (Se mantiene el diseño mejorado) */}
          <div className="card mt-5 mb-5 border-0 shadow-lg">
            <div 
              className="card-body p-4" 
              style={{ 
                backgroundColor: '#ffffff',
                borderLeft: `5px solid ${UMG_COLOR_ORO}`,
                borderRadius: '10px'
              }}
            >
              <h4 className="card-title fw-bold" style={{ color: UMG_COLOR_ROJO }}>
                Bienvenido a mi Portafolio Académico
              </h4>
              <p className="fs-6 mb-0 text-dark" style={{ lineHeight: '1.6' }}>
                Este portafolio documenta mi trayectoria académica en la <strong>Universidad Mariano Gálvez</strong>, 
                donde muestro mis investigaciones, proyectos de programación y el crecimiento continuo en el 
                curso de Desarrollo de Web. Aquí podrás explorar mi trabajo y evolución como profesional.
              </p>
            </div>
          </div>

          {/* 4. Tarjetas: Formación y Especialidades */}
          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <div className="card h-100 border-0 shadow-sm text-start">
                <div className="card-body">
                  <h6 className="fw-bold" style={{ color: UMG_COLOR_AZUL }}>🎓 Formación</h6>
                  <p className="small mb-0">Estudiante de Ingeniería en Sistemas</p>
                  <p className="small mb-0">Universidad Mariano Gálvez</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card h-100 border-0 shadow-sm text-start">
                <div className="card-body">
                  <h6 className="fw-bold" style={{ color: UMG_COLOR_AZUL }}>💼 Especialidades</h6>
                  <p className="small mb-0">Desarrollo Web (React & JavaScript)</p>
                  <p className="small mb-0">Base de Datos (SQL)</p>
                  <p className="small mb-0">Metodologías Ágiles</p>
                </div>
              </div>
            </div>
          </div>
          
            <p className="fst-italic fs-5" style={{ color: UMG_COLOR_ROJO }}>
              "Conoceréis la verdad y la verdad os hará libres"
            </p>
        </div>
      </div>
    </div>
  );
}