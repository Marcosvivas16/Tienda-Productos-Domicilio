import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerPedidos } from "../services/api";
import "../styles/Historial.css";

const Historial = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        // Solo cargar pedidos si hay un usuario autenticado
        if (!currentUser || !currentUser.id || !isAuthenticated()) {
          setPedidos([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");
        const datosPedidos = await obtenerPedidos(currentUser.id, token);
        
        console.log("Historial de pedidos cargado:", datosPedidos);
        
        // IMPORTANTE: Asegurarse de que realmente son los pedidos del usuario actual
        // y no datos de ejemplo o de otro usuario
        if (Array.isArray(datosPedidos)) {
          setPedidos(datosPedidos);
        } else {
          setPedidos([]);
        }
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, [currentUser, isAuthenticated]);

  // Si el usuario no está autenticado, mostrar mensaje
  if (!currentUser || !isAuthenticated()) {
    return (
      <div className="historial-container">
        <h2 className="historial-titulo">Historial de Pedidos</h2>
        <div className="sin-pedidos">
          <p>Inicia sesión para ver tu historial de pedidos.</p>
          <Link to="/login" className="btn-login">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="historial-container">
      <h2 className="historial-titulo">Mi Historial de Pedidos</h2>

      {loading ? (
        <div className="loading">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="sin-pedidos">
          <p>No tienes pedidos realizados todavía.</p>
          <Link to="/productos" className="btn-explorar">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <div>
                  <span className="pedido-numero">Pedido #{pedido.id.substring(0, 8)}</span>
                  <span className="pedido-fecha">{new Date(pedido.fecha).toLocaleDateString()}</span>
                </div>
                <span className={`pedido-estado ${pedido.estado.toLowerCase()}`}>
                  {pedido.estado}
                </span>
              </div>
              <div className="pedido-items">
                {pedido.productos.map((producto) => (
                  <div key={producto.id} className="pedido-item">
                    <img src={producto.imagen} alt={producto.nombre} />
                    <div className="pedido-item-info">
                      <p className="item-nombre">{producto.nombre}</p>
                      <p className="item-cantidad">Cantidad: {producto.cantidad}</p>
                    </div>
                    <p className="item-precio">
                      {(producto.precio * producto.cantidad).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>
              <div className="pedido-footer">
                <span className="pedido-total">
                  Total: {pedido.total.toFixed(2)} €
                </span>
                <Link to={`/pedidos/${pedido.id}`} className="btn-detalles">
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Historial;