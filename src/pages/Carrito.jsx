import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Carrito.css";

const Carrito = () => {
  const { isAuthenticated, isGuest } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getTotal } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  const handleCheckout = () => {
    if (isAuthenticated()) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="carrito-container">
      <h2 className="carrito-titulo">Mi Carrito</h2>
      
      {isGuest() && (
        <div className="carrito-alert">
          <i className="fas fa-exclamation-circle"></i>
          <p>Estás en modo invitado. Para completar la compra, necesitas <Link to="/login">iniciar sesión</Link>.</p>
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="carrito-vacio">
          <p>Tu carrito está vacío actualmente.</p>
          <Link to="/productos" className="btn-explorar">Explorar productos</Link>
        </div>
      ) : (
        <div className="carrito-contenido">
          <div className="productos-lista">
            {cartItems.map((item) => (
              <div key={item.id} className="producto-item">
                <img src={item.imagen} alt={item.nombre} className="producto-imagen" />
                <div className="producto-info">
                  <h3 className="producto-nombre">{item.nombre}</h3>
                  <p className="producto-precio">${formatPrice(item.precio)}</p>
                </div>
                <div className="producto-cantidad">
                  <button 
                    className="cantidad-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >-</button>
                  <span className="cantidad-valor">{item.quantity}</span>
                  <button 
                    className="cantidad-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                </div>
                <div className="producto-subtotal">
                  ${formatPrice(item.precio * item.quantity)}
                </div>
                <button 
                  className="eliminar-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="carrito-resumen">
            <h3 className="resumen-titulo">Resumen del pedido</h3>
            <div className="resumen-item">
              <span>Subtotal</span>
              <span>${formatPrice(getTotal())}</span>
            </div>
            <div className="resumen-item">
              <span>Gastos de envío</span>
              <span>{getTotal() > 20 ? "Gratis" : "$2.99"}</span>
            </div>
            <div className="resumen-total">
              <span>Total</span>
              <span>${formatPrice(getTotal() > 20 ? getTotal() : getTotal() + 2.99)}</span>
            </div>
            
            <button 
              className="btn-comprar"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Finalizar compra
            </button>
            
            <Link to="/productos" className="continuar-comprando">
              Continuar comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;