import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>FastDelivery</h1>
        </Link>

        <div className="search-bar">
          <input type="text" placeholder="Buscar productos..." />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="nav-buttons">
          <Link to="/perfil" className="nav-button perfil-button">
            <i className="fas fa-user"></i>
            <span>Mi Perfil</span>
          </Link>
          <Link to="/carrito" className="nav-button carrito-button">
            <div className="carrito-icon">
              <i className="fas fa-shopping-cart"></i>
              <span className="carrito-contador">2</span>
            </div>
            <span>Carrito</span>
          </Link>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/perfil" className="mobile-menu-item">
            <i className="fas fa-user"></i> Mi Perfil
          </Link>
          <Link to="/carrito" className="mobile-menu-item">
            <i className="fas fa-shopping-cart"></i> Carrito (2)
          </Link>
          <div className="mobile-search">
            <input type="text" placeholder="Buscar productos..." />
            <button><i className="fas fa-search"></i></button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;