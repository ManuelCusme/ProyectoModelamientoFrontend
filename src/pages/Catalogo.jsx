import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ordenPrecio, setOrdenPrecio] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const provincias = [
    "Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi",
    "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura",
    "Loja", "Los Ríos", "Manabí", "Morona Santiago", "Napo",
    "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo de los Tsáchilas",
    "Sucumbíos", "Tungurahua", "Zamora Chinchipe"
  ];

  const categorias = [
    "Electrónicos", "Ropa", "Hogar", "Deportes", "Libros",
    "Juguetes", "Salud y Belleza", "Automotriz", "Mascotas", "Otros"
  ];

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setLoading(false);
    }
  }

  async function buscarProductos() {
    try {
      setLoading(true);
      const res = await api.get(`/productos/buscar?nombre=${busqueda}`);
      setProductos(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error buscando productos:", err);
      setLoading(false);
    }
  }

  function filtrarProductos() {
    let productosFiltrados = [...productos];

    if (categoria) {
      productosFiltrados = productosFiltrados.filter(p => p.tipo?.toLowerCase() === categoria.toLowerCase());
    }

    if (ordenPrecio === "asc") {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenPrecio === "desc") {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    if (ubicacion) {
      productosFiltrados = productosFiltrados.filter(p => p.ubicacion?.toLowerCase().includes(ubicacion.toLowerCase()));
    }

    return productosFiltrados;
  }

  function handleLogout() {
    localStorage.removeItem("user");
    nav("/");
  }

  const productosMostrar = filtrarProductos();

  return (
    <div style={{ minHeight: "100vh", background: "white", display: "flex", fontFamily: "Arial, sans-serif" }}>
      
      {/* Sidebar Azul (Izquierda) */}
      <div style={{
        width: "280px",
        background: "#00ccff",
        color: "white",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Nombre de la Empresa */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "50px", paddingBottom: "20px", borderBottom: "2px solid rgba(255,255,255,0.3)" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🛒</div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#1a237e" }}>VEYCOFLASH</h1>
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button onClick={() => nav("/publicar")} style={{ background: "rgba(255,255,255,0.3)", color: "#1a237e", border: "2px solid rgba(255,255,255,0.5)", padding: "15px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", textAlign: "left" }}>➕ Publicar Producto</button>
            <button onClick={() => nav("/perfil")} style={{ background: "rgba(255,255,255,0.2)", color: "#1a237e", border: "none", padding: "15px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", textAlign: "left" }}>👤 Mi Perfil</button>
            <button onClick={() => nav("/favoritos")} style={{ background: "rgba(255,255,255,0.2)", color: "#1a237e", border: "none", padding: "15px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", textAlign: "left" }}>❤️ Favoritos</button>
            <button onClick={() => nav("/historial")} style={{ background: "rgba(255,255,255,0.2)", color: "#1a237e", border: "none", padding: "15px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", textAlign: "left" }}>📊 Historial</button>
          </div>
        </nav>
      </div>

      {/* Contenido Principal (Derecha - Blanco) */}
      <div style={{ flex: 1, padding: "30px 40px", background: "white", display: "flex", flexDirection: "column" }}>
        
        {/* Header con Título y Botón Cerrar Sesión */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#00ccff", fontSize: "36px", fontWeight: "bold", margin: "0" }}>Catálogo</h1>
          <button onClick={handleLogout} style={{ background: "#ff4444", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>🚪 Cerrar Sesión</button>
        </div>

        {/* Filtros */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px", padding: "20px", background: "#f8f9fa", borderRadius: "12px", border: "1px solid #e9ecef" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>🔍 Buscar</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Nombre del producto..." style={{ flex: 1, padding: "10px 12px", border: "1px solid #ddd", borderRadius: "6px" }} />
              <button onClick={buscarProductos} style={{ background: "#00ccff", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Buscar</button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>📂 Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "6px", background: "white" }}>
              <option value="">Todas las categorías</option>
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>💰 Precio</label>
            <select value={ordenPrecio} onChange={(e) => setOrdenPrecio(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "6px", background: "white" }}>
              <option value="">Sin ordenar</option>
              <option value="asc">Menor a Mayor</option>
              <option value="desc">Mayor a Menor</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>📍 Ubicación</label>
            <select value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "6px", background: "white" }}>
              <option value="">Todas las provincias</option>
              {provincias.map(prov => <option key={prov} value={prov}>{prov}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}><p style={{ fontSize: "18px", color: "#666" }}>Cargando productos...</p></div>
        ) : productosMostrar.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}><p style={{ fontSize: "18px", color: "#666" }}>No se encontraron productos</p></div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
            {productosMostrar.map(producto => {
              // Usar la primera imagen disponible
              const imagenPrincipal = producto.imagenUrl1 || producto.imagenUrl2 || producto.imagenUrl3 || producto.imagenUrl4 || producto.imagenUrl5 || null;
              return (
                <div key={producto.id} style={{ border: "1px solid #e9ecef", borderRadius: "12px", padding: "20px", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", transition: "transform 0.2s ease", cursor: "pointer" }}>
                  <div style={{ width: "100%", height: "200px", background: "#f8f9fa", borderRadius: "8px", marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {imagenPrincipal ? (
                      <img src={imagenPrincipal} alt={producto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ color: "#6c757d", fontSize: "14px" }}>🖼️ Sin imagen</span>
                    )}
                  </div>

                  <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", fontWeight: "bold", color: "#333" }}>{producto.nombre}</h3>
                  <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666", lineHeight: "1.4" }}>{(producto.descripcion || "").substring(0, 100)}...</p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold", color: "#00ccff" }}>${producto.precio}</span>
                    <button onClick={() => nav(`/producto/${producto.id}`)} style={{ background: "#00ccff", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>Ver Detalle</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}