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
    imagenUrl1: "",
    imagenUrl2: "",
    imagenUrl3: "",
    imagenUrl4: "",
    imagenUrl5: ""
  });

  const categorias = [
    "Electrónicos", "Ropa", "Hogar", "Deportes", "Libros",
    "Juguetes", "Salud y Belleza", "Automotriz", "Mascotas", "Otros"
  ];

  useEffect(() => {
    cargarProducto();
    // eslint-disable-next-line
  }, [id]);

  async function cargarProducto() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      nav("/login");
      return;
    }

    try {
      const res = await api.get(`/productos/${id}`);
      const producto = res.data;

      // Asegurar que el vendedor sea el usuario actual
      if (producto.vendedor?.id !== user.id) {
        alert("No tienes permiso para editar este producto");
        nav("/perfil");
        return;
      }

      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio || "",
        categoria: producto.tipo || "",
        ubicacion: producto.ubicacion || "",
        imagenUrl1: producto.imagenUrl1 || "",
        imagenUrl2: producto.imagenUrl2 || "",
        imagenUrl3: producto.imagenUrl3 || "",
        imagenUrl4: producto.imagenUrl4 || "",
        imagenUrl5: producto.imagenUrl5 || ""
      });

      setLoading(false);
    } catch (err) {
      console.error("Error cargando producto:", err);
      alert(err.response?.data || "Error al cargar el producto");
      nav("/perfil");
    }
  }

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.nombre || !formData.descripcion || !formData.precio || !formData.categoria || !formData.ubicacion) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (parseFloat(formData.precio) <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    setGuardando(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        tipo: formData.categoria,
        ubicacion: formData.ubicacion,
        imagenUrl1: formData.imagenUrl1 || null,
        imagenUrl2: formData.imagenUrl2 || null,
        imagenUrl3: formData.imagenUrl3 || null,
        imagenUrl4: formData.imagenUrl4 || null,
        imagenUrl5: formData.imagenUrl5 || null,
        vendedor: { id: user.id }
      };

      await api.put(`/productos/${id}`, dataToSend);
      alert("Producto actualizado correctamente");
      nav("/perfil");
    } catch (err) {
      console.error("Error actualizando producto:", err);
      const mensaje = err.response?.data?.message || err.response?.data || "Error al actualizar el producto";
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
    <div style={{ minHeight: "100vh", background: "white", display: "flex", fontFamily: "Arial, sans-serif" }}>
      <div style={{
        width: "280px",
        background: "#00ccff",
        color: "white",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "50px", paddingBottom: "20px", borderBottom: "2px solid rgba(255,255,255,0.3)" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🛒</div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#1a237e" }}>VEYCOFLASH</h1>
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button onClick={() => nav("/catalogo")} style={{ background: "rgba(255,255,255,0.2)", color: "#1a237e", border: "none", padding: "15px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>🏠 Catálogo</button>
            <button onClick={() => nav("/publicar")} style={{ background: "rgba(255,255,255,0.2)", color: "#1a237e", border: "none", padding: "15px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>➕ Publicar Producto</button>
            <button onClick={() => nav("/perfil")} style={{ background: "rgba(255,255,255,0.2)", color: "#1a237e", border: "none", padding: "15px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>👤 Mi Perfil</button>
          </div>
        </nav>
      </div>

      <div style={{ flex: 1, padding: "30px 40px", background: "#f8f9fa", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ color: "#333", fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>✏️ Editar Producto</h1>
            <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>Modifica la información de tu producto</p>
          </div>
          <button onClick={() => nav("/perfil")} style={{ background: "#6c757d", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px" }}>← Volver al Perfil</button>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", maxWidth: "800px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Nombre del Producto *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: iPhone 13 Pro Max" style={{ width: "100%", padding: "12px 16px", border: "2px solid #e9ecef", borderRadius: "8px" }} />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Descripción *</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Describe tu producto en detalle..." rows="5" style={{ width: "100%", padding: "12px 16px", border: "2px solid #e9ecef", borderRadius: "8px" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Precio ($) *</label>
                <input type="number" name="precio" value={formData.precio} onChange={handleChange} placeholder="0.00" step="0.01" min="0" style={{ width: "100%", padding: "12px 16px", border: "2px solid #e9ecef", borderRadius: "8px" }} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Categoría *</label>
                <select name="categoria" value={formData.categoria} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", border: "2px solid #e9ecef", borderRadius: "8px", background: "white" }}>
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Ubicación *</label>
              <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Ej: Quito, Ecuador" style={{ width: "100%", padding: "12px 16px", border: "2px solid #e9ecef", borderRadius: "8px" }} />
            </div>

            {/* Imágenes (5) */}
            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>URLs de la Imagen (Opcional)</label>
              {[1,2,3,4,5].map(num => (
                <div key={num} style={{ marginBottom: "12px" }}>
                  <input type="url" name={`imagenUrl${num}`} value={formData[`imagenUrl${num}`]} onChange={handleChange} placeholder={`https://ejemplo.com/imagen${num}.jpg`} style={{ width: "100%", padding: "12px 16px", border: "2px solid #e9ecef", borderRadius: "8px" }} />
                  {formData[`imagenUrl${num}`] && (
                    <div style={{ marginTop: "12px", padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
                      <img src={formData[`imagenUrl${num}`]} alt={`Preview ${num}`} style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "8px", objectFit: "cover" }} onError={(e)=>{e.target.style.display="none";}} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "20px", borderTop: "2px solid #e9ecef" }}>
              <button type="button" onClick={() => nav("/perfil")} style={{ background: "#6c757d", color: "white", border: "none", padding: "14px 28px", borderRadius: "8px" }}>Cancelar</button>
              <button type="submit" disabled={guardando} style={{ background: guardando ? "#999" : "#00ccff", color: "white", border: "none", padding: "14px 28px", borderRadius: "8px" }}>{guardando ? "Guardando..." : "💾 Guardar Cambios"}</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}