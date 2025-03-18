import React from "react";
import { Link } from "react-router-dom";
import "../styles/Inicio.css";

const Inicio = () => {
  return (
    <div className="inicio-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Tus productos favoritos a domicilio</h1>
          <p>Entrega rápida en menos de 30 minutos</p>
          <Link to="/productos" className="btn-explorar">
            Explorar productos
          </Link>
        </div>
      </div>

      <div className="categorias-section">
        <h2>Categorías populares</h2>
        <div className="categorias-grid">
          <div className="categoria-card">
            <img src="https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Frutas y verduras" />
            <h3>Frutas y verduras</h3>
          </div>
          <div className="categoria-card">
            <img src="https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Lácteos" />
            <h3>Lácteos</h3>
          </div>
          <div className="categoria-card">
            <img src="https://images.pexels.com/photos/461060/pexels-photo-461060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Panadería" />
            <h3>Panadería</h3>
          </div>
          <div className="categoria-card">
            <img src="https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Bebidas" />
            <h3>Bebidas</h3>
          </div>
        </div>
      </div>

      <div className="promociones-section">
        <h2>Ofertas especiales</h2>
        <div className="promociones-cards">
          <div className="promo-card">
            <div className="promo-content">
              <h3>¡30% DESCUENTO!</h3>
              <p>En tu primer pedido</p>
              <span className="promo-code">NUEVO30</span>
            </div>
          </div>
          <div className="promo-card">
            <div className="promo-content">
              <h3>Envío GRATIS</h3>
              <p>En pedidos superiores a 20€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;