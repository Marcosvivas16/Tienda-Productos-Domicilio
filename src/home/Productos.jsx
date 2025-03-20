import React from "react";
import ListaProductos from "../components/ListaProductos";
import "../styles/Productos.css";

const productos = [
  {
    id: 1,
    nombre: "Manzanas Rojas",
    precio: 1.2,
    precioAnterior: 1.5,
    imagen: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    oferta: true
  },
  {
    id: 2,
    nombre: "Peras",
    precio: 1.5,
    imagen: "https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 3,
    nombre: "Plátanos",
    precio: 0.99,
    imagen: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 4,
    nombre: "Naranjas",
    precio: 1.3,
    imagen: "https://images.pexels.com/photos/42059/citrus-diet-fiber-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 5,
    nombre: "Fresas",
    precio: 2.5,
    precioAnterior: 3.0,
    imagen: "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    oferta: true
  },
  {
    id: 6,
    nombre: "Lechuga",
    precio: 0.8,
    imagen: "https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

const Productos = () => {
  const agregarAlCarrito = (producto) => {
    console.log("Producto agregado:", producto);
  };

  return (
    <div className="productos-page">
      <div className="banner-categorias">
        <h1>Productos Frescos</h1>
        <p>Las mejores selecciones entregadas a tu puerta</p>
      </div>
      
      <div className="filtros-rapidos">
        <button className="filtro-btn active">Todos</button>
        <button className="filtro-btn">Frutas</button>
        <button className="filtro-btn">Verduras</button>
        <button className="filtro-btn">Lácteos</button>
        <button className="filtro-btn">Panadería</button>
      </div>
      
      <ListaProductos productos={productos} agregarAlCarrito={agregarAlCarrito} />
    </div>
  );
};

export default Productos;