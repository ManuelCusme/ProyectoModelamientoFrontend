import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Historial() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    cargarHistorial();
  }, []);

  async function cargarHistorial() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      nav("/login");
      return;
    }

    try {
      const res = await api.get(`/historial/usuario/${user.id}`);
      setHistorial(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando historial:", err);
      setLoading(false);
    }
  }

  function formatearFecha(fecha) {
    const date = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora - date;
    
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (minutos < 60) {
      return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    } else if (horas < 24) {
      return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    } else if (dias < 7) {
      return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    nav("/");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "18px", color: "#666" }}>Cargando historial...</p>
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
            Historial de Visitas
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

        {/* Lista de Historial */}
        {historial.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#f8f9fa",
            borderRadius: "12px"
          }}>
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>📭</div>
            <h2 style={{ fontSize: "24px", color: "#666", marginBottom: "12px" }}>
              No tienes historial de visitas
            </h2>
            <p style={{ color: "#999", marginBottom: "24px" }}>
              Explora productos y tu historial se guardará aquí
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
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            {historial.map(item => (
              <div 
                key={item.id} 
                onClick={() => nav(`/producto/${item.producto.id}`)}
                style={{
                  display: "flex",
                  gap: "20px",
                  padding: "16px",
                  background: "white",
                  border: "1px solid #e9ecef",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Imagen */}
                <div style={{
                  width: "120px",
                  height: "120px",
                  flexShrink: 0,
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}>
                  {item.producto.imagenUrl ? (
                    <img 
                      src={item.producto.imagenUrl} 
                      alt={item.producto.nombre}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <span style={{ color: "#999", fontSize: "12px" }}>🖼️</span>
                  )}
                </div>

                {/* Información */}
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start"
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#333",
                        margin: "0 0 4px 0"
                      }}>
                        {item.producto.nombre}
                      </h3>
                      <p style={{
                        fontSize: "14px",
                        color: "#666",
                        margin: "0"
                      }}>
                        {item.producto.descripcion?.substring(0, 150)}
                        {item.producto.descripcion?.length > 150 ? "..." : ""}
                      </p>
                    </div>
                    <span style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#00ccff",
                      flexShrink: 0,
                      marginLeft: "20px"
                    }}>
                      ${item.producto.precio}
                    </span>
                  </div>

                  <div style={{
                    display: "flex",
                    gap: "20px",
                    fontSize: "13px",
                    color: "#666",
                    marginTop: "auto"
                  }}>
                    <span>
                      📍 {item.producto.ubicacion}
                    </span>
                    <span>
                      📦 {item.producto.tipo}
                    </span>
                    <span style={{ marginLeft: "auto", color: "#999" }}>
                      🕒 {formatearFecha(item.fechaVisto)}
                    </span>
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