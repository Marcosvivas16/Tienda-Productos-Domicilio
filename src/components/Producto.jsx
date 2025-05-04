/**
 * Proyecto Software
 * 2025
 * @author Marcos Vivas
 */
import React from "react";
import "../styles/Producto.css";

const Producto = ({ producto, agregarAlCarrito }) => {
  return (
    <div className="producto">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p>{producto.precio.toFixed(2)} €</p>
      <button onClick={() => agregarAlCarrito(producto)}>
        Agregar al carrito
      </button>
    </div>
  );
};

export default Producto;
