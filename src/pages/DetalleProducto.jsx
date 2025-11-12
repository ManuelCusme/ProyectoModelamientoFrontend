import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function DetalleProducto() {
  const { id } = useParams();
  const nav = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    cargarProducto();
    // eslint-disable-next-line
  }, [id]);

  async function cargarProducto() {
    try {
      const res = await api.get(`/productos/${id}`);
      setProducto(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando producto:", err);
      setLoading(false);
    }
  }

  function obtenerImagenes(prod) {
    if (!prod) return [];
    return [
      prod.imagenUrl1,
      prod.imagenUrl2,
      prod.imagenUrl3,
      prod.imagenUrl4,
      prod.imagenUrl5
    ].filter(u => u && u.trim() !== "");
  }

  async function handleComprar() {
    // acción de ejemplo
    alert("Funcionalidad de compra todavía no implementada");
  }

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Cargando...</p></div>;
  }

  if (!producto) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Producto no encontrado</p></div>;
  }

  const imagenes = obtenerImagenes(producto);
  const imagen = imagenes.length > 0 ? imagenes[imagenActual % imagenes.length] : null;

  return (
    <div style={{ minHeight: "100vh", background: "white", display: "flex", fontFamily: "Arial, sans-serif", padding: "30px" }}>
      <div style={{ width: "300px", background: "#00ccff", color: "white", padding: "30px 20px", borderRadius: "12px" }}>
        <h2 style={{ marginTop: 0 }}>VEYCOFLASH</h2>
        <nav style={{ marginTop: 20 }}>
          <button onClick={() => nav("/catalogo")} style={{ display: "block", width: "100%", marginBottom: 10 }}>← Volver al catálogo</button>
        </nav>
      </div>

      <div style={{ flex: 1, marginLeft: "30px" }}>
        <div style={{ display: "flex", gap: "30px" }}>
          <div style={{ flex: "0 0 60%", maxWidth: "60%" }}>
            {imagen ? (
              <div style={{ position: "relative" }}>
                <img src={imagen} alt={producto.nombre} style={{ width: "100%", height: "480px", objectFit: "cover", borderRadius: "12px" }} />
                {imagenes.length > 1 && (
                  <>
                    <button onClick={() => setImagenActual(i => (i === 0 ? imagenes.length - 1 : i - 1))} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", color: "white", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer" }}>←</button>
                    <button onClick={() => setImagenActual(i => (i === imagenes.length - 1 ? 0 : i + 1))} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", color: "white", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer" }}>→</button>
                    <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
                      {imagenes.map((_, idx) => (
                        <div key={idx} onClick={() => setImagenActual(idx)} style={{ width: 10, height: 10, borderRadius: "50%", background: idx === imagenActual ? "white" : "rgba(255,255,255,0.5)", cursor: "pointer" }} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ width: "100%", height: 480, background: "#f3f3f3", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>🖼️ Sin imagen</div>
            )}

            {imagenes.length > 1 && (
              <div style={{ display: "flex", gap: 12, marginTop: 12, overflowX: "auto" }}>
                {imagenes.map((src, idx) => (
                  <img key={idx} src={src} alt={`thumb-${idx}`} onClick={() => setImagenActual(idx)} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, cursor: "pointer", border: idx === imagenActual ? "3px solid #00ccff" : "3px solid transparent" }} />
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: "0 0 40%", maxWidth: "40%" }}>
            <h1 style={{ margin: "0 0 10px 0" }}>{producto.nombre}</h1>
            <p style={{ color: "#666" }}>{producto.descripcion}</p>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 28, fontWeight: "bold", color: "#00ccff" }}>${producto.precio}</div>
              <div style={{ marginTop: 8, color: "#666" }}>{producto.ubicacion}</div>
            </div>

            <div style={{ marginTop: 30, display: "flex", gap: 12 }}>
              <button onClick={handleComprar} style={{ background: "#00ccff", color: "white", border: "none", padding: "12px 18px", borderRadius: 8 }}>Comprar</button>
              <button onClick={() => nav("/perfil")} style={{ background: "#6c757d", color: "white", border: "none", padding: "12px 18px", borderRadius: 8 }}>Volver</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}