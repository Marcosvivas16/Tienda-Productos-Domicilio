import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Carrito.css";

const Carrito = () => {
  const { isAuthenticated, isGuest } = useAuth();

  // Este componente ya está protegido, pero podemos añadir validaciones adicionales
  // por ejemplo, para mostrar mensajes específicos

  return (
    <div className="carrito-container">
      <h2 className="carrito-titulo">Mi Carrito</h2>
      
      {isGuest() && (
        <div className="carrito-alert">
          <i className="fas fa-exclamation-circle"></i>
          <p>Estás en modo invitado. Para completar la compra, necesitas <Link to="/login">iniciar sesión</Link>.</p>
        </div>
      )}
      
      <div className="carrito-vacio">
        <p>Tu carrito está vacío actualmente.</p>
        <Link to="/productos" className="btn-explorar">Explorar productos</Link>
      </div>
      
      {isAuthenticated() && (
        <div className="carrito-actions">
          <button className="btn-comprar" disabled={true}>
            Proceder al pago
          </button>
        </div>
      )}
    </div>
  );
};

export default Carrito;