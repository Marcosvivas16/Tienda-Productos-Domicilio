import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../styles/Historial.css";

const Historial = () => {
  const { orders } = useCart();

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para obtener clase CSS basada en el estado del pedido
  const getStatusClass = (status) => {
    switch (status) {
      case 'pendiente': return 'estado-pendiente';
      case 'enviado': return 'estado-enviado';
      case 'entregado': return 'estado-entregado';
      case 'cancelado': return 'estado-cancelado';
      default: return '';
    }
  };

  // Función para traducir estado
  const translateStatus = (status) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'enviado': return 'Enviado';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="historial-container">
      <h2 className="historial-titulo">Historial de Pedidos</h2>
      
      {orders.length === 0 ? (
        <div className="historial-vacio">
          <p>No tienes pedidos anteriores.</p>
          <Link to="/productos" className="btn-explorar">Explorar productos</Link>
        </div>
      ) : (
        <div className="pedidos-lista">
          {orders.map((order) => (
            <div key={order.id} className="pedido-item">
              <div className="pedido-header">
                <div className="pedido-info">
                  <span className="pedido-id">Pedido #{order.id.substring(4, 12)}</span>
                  <span className="pedido-fecha">{formatDate(order.date)}</span>
                </div>
                <div className={`pedido-estado ${getStatusClass(order.status)}`}>
                  {translateStatus(order.status)}
                </div>
              </div>
              
              <div className="pedido-productos">
                {order.items.map((item) => (
                  <div key={item.id} className="pedido-producto">
                    <img src={item.imagen} alt={item.nombre} className="producto-miniatura" />
                    <div className="producto-detalles">
                      <span className="producto-nombre">{item.nombre}</span>
                      <span className="producto-cantidad">x{item.quantity}</span>
                    </div>
                    <span className="producto-precio">${(item.precio * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="pedido-footer">
                <div className="pedido-direccion">
                  <h4>Dirección de entrega:</h4>
                  <p>{order.shipping.name}</p>
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city}, {order.shipping.zipCode}</p>
                </div>
                <div className="pedido-total">
                  <span>Total</span>
                  <span className="total-precio">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Historial;