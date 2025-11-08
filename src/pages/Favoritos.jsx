import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    cargarFavoritos();
  }, []);

  async function cargarFavoritos() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      nav("/login");
      return;
    }

    try {
      const res = await api.get(`/favoritos/usuario/${user.id}`);
      setFavoritos(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
      setLoading(false);
    }
  }

  async function eliminarFavorito(productoId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      await api.delete(`/favoritos?usuarioId=${user.id}&productoId=${productoId}`);
      // Actualizar lista sin recargar
      setFavoritos(favoritos.filter(f => f.producto.id !== productoId));
      alert("Eliminado de favoritos");
    } catch (err) {
      alert("Error al eliminar favorito");
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
        <p style={{ fontSize: "18px", color: "#666" }}>Cargando favoritos...</p>
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
          <h1 style={{
            color: "#00ccff",
            fontSize: "36px",
            fontWeight: "bold",
            margin: "0"
          }}>
            Mis Favoritos
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

        {/* Lista de Favoritos */}
        {favoritos.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#f8f9fa",
            borderRadius: "12px"
          }}>
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>💔</div>
            <h2 style={{ fontSize: "24px", color: "#666", marginBottom: "12px" }}>
              No tienes productos favoritos
            </h2>
            <p style={{ color: "#999", marginBottom: "24px" }}>
              Explora el catálogo y agrega productos que te gusten
            </p>
            <button
              onClick={() => nav("/catalogo")}
              style={{
                background: "#00ccff",
                color: "white",
                padding: "12px 32px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Ir al Catálogo
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "25px"
          }}>
            {favoritos.map(favorito => (
              <div key={favorito.id} style={{
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                padding: "20px",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease",
                cursor: "pointer",
                position: "relative"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {/* Botón eliminar favorito */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarFavorito(favorito.producto.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10
                  }}
                  title="Eliminar de favoritos"
                >
                  ❤️
                </button>

                {/* Imagen del Producto */}
                <div 
                  onClick={() => nav(`/producto/${favorito.producto.id}`)}
                  style={{
                    width: "100%",
                    height: "200px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                  }}
                >
                  {favorito.producto.imagenUrl ? (
                    <img 
                      src={favorito.producto.imagenUrl} 
                      alt={favorito.producto.nombre}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <span style={{ color: "#6c757d", fontSize: "14px" }}>
                      🖼️ Sin imagen
                    </span>
                  )}
                </div>

                {/* Información del Producto */}
                <div onClick={() => nav(`/producto/${favorito.producto.id}`)}>
                  <h3 style={{
                    margin: "0 0 10px 0",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#333"
                  }}>
                    {favorito.producto.nombre}
                  </h3>

                  <p style={{
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                    color: "#666",
                    lineHeight: "1.4"
                  }}>
                    {favorito.producto.descripcion?.substring(0, 100)}...
                  </p>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px"
                  }}>
                    <span style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#00ccff"
                    }}>
                      ${favorito.producto.precio}
                    </span>

                    <button style={{
                      background: "#00ccff",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "background 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#0099cc"}
                    onMouseLeave={(e) => e.target.style.background = "#00ccff"}
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}