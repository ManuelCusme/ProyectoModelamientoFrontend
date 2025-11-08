import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditarProducto() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    ubicacion: "",
    imagenUrl: ""
  });

  const categorias = [
    "Electrónica",
    "Ropa y Accesorios",
    "Hogar y Jardín",
    "Deportes",
    "Vehículos",
    "Libros y Música",
    "Juguetes",
    "Servicios",
    "Otros"
  ];

  useEffect(() => {
    cargarProducto();
  }, [id]);

  async function cargarProducto() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      nav("/login");
      return;
    }

    try {
      const res = await api.get(`/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const producto = res.data;

      // Verificar que el usuario sea el dueño del producto
      if (producto.vendedorId !== user.id) {
        alert("No tienes permiso para editar este producto");
        nav("/perfil");
        return;
      }

      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: producto.categoria,
        ubicacion: producto.ubicacion,
        imagenUrl: producto.imagenUrl || ""
      });

      setLoading(false);
    } catch (err) {
      console.error("Error cargando producto:", err);
      const mensaje = err.response?.data?.message || "Error al cargar el producto";
      alert(mensaje);
      nav("/perfil");
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  if (!formData.nombre || !formData.descripcion || !formData.precio || !formData.categoria || !formData.ubicacion) {
    alert("Por favor completa todos los campos obligatorios");
    return;
  }

  if (formData.precio <= 0) {
    alert("El precio debe ser mayor a 0");
    return;
  }

  setGuardando(true);

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const dataToSend = {
      ...formData,
      vendedor: {
        id: user.id
      }
    };

    await api.put(`/productos/${id}`, dataToSend, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    alert("Producto actualizado correctamente");
    nav("/perfil");
  } catch (err) {
    console.error("Error actualizando producto:", err);
    const mensaje = err.response?.data?.message || "Error al actualizar el producto";
    alert(mensaje);
    setGuardando(false);
  }
}

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "18px", color: "#666" }}>Cargando producto...</p>
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
        background: "#f8f9fa",
        overflowY: "auto"
      }}>
        
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <div>
            <h1 style={{
              color: "#333",
              fontSize: "28px",
              fontWeight: "bold",
              margin: "0 0 8px 0"
            }}>
              ✏️ Editar Producto
            </h1>
            <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
              Modifica la información de tu producto
            </p>
          </div>
          
          <button 
            onClick={() => nav("/perfil")}
            style={{
              background: "#6c757d",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.background = "#5a6268"}
            onMouseLeave={(e) => e.target.style.background = "#6c757d"}
          >
            ← Volver al Perfil
          </button>
        </div>

        {/* Formulario */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          maxWidth: "800px"
        }}>
          <form onSubmit={handleSubmit}>
            
            {/* Nombre del Producto */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333"
              }}>
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: iPhone 13 Pro Max"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border 0.3s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ccff"}
                onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
              />
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333"
              }}>
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe tu producto en detalle..."
                rows="5"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "Arial, sans-serif",
                  transition: "border 0.3s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ccff"}
                onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
              />
            </div>

            {/* Precio y Categoría */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "24px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#333"
                }}>
                  Precio ($) *
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                    transition: "border 0.3s ease",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#00ccff"}
                  onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#333"
                }}>
                  Categoría *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                    cursor: "pointer",
                    transition: "border 0.3s ease",
                    boxSizing: "border-box",
                    background: "white"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#00ccff"}
                  onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ubicación */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333"
              }}>
                Ubicación *
              </label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Quito, Ecuador"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border 0.3s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ccff"}
                onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
              />
            </div>

            {/* URL de Imagen */}
            <div style={{ marginBottom: "30px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333"
              }}>
                URL de la Imagen (Opcional)
              </label>
              <input
                type="url"
                name="imagenUrl"
                value={formData.imagenUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border 0.3s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00ccff"}
                onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
              />
              {formData.imagenUrl && (
                <div style={{
                  marginTop: "12px",
                  padding: "12px",
                  background: "#f8f9fa",
                  borderRadius: "8px"
                }}>
                  <p style={{
                    fontSize: "13px",
                    color: "#666",
                    margin: "0 0 8px 0"
                  }}>
                    Vista previa:
                  </p>
                  <img 
                    src={formData.imagenUrl} 
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      borderRadius: "8px",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <p style={{
                    display: "none",
                    fontSize: "13px",
                    color: "#dc3545",
                    margin: "8px 0 0 0"
                  }}>
                    ⚠️ No se pudo cargar la imagen. Verifica la URL.
                  </p>
                </div>
              )}
            </div>

            {/* Botones */}
            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              paddingTop: "20px",
              borderTop: "2px solid #e9ecef"
            }}>
              <button
                type="button"
                onClick={() => nav("/perfil")}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.background = "#5a6268"}
                onMouseLeave={(e) => e.target.style.background = "#6c757d"}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                style={{
                  background: guardando ? "#999" : "#00ccff",
                  color: "white",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  cursor: guardando ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background 0.3s ease"
                }}
                onMouseEnter={(e) => !guardando && (e.target.style.background = "#00b3e6")}
                onMouseLeave={(e) => !guardando && (e.target.style.background = "#00ccff")}
              >
                {guardando ? "Guardando..." : "💾 Guardar Cambios"}
              </button>
            </div>

          </form>
        </div>

        {/* Nota informativa */}
        <div style={{
          marginTop: "20px",
          padding: "16px",
          background: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "8px",
          maxWidth: "800px"
        }}>
          <p style={{
            margin: 0,
            fontSize: "14px",
            color: "#856404"
          }}>
            ℹ️ <strong>Nota:</strong> Los cambios se aplicarán inmediatamente. Asegúrate de revisar toda la información antes de guardar.
          </p>
        </div>

      </div>
    </div>
  );
}