import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function DetalleProducto() {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [esFavorito, setEsFavorito] = useState(false);
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [motivoReporte, setMotivoReporte] = useState("");
  const [descripcionReporte, setDescripcionReporte] = useState("");
  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    cargarProducto();
    verificarFavorito();
    registrarVista();
  }, [id]);

  async function cargarProducto() {
    try {
      const res = await api.get(`/productos/${id}`);
      setProducto(res.data);
      setLoading(false);
    } catch (err) {
      setError("No se pudo cargar el producto");
      setLoading(false);
    }
  }

  async function verificarFavorito() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await api.get(`/favoritos/check?usuarioId=${user.id}&productoId=${id}`);
      setEsFavorito(res.data);
    } catch (err) {
      console.error("Error verificando favorito:", err);
    }
  }

  async function registrarVista() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      await api.post(`/historial?usuarioId=${user.id}&productoId=${id}`);
    } catch (err) {
      console.error("Error registrando vista:", err);
    }
  }

  async function toggleFavorito() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Debes iniciar sesión para agregar favoritos");
      nav("/login");
      return;
    }

    try {
      if (esFavorito) {
        await api.delete(`/favoritos?usuarioId=${user.id}&productoId=${id}`);
        setEsFavorito(false);
        alert("Eliminado de favoritos");
      } else {
        await api.post(`/favoritos?usuarioId=${user.id}&productoId=${id}`);
        setEsFavorito(true);
        alert("Agregado a favoritos");
      }
    } catch (err) {
      alert("Error al actualizar favoritos");
      console.error(err);
    }
  }

  async function enviarReporte(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Debes iniciar sesión para reportar");
      nav("/login");
      return;
    }

    if (!motivoReporte || !descripcionReporte) {
      alert("Completa todos los campos del reporte");
      return;
    }

    try {
      await api.post("/reportes", {
        usuarioId: user.id,
        productoId: id,
        motivo: motivoReporte,
        descripcion: descripcionReporte
      });
      
      alert("Reporte enviado correctamente");
      setMostrarReporte(false);
      setMotivoReporte("");
      setDescripcionReporte("");
    } catch (err) {
      alert("Error al enviar reporte");
      console.error(err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    nav("/");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "18px", color: "#666" }}>Cargando producto...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <p style={{ fontSize: "18px", color: "#c33" }}>{error || "Producto no encontrado"}</p>
        <button 
          onClick={() => nav("/catalogo")}
          style={{ background: "#00ccff", color: "white", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
        >
          Volver al Catálogo
        </button>
      </div>
    );
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
              ➕ Publicar Producto
            </button>

            <button 
              onClick={() => nav("/favoritos")}
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
              ❤️ Favoritos
            </button>

            <button 
              onClick={() => nav("/historial")}
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
              📊 Historial
            </button>

            <button 
              onClick={() => nav("/perfil")}
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
              👤 Mi Perfil
            </button>
          </div>
        </nav>
      </div>

      {/* Contenido Principal */}
      <div style={{
        flex: 1,
        padding: "30px 40px",
        background: "white"
      }}>
        
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <button 
            onClick={() => nav("/catalogo")}
            style={{
              background: "#f8f9fa",
              color: "#333",
              border: "1px solid #ddd",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            ← Volver al Catálogo
          </button>
          
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
              fontWeight: "bold"
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Detalle del Producto */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          maxWidth: "1200px"
        }}>
          
          {/* Imagen del Producto */}
          <div>
            <div style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              marginBottom: "20px"
            }}>
              {producto.imagenUrl ? (
                <img 
                  src={producto.imagenUrl} 
                  alt={producto.nombre}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "#999" }}>
                  <div style={{ fontSize: "80px", marginBottom: "20px" }}>🖼️</div>
                  <p>Sin imagen disponible</p>
                </div>
              )}
            </div>

            {/* Botones Favorito y Reportar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={toggleFavorito}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "2px solid",
                  borderColor: esFavorito ? "#ff4444" : "#ddd",
                  background: esFavorito ? "#ffe6e6" : "white",
                  color: esFavorito ? "#ff4444" : "#333",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  if (!esFavorito) {
                    e.target.style.background = "#f8f9fa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!esFavorito) {
                    e.target.style.background = "white";
                  }
                }}
              >
                {esFavorito ? "❤️ En Favoritos" : "🤍 Agregar a Favoritos"}
              </button>

              <button
                onClick={() => setMostrarReporte(true)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "2px solid #ddd",
                  background: "white",
                  color: "#333",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => e.target.style.background = "#f8f9fa"}
                onMouseLeave={(e) => e.target.style.background = "white"}
              >
                🚩 Reportar producto
              </button>
            </div>
          </div>

          {/* Información del Producto */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            
            {/* Título y Precio - SIN información de categoría/estado aquí */}
            <div>
              <h1 style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#333",
                margin: "0 0 16px 0"
              }}>
                {producto.nombre}
              </h1>
              <div style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#00ccff",
                marginBottom: "8px"
              }}>
                ${producto.precio?.toFixed(2)}
              </div>
            </div>

            {/* Botones de Compra */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button 
                disabled={producto.cantidad <= 0}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "none",
                  background: producto.cantidad > 0 ? "#ffc107" : "#ccc",
                  color: producto.cantidad > 0 ? "#000" : "#666",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: producto.cantidad > 0 ? "pointer" : "not-allowed"
                }}
              >
                {producto.cantidad > 0 ? "Agregar al carrito" : "Agotado"}
              </button>
              
              <button 
                disabled={producto.cantidad <= 0}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "none",
                  background: producto.cantidad > 0 ? "#ff5722" : "#ccc",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: producto.cantidad > 0 ? "pointer" : "not-allowed"
                }}
              >
                {producto.cantidad > 0 ? "Comprar ahora" : "Sin stock"}
              </button>
            </div>

            {/* Información del Vendedor - SOLO NOMBRE */}
            {producto.vendedor && (
              <div style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e9ecef"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: "0 0 12px 0"
                }}>
                  Información del Vendedor
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ color: "#666" }}>Vendedor:</span>
                    <span style={{ color: "#333", fontWeight: "600" }}>
                      {producto.vendedor.nombre} {producto.vendedor.apellido}
                    </span>
                  </div>
                  {/* BOTÓN DE MENSAJE */}
                  <button style={{
                    background: "#00ccff",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "8px",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#0099cc"}
                  onMouseLeave={(e) => e.target.style.background = "#00ccff"}
                  >
                    💬 Enviar mensaje al vendedor
                  </button>
                </div>
              </div>
            )}

            {/* Detalles del producto - COMPLETO con estado y categoría */}
            <div style={{
              background: "#f8f9fa",
              padding: "20px",
              borderRadius: "12px"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#333",
                margin: "0 0 16px 0"
              }}>
                Detalles del producto
              </h3>
              
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", padding: "12px 0", borderBottom: "1px solid #ddd" }}>
                  <span style={{ color: "#666", fontWeight: "600", width: "40%" }}>Código:</span>
                  <span style={{ color: "#333" }}>{producto.codigo || "N/A"}</span>
                </div>
                <div style={{ display: "flex", padding: "12px 0", borderBottom: "1px solid #ddd" }}>
                  <span style={{ color: "#666", fontWeight: "600", width: "40%" }}>Estado:</span>
                  <span style={{ color: "#333", fontWeight: "bold" }}>{producto.estadoProducto || "No especificado"}</span>
                </div>
                <div style={{ display: "flex", padding: "12px 0", borderBottom: "1px solid #ddd" }}>
                  <span style={{ color: "#666", fontWeight: "600", width: "40%" }}>Categoría:</span>
                  <span style={{ color: "#333" }}>{producto.tipo}</span>
                </div>
                <div style={{ display: "flex", padding: "12px 0", borderBottom: "1px solid #ddd" }}>
                  <span style={{ color: "#666", fontWeight: "600", width: "40%" }}>Ubicación:</span>
                  <span style={{ color: "#333" }}>📍 {producto.ubicacion}</span>
                </div>
                <div style={{ display: "flex", padding: "12px 0" }}>
                  <span style={{ color: "#666", fontWeight: "600", width: "40%" }}>Stock:</span>
                  <span style={{ 
                    color: producto.cantidad > 0 ? "#28a745" : "#dc3545",
                    fontWeight: "bold"
                  }}>
                    {producto.cantidad > 0 ? `${producto.cantidad} unidades` : "Agotado"}
                  </span>
                </div>
              </div>

              {producto.descripcion && (
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                    Descripción:
                  </h4>
                  <p style={{
                    color: "#666",
                    lineHeight: "1.6",
                    margin: 0,
                    whiteSpace: "pre-line"
                  }}>
                    {producto.descripcion}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Reporte */}
      {mostrarReporte && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "30px",
            maxWidth: "500px",
            width: "90%"
          }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>
              Reportar producto
            </h2>
            
            <form onSubmit={enviarReporte} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                  Motivo del reporte *
                </label>
                <select
                  value={motivoReporte}
                  onChange={(e) => setMotivoReporte(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                  required
                >
                  <option value="">Selecciona un motivo</option>
                  <option value="SPAM">Spam o contenido repetitivo</option>
                  <option value="CONTENIDO_INAPROPIADO">Contenido inapropiado</option>
                  <option value="FRAUDE">Posible fraude o estafa</option>
                  <option value="PRECIO_INCORRECTO">Precio incorrecto</option>
                  <option value="OTRO">Otro motivo</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>
                  Descripción *
                </label>
                <textarea
                  value={descripcionReporte}
                  onChange={(e) => setDescripcionReporte(e.target.value)}
                  placeholder="Explica por qué reportas este producto..."
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    resize: "vertical",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: "#ff4444",
                    color: "white",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Enviar reporte
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarReporte(false);
                    setMotivoReporte("");
                    setDescripcionReporte("");
                  }}
                  style={{
                    flex: 1,
                    background: "#6c757d",
                    color: "white",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}