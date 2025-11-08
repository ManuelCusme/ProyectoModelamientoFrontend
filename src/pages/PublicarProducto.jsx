import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function PublicarProducto() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipo, setTipo] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [estadoProducto, setEstadoProducto] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const estadosProducto = [
    "Nuevo",
    "Semi nuevo",
    "Usado - Buen estado",
    "Usado - Estado regular",
    "Para repuestos"
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (!nombre || !precio || !ubicacion || !tipo || !estadoProducto) {
      setError("Por favor completa los campos obligatorios");
      return;
    }

    if (parseFloat(precio) <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    if (parseInt(cantidad) <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    try {
      // Obtener usuario del localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!user || !user.id) {
        setError("Debes iniciar sesión para publicar productos");
        nav("/login");
        return;
      }

      // Crear producto
      await api.post(`/productos?vendedorId=${user.id}`, {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        imagenUrl,
        ubicacion,
        tipo,
        cantidad: parseInt(cantidad),
        estadoProducto
      });

      setSuccess("¡Producto publicado exitosamente!");
      
      // Limpiar formulario
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagenUrl("");
      setUbicacion("");
      setTipo("");
      setCantidad("1");
      setEstadoProducto("");

      // Redirigir al catálogo después de 2 segundos
      setTimeout(() => {
        nav("/catalogo");
      }, 2000);

    } catch (err) {
      setError(err.response?.data || "Error al publicar el producto");
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    nav("/");
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "white", 
      display: "flex",
      fontFamily: "Arial, sans-serif"
    }}>
      
      {/* Sidebar Azul */}
      <div style={{
        width: "280px",
        background: "#00ccff",
        color: "white",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column"
      }}>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "50px",
          paddingBottom: "20px",
          borderBottom: "2px solid rgba(255,255,255,0.3)"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            backdropFilter: "blur(10px)"
          }}>
            🛒
          </div>
          <h1 style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1a237e"
          }}>
            VEYCOFLASH
          </h1>
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}>
            <button 
              onClick={() => nav("/catalogo")}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#1a237e",
                border: "none",
                padding: "15px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "left",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
            >
              🏠 Catálogo
            </button>

            <button 
              onClick={() => nav("/publicar")}
              style={{
                background: "rgba(255,255,255,0.4)",
                color: "#1a237e",
                border: "none",
                padding: "15px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "left",
                backdropFilter: "blur(10px)"
              }}
            >
              ➕ Publicar Producto
            </button>

            <button style={{
              background: "rgba(255,255,255,0.2)",
              color: "#1a237e",
              border: "none",
              padding: "15px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "left",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
            >
              👤 Mi Perfil
            </button>
          </div>
        </nav>
      </div>

      {/* Contenido Principal */}
      <div style={{
        flex: 1,
        padding: "30px 40px",
        background: "white",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <h1 style={{
            color: "#00ccff",
            fontSize: "36px",
            fontWeight: "bold",
            margin: "0"
          }}>
            Publicar Producto
          </h1>
          
          <button 
            onClick={handleLogout}
            style={{
              background: "#ff4444",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.background = "#cc0000"}
            onMouseLeave={(e) => e.target.style.background = "#ff4444"}
          >
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Formulario */}
        <div style={{
          maxWidth: "700px",
          background: "#f8f9fa",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #e9ecef"
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Nombre del producto */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                Nombre del producto *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: iPhone 11 64GB"
                style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe tu producto..."
                rows="4"
                style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }}
              />
            </div>

            {/* Precio, Cantidad y Categoría */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                  Precio (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0.00"
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                  Cantidad *
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="1"
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                  Categoría *
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", background: "white" }}
                  required
                >
                  <option value="">Selecciona</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estado del producto y Ubicación */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                  Estado del producto *
                </label>
                <select
                  value={estadoProducto}
                  onChange={(e) => setEstadoProducto(e.target.value)}
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", background: "white" }}
                  required
                >
                  <option value="">Selecciona el estado</option>
                  {estadosProducto.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                  Ubicación *
                </label>
                <select
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", background: "white" }}
                  required
                >
                  <option value="">Selecciona tu provincia</option>
                  {provincias.map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* URL de imagen */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                URL de imagen
              </label>
              <input
                type="url"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: "12px", color: "#999", margin: "4px 0 0 0" }}>
                Opcional: Copia y pega la URL de una imagen desde internet
              </p>
            </div>

            {/* Mensajes de error/éxito */}
            {error && (
              <div style={{ background: "#fee", border: "1px solid #fcc", color: "#c33", padding: "12px", borderRadius: "6px", fontSize: "14px" }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: "#d4edda", border: "1px solid #c3e6cb", color: "#155724", padding: "12px", borderRadius: "6px", fontSize: "14px" }}>
                {success}
              </div>
            )}

            {/* Botones */}
            <div style={{ display: "flex", gap: "15px" }}>
              <button
                type="submit"
                style={{ 
                  flex: 1,
                  background: "#00ccff", 
                  color: "white", 
                  fontWeight: "600", 
                  padding: "14px", 
                  borderRadius: "8px", 
                  border: "none", 
                  cursor: "pointer", 
                  fontSize: "16px", 
                  transition: "background 0.3s"
                }}
                onMouseEnter={(e) => e.target.style.background = "#0099cc"}
                onMouseLeave={(e) => e.target.style.background = "#00ccff"}
              >
                📤 Publicar Producto
              </button>

              <button
                type="button"
                onClick={() => nav("/catalogo")}
                style={{ 
                  background: "#6c757d", 
                  color: "white", 
                  fontWeight: "600", 
                  padding: "14px 24px", 
                  borderRadius: "8px", 
                  border: "none", 
                  cursor: "pointer", 
                  fontSize: "16px", 
                  transition: "background 0.3s"
                }}
                onMouseEnter={(e) => e.target.style.background = "#5a6268"}
                onMouseLeave={(e) => e.target.style.background = "#6c757d"}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}