import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
// Componentes de Investigaciones
import Investigaciones from "./components/investigaciones/Investigaciones";
import InvestigacionIndividual from "./components/investigaciones/InvestigacionIndividual";
import GlosarioIndividual from "./components/investigaciones/GlosarioIndividual";
import FormularioInvestigacion from "./components/investigaciones/FormularioInvestigacion";
// Componentes de Proyectos
import Proyectos from "./components/proyectos/Proyectos";
import FormularioProyecto from "./components/proyectos/FormularioProyecto";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Rutas de Investigaciones (Actualizadas) */}
        <Route path="/investigaciones" element={<Investigaciones />} />
        <Route path="/nueva-investigacion" element={<FormularioInvestigacion />} />
        {/* Nueva Ruta para la edición de una investigación específica */}
        <Route path="/editar-investigacion/:id" element={<FormularioInvestigacion />} /> 
        <Route path="/investigacion/:id" element={<InvestigacionIndividual />} />
        <Route path="/glosario/:id" element={<GlosarioIndividual />} />
        
        {/* Rutas de Proyectos */}
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/nuevo-proyecto" element={<FormularioProyecto />} />
        <Route path="/editar-proyecto/:id" element={<FormularioProyecto />} /> 
      </Routes>
    </Router>
  );
}

export default App;