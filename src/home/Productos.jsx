import React from "react";
import ListaProductos from "../components/ListaProductos";

const productos = [
  {
    id: 1,
    nombre: "Manzanas",
    precio: 1.2,
    imagen: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 2,
    nombre: "Pera",
    precio: 1.5,
    imagen: "https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  }
];

const Productos = () => {
  const agregarAlCarrito = (producto) => {
    console.log("Producto agregado:", producto);
  };

  return (
    <div>
      <ListaProductos productos={productos} agregarAlCarrito={agregarAlCarrito} />
    </div>
  );
};

export default Productos;
