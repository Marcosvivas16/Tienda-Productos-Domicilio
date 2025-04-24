import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Header.css";
import logoImage from "./img/logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser, logout, isAuthenticated, isGuest } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navegar a la página de productos con el término de búsqueda como parámetro
      navigate(`/productos?buscar=${encodeURIComponent(searchTerm.trim())}`);
      // Cerrar el menú móvil si está abierto
      setMenuOpen(false);
      // Limpiar el campo de búsqueda
      setSearchTerm("");
    }
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logoImage} alt="FastDelivery Logo" className="logo-img" />
        </Link>

        <form onSubmit={handleSearch} className="search-bar">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </form>

        <div className="nav-buttons">
          {isAuthenticated() ? (
            <>
              <Link to="/perfil" className="nav-button perfil-button">
                <i className="fas fa-user"></i>
                <span>Mi Perfil</span>
              </Link>
              <Link to="/historial" className="nav-button historial-button">
                <i className="fas fa-history"></i>
                <span>Mis Pedidos</span>
              </Link>
              <Link to="/carrito" className="nav-button carrito-button">
                <div className="carrito-icon">
                  <i className="fas fa-shopping-cart"></i>
                  {cartItemCount > 0 && <span className="carrito-contador">{cartItemCount}</span>}
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
              <Link to="/carrito" className="nav-button carrito-button">
                <div className="carrito-icon">
                  <i className="fas fa-shopping-cart"></i>
                  {cartItemCount > 0 && <span className="carrito-contador">{cartItemCount}</span>}
                </div>
                <span>Carrito</span>
              </Link>
              <div className="nav-button guest-indicator">
                <i className="fas fa-user-clock"></i>
                <span>Modo Invitado</span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button login-button">
                <i className="fas fa-sign-in-alt"></i>
                <span>Iniciar Sesión</span>
              </Link>
              <Link to="/carrito" className="nav-button carrito-button">
                <div className="carrito-icon">
                  <i className="fas fa-shopping-cart"></i>
                  {cartItemCount > 0 && <span className="carrito-contador">{cartItemCount}</span>}
                </div>
                <span>Carrito</span>
              </Link>
            </>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {isAuthenticated() ? (
            <>
              <Link to="/perfil" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-user"></i> Mi Perfil
              </Link>
              <Link to="/historial" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-history"></i> Mis Pedidos
              </Link>
              <Link to="/carrito" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-shopping-cart"></i> Carrito {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
              <button onClick={handleLogout} className="mobile-menu-item logout-item">
                <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
              </button>
            </>
          ) : isGuest() ? (
            <>
              <div className="mobile-menu-item guest-item">
                <i className="fas fa-user-clock"></i> Modo Invitado
              </div>
              <Link to="/login" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
              </Link>
              <Link to="/carrito" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-shopping-cart"></i> Carrito {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
              </Link>
              <Link to="/carrito" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-shopping-cart"></i> Carrito {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
            </>
          )}
          <form onSubmit={handleSearch} className="mobile-search">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit"><i className="fas fa-search"></i></button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;