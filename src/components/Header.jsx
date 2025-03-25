import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";
import logoImage from "../components/img/logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated, isGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logoImage} alt="FastDelivery Logo" className="logo-img" />
        </Link>

        <div className="search-bar">
          <input type="text" placeholder="Buscar productos..." />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="nav-buttons">
          {isAuthenticated() ? (
            <>
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
              <button onClick={handleLogout} className="nav-button logout-button">
                <i className="fas fa-sign-out-alt"></i>
                <span>Salir</span>
              </button>
            </>
          ) : isGuest() ? (
            <>
              <Link to="/login" className="nav-button login-button">
                <i className="fas fa-sign-in-alt"></i>
                <span>Iniciar Sesión</span>
              </Link>
              <div className="nav-button guest-indicator">
                <i className="fas fa-user-clock"></i>
                <span>Modo Invitado</span>
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-button login-button">
              <i className="fas fa-sign-in-alt"></i>
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </div>

      {/* Resto del código sin cambios */}
      {menuOpen && (
        <div className="mobile-menu">
          {/* ... el contenido del menú móvil sigue igual ... */}
        </div>
      )}
    </header>
  );
};

export default Header;