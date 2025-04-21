import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/DetalleProducto.css";

const DetalleProducto = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);
  
  // Producto estático para desarrollo - Tu compañero reemplazará esto
  const producto = {
    id: parseInt(id),
    nombre: "Producto de Ejemplo",
    precio: 12.99,
    precioAnterior: 15.99,
    imagenPrincipal: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagenes: [
      "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1132040/pexels-photo-1132040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1132041/pexels-photo-1132041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    descripcion: "Descripción completa del producto. Aquí se incluirán todos los detalles importantes sobre el producto, sus beneficios y características.",
    categoria: "frutas",
    enStock: true,
    valoracion: 4.5,
    numeroValoraciones: 128,
    especificaciones: [
      { nombre: "Origen", valor: "Nacional" },
      { nombre: "Peso aproximado", valor: "500g" },
      { nombre: "Empaque", valor: "Bandeja" }
    ]
  };

  const handleAddToCart = () => {
    addToCart(producto, cantidad);
  };

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setCantidad(value);
  };

  return (
    <div className="detalle-producto-container">
      <div className="detalle-producto-navegacion">
        <Link to="/">Inicio</Link> &gt; <Link to="/productos">Productos</Link> &gt; <span>{producto.nombre}</span>
      </div>
      
      <div className="detalle-producto-principal">
        <div className="detalle-producto-imagenes">
          <div className="imagen-principal">
            <img src={producto.imagenPrincipal} alt={producto.nombre} />
            {producto.precioAnterior && (
              <div className="etiqueta-oferta">Oferta</div>
            )}
          </div>
          <div className="imagenes-adicionales">
            {producto.imagenes.map((img, index) => (
              <div key={index} className="imagen-adicional">
                <img src={img} alt={`${producto.nombre} - imagen ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="detalle-producto-info">
          <h1 className="detalle-producto-nombre">{producto.nombre}</h1>
          
          <div className="detalle-producto-meta">
            <div className="detalle-producto-valoracion">
              <div className="estrellas">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <span className="valoracion-numero">
                {producto.valoracion} ({producto.numeroValoraciones} valoraciones)
              </span>
            </div>
            <span className="detalle-producto-categoria">
              <i className="fas fa-tag"></i> {producto.categoria}
            </span>
          </div>
          
          <div className="detalle-producto-precio">
            {producto.precioAnterior && (
              <span className="precio-anterior">${producto.precioAnterior}</span>
            )}
            <span className="precio-actual">${producto.precio}</span>
            {producto.precioAnterior && (
              <span className="porcentaje-descuento">
                {Math.round(((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100)}% OFF
              </span>
            )}
          </div>
          
          <div className="detalle-producto-disponibilidad">
            {producto.enStock ? (
              <span className="en-stock"><i className="fas fa-check-circle"></i> En stock</span>
            ) : (
              <span className="sin-stock"><i className="fas fa-times-circle"></i> Agotado</span>
            )}
          </div>
          
          <div className="detalle-producto-descripcion">
            <h3>Descripción</h3>
            <p>{producto.descripcion}</p>
          </div>
          
          <div className="detalle-producto-especificaciones">
            <h3>Especificaciones</h3>
            <ul>
              {producto.especificaciones.map((spec, index) => (
                <li key={index}>
                  <strong>{spec.nombre}:</strong> {spec.valor}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="detalle-producto-acciones">
            <div className="cantidad-control">
              <button 
                className="cantidad-btn" 
                onClick={() => cantidad > 1 && setCantidad(cantidad - 1)}
              >-</button>
              <input 
                type="number" 
                value={cantidad} 
                onChange={handleCantidadChange} 
                min="1" 
              />
              <button 
                className="cantidad-btn"
                onClick={() => setCantidad(cantidad + 1)}
              >+</button>
            </div>
            
            <button 
              className="btn-agregar-carrito" 
              onClick={handleAddToCart}
              disabled={!producto.enStock}
            >
              <i className="fas fa-shopping-cart"></i> Añadir al carrito
            </button>
          </div>
          
          <div className="detalle-producto-entrega">
            <div className="entrega-info">
              <i className="fas fa-truck"></i>
              <div>
                <h4>Entrega a domicilio</h4>
                <p>Recibe tu pedido en 24-48 horas</p>
              </div>
            </div>
            <div className="entrega-info">
              <i className="fas fa-undo"></i>
              <div>
                <h4>Devolución gratuita</h4>
                <p>30 días para devoluciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="productos-relacionados">
        <h2>Productos Relacionados</h2>
        <div className="productos-relacionados-grid">
          {/* Aquí irían los productos relacionados */}
          <div className="placeholder-mensaje">
            Los productos relacionados aparecerán aquí
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;