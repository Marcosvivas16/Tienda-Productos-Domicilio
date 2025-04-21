import React from "react";
import "../styles/VistaRapida.css";

const VistaRapida = ({ producto, isOpen, onClose, agregarAlCarrito }) => {
  if (!isOpen) return null;

  return (
    <div className="vista-rapida-overlay" onClick={onClose}>
      <div className="vista-rapida-modal" onClick={e => e.stopPropagation()}>
        <button className="vista-rapida-cerrar" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="vista-rapida-contenido">
          <div className="vista-rapida-imagen">
            <img src={producto.imagen} alt={producto.nombre} />
            {producto.oferta && <div className="vista-rapida-oferta">Oferta</div>}
          </div>
          
          <div className="vista-rapida-info">
            <h2 className="vista-rapida-nombre">{producto.nombre}</h2>
            
            <div className="vista-rapida-valoracion">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="far fa-star"></i>
              <span>(4.0)</span>
            </div>
            
            <div className="vista-rapida-precio">
              {producto.precioAnterior && (
                <span className="precio-anterior">${producto.precioAnterior}</span>
              )}
              <span className="precio-actual">${producto.precio}</span>
            </div>
            
            <div className="vista-rapida-descripcion">
              <h3>Descripción</h3>
              <p>{producto.descripcion || `${producto.nombre} fresco de la mejor calidad. Seleccionado cuidadosamente para garantizar frescura y sabor. Disponible para entrega a domicilio.`}</p>
            </div>
            
            <div className="vista-rapida-disponibilidad">
              <span className="disponible">
                <i className="fas fa-check-circle"></i> En stock
              </span>
              <span className="entrega">
                <i className="fas fa-truck"></i> Entrega en 24h
              </span>
            </div>
            
            <div className="vista-rapida-cantidad">
              <label htmlFor="cantidad">Cantidad:</label>
              <div className="cantidad-control">
                <button className="cantidad-btn">-</button>
                <input type="number" id="cantidad" min="1" defaultValue="1" />
                <button className="cantidad-btn">+</button>
              </div>
            </div>
            
            <button 
              className="vista-rapida-agregar"
              onClick={() => {
                agregarAlCarrito(producto);
                onClose();
              }}
            >
              <i className="fas fa-shopping-cart"></i> Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaRapida;