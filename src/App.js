import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import PublicarProducto from './pages/PublicarProducto';
import DetalleProducto from './pages/DetalleProducto';
import Favoritos from './pages/Favoritos';
import Historial from './pages/Historial';
import Perfil from './pages/Perfil';
import EditarProducto from "./pages/EditarProducto";
import VerificarEmail from "./pages/VerificarEmail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/publicar" element={<PublicarProducto />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editar-producto/:id" element={<EditarProducto />} />
        <Route path="/verificar" element={<VerificarEmail />} />
      </Routes>
    </Router>
  );
}

export default App;