import React from "react";
import Producto from "./Producto";

const ListaProductos = ({ productos, agregarAlCarrito }) => {
  return (
    <div>
      {productos.map((producto) => (
        <Producto
          key={producto.id}
          producto={producto}
          agregarAlCarrito={agregarAlCarrito}
        />
      ))}
    </div>
  );
};

export default ListaProductos;
