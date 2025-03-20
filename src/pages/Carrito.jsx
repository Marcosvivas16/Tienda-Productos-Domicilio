import React from "react";
import "../styles/Carrito.css";

const Carrito = () => {
  return (
    <div className="container mt-4">
      <h2>Mi Carrito</h2>
      <div className="carrito-vacio">
        <p>Tu carrito está vacío actualmente.</p>
        <button className="btn-primary">Explorar productos</button>
      </div>
    </div>
  );
};

export default Carrito;