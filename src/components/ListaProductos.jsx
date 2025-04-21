import React, { useState } from "react";
import VistaRapida from "./VistaRapida";
import "../styles/ListaProductos.css";

const ListaProductos = ({ productos, agregarAlCarrito }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (producto) => {
    setModalProduct(producto);
    setIsModalOpen(true);
    // Evitar scroll en el body mientras el modal está abierto
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalProduct(null);
    // Restaurar scroll en el body
    document.body.style.overflow = "auto";
  };

  return (
    <div className="productos-container">
      <div className="productos-header">
        <h2 className="productos-title">Nuestros Productos</h2>
        <div className="productos-filtros">
          <select className="filtro-select">
            <option value="todos">Todos los productos</option>
            <option value="frutas">Frutas</option>
            <option value="verduras">Verduras</option>
            <option value="lacteos">Lácteos</option>
          </select>
          <select className="ordenar-select">
            <option value="relevancia">Ordenar por relevancia</option>
            <option value="precio-asc">Precio: de menor a mayor</option>
            <option value="precio-desc">Precio: de mayor a menor</option>
            <option value="nombre">Nombre</option>
          </select>
        </div>
      </div>

      <div className="productos-grid">
        {productos.map((producto) => (
          <div 
            key={producto.id} 
            className="producto-card"
            onMouseEnter={() => setHoveredProduct(producto.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="producto-imagen-container">
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="producto-imagen" 
              />
              {hoveredProduct === producto.id && (
                <div className="producto-acciones">
                  <button 
                    className="btn-vista-rapida"
                    onClick={() => openModal(producto)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className="btn-agregar"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    <i className="fas fa-shopping-cart"></i> Añadir
                  </button>
                </div>
              )}
              {producto.oferta && (
                <div className="etiqueta-oferta">Oferta</div>
              )}
            </div>
            <div className="producto-info">
              <h3 className="producto-nombre">{producto.nombre}</h3>
              <div className="producto-detalles">
                <div className="valoracion">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="far fa-star"></i>
                  <span className="valoracion-numero">(4.0)</span>
                </div>
                <div className="producto-precio">
                  {producto.precioAnterior && (
                    <span className="precio-anterior">${producto.precioAnterior}</span>
                  )}
                  <span className="precio-actual">${producto.precio}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Vista Rápida */}
      {isModalOpen && modalProduct && (
        <VistaRapida
          producto={modalProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
          agregarAlCarrito={agregarAlCarrito}
        />
      )}
    </div>
  );
};

export default ListaProductos;