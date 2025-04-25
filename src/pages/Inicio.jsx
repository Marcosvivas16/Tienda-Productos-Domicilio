import React from "react";
import { Link } from "react-router-dom";
import "../styles/Inicio.css";

// Importar imágenes de categorías
import imgVerduras from "../components/img/categorias/verdura.jpg";
import imgFrutas from "../components/img/categorias/fruta.jpg";
import imgLacteos from "../components/img/categorias/lacteos.jpg";
import imgPanaderia from "../components/img/categorias/panaderia.jpg";
import imgBebidas from "../components/img/categorias/bebidas.jpg";

const Inicio = () => {
  return (
    <div className="inicio-container">
      {/* Hero Banner */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Productos frescos a tu puerta</h1>
          <p>Selección de calidad entregada directamente a tu hogar en menos de 24h</p>
          <Link to="/productos" className="btn-explorar">
            Explorar productos
          </Link>
        </div>
      </div>
      
      {/* Categorías populares */}
      <div className="categorias-section">
        <h2>Categorías populares</h2>
        <div className="categorias-grid">
          <Link to="/productos?categoria=frutas" className="categoria-card">
            <img src={imgFrutas} alt="Frutas" />
            <h3>Frutas</h3>
          </Link>
          <Link to="/productos?categoria=verduras" className="categoria-card">
            <img src={imgVerduras} alt="Verduras" />
            <h3>Verduras</h3>
          </Link>
          <Link to="/productos?categoria=lacteos" className="categoria-card">
            <img src={imgLacteos} alt="Lácteos" />
            <h3>Lácteos</h3>
          </Link>
          <Link to="/productos?categoria=panaderia" className="categoria-card">
            <img src={imgPanaderia} alt="Panadería" />
            <h3>Panadería</h3>
          </Link>
          <Link to="/productos?categoria=bebidas" className="categoria-card">
            <img src={imgBebidas} alt="Bebidas" />
            <h3>Bebidas</h3>
          </Link>
        </div>
      </div>
      
      {/* Promociones */}
      <div className="promociones-section">
        <h2>Ofertas especiales</h2>
        <div className="promociones-cards">
          <div className="promo-card">
            <div className="promo-content">
              <h3>15% de descuento</h3>
              <p>En tu primer pedido</p>
              <div className="promo-code">BIENVENIDA15</div>
            </div>
          </div>
          <div className="promo-card">
            <div className="promo-content">
              <h3>Envío gratis</h3>
              <p>En pedidos superiores a 30€</p>
              <div className="promo-code">ENVIOGRATIS</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Productos destacados */}
      <div className="destacados-section">
        <h2>Productos más vendidos</h2>
        <div className="destacados-slider">
          <div className="productos-grid">
            <div className="producto-card">
              <div className="producto-imagen-container">
                <img src="https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Manzanas rojas" className="producto-imagen" />
                <div className="etiqueta-oferta">Oferta</div>
              </div>
              <div className="producto-info">
                <h3 className="producto-nombre">Manzanas rojas</h3>
                <div className="producto-detalles">
                  <div className="valoracion">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <span className="valoracion-numero">(4.5)</span>
                  </div>
                  <div className="producto-precio">
                    <span className="precio-anterior">$2.50</span>
                    <span className="precio-actual">$1.99</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="producto-card">
              <div className="producto-imagen-container">
                <img src="https://images.pexels.com/photos/1069315/pexels-photo-1069315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Plátanos" className="producto-imagen" />
              </div>
              <div className="producto-info">
                <h3 className="producto-nombre">Plátanos</h3>
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
                    <span className="precio-actual">$1.25</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="producto-card">
              <div className="producto-imagen-container">
                <img src="https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Yogur Natural" className="producto-imagen" />
                <div className="etiqueta-oferta">Oferta</div>
              </div>
              <div className="producto-info">
                <h3 className="producto-nombre">Yogur Natural</h3>
                <div className="producto-detalles">
                  <div className="valoracion">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <span className="valoracion-numero">(4.9)</span>
                  </div>
                  <div className="producto-precio">
                    <span className="precio-anterior">$2.50</span>
                    <span className="precio-actual">$2.20</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="producto-card">
              <div className="producto-imagen-container">
                <img src="https://images.pexels.com/photos/1192053/pexels-photo-1192053.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Fresas" className="producto-imagen" />
              </div>
              <div className="producto-info">
                <h3 className="producto-nombre">Fresas</h3>
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
                    <span className="precio-actual">$2.50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="ver-mas-container">
            <Link to="/productos" className="btn-ver-mas">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </div>
      
      {/* Ventajas */}
      <div className="ventajas-section">
        <div className="ventajas-grid">
          <div className="ventaja-card">
            <div className="ventaja-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h3>Envío rápido</h3>
            <p>Entrega en 24h en toda la ciudad</p>
          </div>
          
          <div className="ventaja-card">
            <div className="ventaja-icon">
              <i className="fas fa-medal"></i>
            </div>
            <h3>Calidad garantizada</h3>
            <p>Productos frescos seleccionados diariamente</p>
          </div>
          
          <div className="ventaja-card">
            <div className="ventaja-icon">
              <i className="fas fa-undo"></i>
            </div>
            <h3>Devoluciones fáciles</h3>
            <p>¿No estás satisfecho? Te devolvemos el dinero</p>
          </div>
          
          <div className="ventaja-card">
            <div className="ventaja-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h3>Atención 24/7</h3>
            <p>Estamos aquí para ayudarte cuando lo necesites</p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para hacer tu pedido?</h2>
          <p>Productos frescos, de calidad y al mejor precio entregados en tu puerta</p>
          <Link to="/productos" className="btn-cta">
            Comprar ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Inicio;