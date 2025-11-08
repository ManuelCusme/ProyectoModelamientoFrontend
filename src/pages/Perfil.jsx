import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [misProductos, setMisProductos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    productosActivos: 0,
    totalProductos: 0,
    productosOcultos: 0,
    ventasTotales: 0
  });
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    cargarPerfil();
  }, []);

  async function cargarPerfil() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      nav("/login");
      return;
    }

    try {
      setUsuario(user);
      
      // Cargar productos del usuario
      const resProductos = await api.get(`/productos/vendedor/${user.id}`);
      setMisProductos(resProductos.data);

      // Calcular estadísticas
      const activos = resProductos.data.filter(p => p.estado === "ACTIVO").length;
      const ocultos = resProductos.data.filter(p => p.estado === "OCULTO").length;
      
      setEstadisticas({
        productosActivos: activos,
        totalProductos: resProductos.data.length,
        productosOcultos: ocultos,
        ventasTotales: 0 // Por ahora en 0, después puedes implementar ventas
      });

      setLoading(false);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setLoading(false);
    }
  }

  async function cambiarEstadoProducto(productoId, nuevoEstado) {
    try {
      await api.put(`/productos/${productoId}/estado?nuevoEstado=${nuevoEstado}`);
      // Recargar productos
      cargarPerfil();
      alert(`Producto ${nuevoEstado === "ACTIVO" ? "activado" : "ocultado"} correctamente`);
    } catch (err) {
      alert("Error al cambiar estado del producto");
      console.error(err);
    }
  }

  async function eliminarProducto(productoId, nombreProducto) {
    if (window.confirm(`¿Estás seguro que deseas eliminar "${nombreProducto}"?\n\nEsta acción no se puede deshacer.`)) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        await api.delete(`/productos/${productoId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        cargarPerfil();
        alert("Producto eliminado correctamente");
      } catch (err) {
        console.error("Error completo:", err.response || err);
        const mensaje = err.response?.data?.message || "Error al eliminar el producto";
        alert(mensaje);
      }
    }
  }

  function editarProducto(productoId) {
    nav(`/editar-producto/${productoId}`);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    nav("/");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "18px", color: "#666" }}>Cargando perfil...</p>
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
                background: "rgba(255,255,255,0.4)",
                color: "#1a237e",
                border: "2px solid rgba(255,255,255,0.5)",
                padding: "15px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "left",
                backdropFilter: "blur(10px)"
              }}
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
        background: "#f8f9fa"
      }}>
        
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: "#00ccff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "white"
            }}>
              👤
            </div>
            <div>
              <h1 style={{
                color: "#333",
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0 0 4px 0"
              }}>
                {usuario?.nombre} {usuario?.apellido}
              </h1>
              <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
                {usuario?.email}
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button 
              onClick={() => {/* Funcionalidad pendiente */}}
              style={{
                background: "#00ccff",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "background 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "#00b3e6"}
              onMouseLeave={(e) => e.target.style.background = "#00ccff"}
            >
              💬 Mensajes
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
                fontWeight: "bold",
                transition: "background 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "#cc0000"}
              onMouseLeave={(e) => e.target.style.background = "#ff4444"}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "24px",
            borderRadius: "12px",
            color: "white",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>📦</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>
              {estadisticas.productosActivos}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>ACTIVOS</div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            padding: "24px",
            borderRadius: "12px",
            color: "white",
            boxShadow: "0 4px 12px rgba(240, 147, 251, 0.3)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>📊</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>
              {estadisticas.totalProductos}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>TOTAL</div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #fad961 0%, #f76b1c 100%)",
            padding: "24px",
            borderRadius: "12px",
            color: "white",
            boxShadow: "0 4px 12px rgba(250, 217, 97, 0.3)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>⚠️</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>
              {estadisticas.productosOcultos}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>OCULTOS</div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            padding: "24px",
            borderRadius: "12px",
            color: "white",
            boxShadow: "0 4px 12px rgba(79, 172, 254, 0.3)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>💰</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>
              ${estadisticas.ventasTotales}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>VENTAS</div>
          </div>
        </div>

        {/* Mis Publicaciones */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              margin: 0
            }}>
              📋 MIS ÚLTIMAS PUBLICACIONES
            </h2>
            <button
              onClick={() => nav("/publicar")}
              style={{
                background: "#00ccff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold"
              }}
            >
              + NUEVA PUBLICACIÓN
            </button>
          </div>

          {misProductos.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px",
              color: "#999"
            }}>
              <div style={{ fontSize: "60px", marginBottom: "16px" }}>📦</div>
              <p>No tienes publicaciones aún</p>
              <button
                onClick={() => nav("/publicar")}
                style={{
                  background: "#00ccff",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginTop: "12px"
                }}
              >
                Publicar mi primer producto
              </button>
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              {misProductos.slice(0, 5).map(producto => (
                <div 
                  key={producto.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef"
                  }}
                >
                  <div style={{ display: "flex", gap: "16px", alignItems: "center", flex: 1 }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      background: "#e9ecef",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0
                    }}>
                      {producto.imagenUrl ? (
                        <img 
                          src={producto.imagenUrl} 
                          alt={producto.nombre}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "24px" }}>📦</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                        margin: "0 0 4px 0"
                      }}>
                        {producto.nombre}
                      </h3>
                      <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#666" }}>
                        <span>${producto.precio}</span>
                        <span>•</span>
                        <span>{producto.ubicacion}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: producto.estado === "ACTIVO" ? "#d4edda" : "#f8d7da",
                      color: producto.estado === "ACTIVO" ? "#155724" : "#721c24"
                    }}>
                      {producto.estado === "ACTIVO" ? "Activo" : "Oculto"}
                    </span>
                    
                    <button
                      onClick={() => nav(`/producto/${producto.id}`)}
                      style={{
                        background: "#00ccff",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "background 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#00b3e6"}
                      onMouseLeave={(e) => e.target.style.background = "#00ccff"}
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => editarProducto(producto.id)}
                      style={{
                        background: "#17a2b8",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "background 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#138496"}
                      onMouseLeave={(e) => e.target.style.background = "#17a2b8"}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      onClick={() => cambiarEstadoProducto(producto.id, producto.estado === "ACTIVO" ? "OCULTO" : "ACTIVO")}
                      style={{
                        background: producto.estado === "ACTIVO" ? "#ffc107" : "#28a745",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "background 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.target.style.background = producto.estado === "ACTIVO" ? "#e0a800" : "#218838"}
                      onMouseLeave={(e) => e.target.style.background = producto.estado === "ACTIVO" ? "#ffc107" : "#28a745"}
                    >
                      {producto.estado === "ACTIVO" ? "Ocultar" : "Activar"}
                    </button>

                    <button
                      onClick={() => eliminarProducto(producto.id, producto.nombre)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "background 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#c82333"}
                      onMouseLeave={(e) => e.target.style.background = "#dc3545"}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {misProductos.length > 5 && (
                <button
                  style={{
                    background: "transparent",
                    color: "#00ccff",
                    border: "2px solid #00ccff",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "8px"
                  }}
                >
                  Ver todas mis publicaciones ({misProductos.length})
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}