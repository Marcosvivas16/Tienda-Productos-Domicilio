import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Perfil.css";

const Perfil = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("datos");
  
  // Datos temporales para el perfil
  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || "Usuario",
    apellidos: "Ejemplo",
    email: currentUser?.email || "usuario@ejemplo.com",
    telefono: "612345678",
    direccion: "Calle Ejemplo 123",
    ciudad: "Ciudad Ejemplo",
    codigoPostal: "28001",
    notificaciones: true
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se implementaría la llamada a la API para actualizar datos
    alert("Datos guardados correctamente");
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Aquí se implementaría la llamada a la API para cambiar contraseña
    alert("Contraseña actualizada correctamente");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tus datos personales y preferencias</p>
      </div>
      
      <div className="perfil-content">
        <div className="perfil-sidebar">
          <div className="usuario-info">
            <div className="usuario-avatar">
              <img src="https://via.placeholder.com/100" alt="Avatar" />
            </div>
            <div className="usuario-detalles">
              <h3>{currentUser?.nombre || "Usuario"}</h3>
              <p>{currentUser?.email || "usuario@ejemplo.com"}</p>
            </div>
          </div>
          
          <div className="perfil-menu">
            <button 
              className={`menu-item ${activeTab === "datos" ? "active" : ""}`}
              onClick={() => setActiveTab("datos")}
            >
              <i className="fas fa-user"></i> Datos personales
            </button>
            <button 
              className={`menu-item ${activeTab === "seguridad" ? "active" : ""}`}
              onClick={() => setActiveTab("seguridad")}
            >
              <i className="fas fa-lock"></i> Seguridad
            </button>
            <button 
              className={`menu-item ${activeTab === "direcciones" ? "active" : ""}`}
              onClick={() => setActiveTab("direcciones")}
            >
              <i className="fas fa-map-marker-alt"></i> Direcciones
            </button>
            <Link to="/historial" className="menu-item">
              <i className="fas fa-history"></i> Historial de pedidos
            </Link>
          </div>
        </div>
        
        <div className="perfil-main">
          {activeTab === "datos" && (
            <div className="perfil-seccion">
              <h2>Datos Personales</h2>
              <form onSubmit={handleSubmit} className="perfil-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="apellidos">Apellidos</label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                    <small>El email no se puede cambiar</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="notificaciones">Notificaciones</label>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="notificaciones"
                      name="notificaciones"
                      checked={formData.notificaciones}
                      onChange={handleChange}
                    />
                    <label htmlFor="notificaciones">
                      Quiero recibir ofertas y novedades por email
                    </label>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-guardar">
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === "seguridad" && (
            <div className="perfil-seccion">
              <h2>Cambiar Contraseña</h2>
              <form onSubmit={handlePasswordSubmit} className="perfil-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña actual</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Nueva contraseña</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-guardar">
                    Actualizar contraseña
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === "direcciones" && (
            <div className="perfil-seccion">
              <h2>Direcciones de Envío</h2>
              <div className="direcciones-list">
                <div className="direccion-card default">
                  <div className="direccion-header">
                    <h3>Dirección principal</h3>
                    <span className="etiqueta-default">Predeterminada</span>
                  </div>
                  <div className="direccion-body">
                    <p>{formData.nombre} {formData.apellidos}</p>
                    <p>{formData.direccion}</p>
                    <p>{formData.ciudad}, {formData.codigoPostal}</p>
                    <p>Tel: {formData.telefono}</p>
                  </div>
                  <div className="direccion-actions">
                    <button className="btn-editar">
                      <i className="fas fa-edit"></i> Editar
                    </button>
                  </div>
                </div>
                
                <div className="direccion-card">
                  <div className="direccion-header">
                    <h3>Dirección de trabajo</h3>
                  </div>
                  <div className="direccion-body">
                    <p>{formData.nombre} {formData.apellidos}</p>
                    <p>Avenida Trabajo 456</p>
                    <p>Ciudad Trabajo, 28002</p>
                    <p>Tel: {formData.telefono}</p>
                  </div>
                  <div className="direccion-actions">
                    <button className="btn-editar">
                      <i className="fas fa-edit"></i> Editar
                    </button>
                    <button className="btn-eliminar">
                      <i className="fas fa-trash"></i> Eliminar
                    </button>
                    <button className="btn-default">
                      Establecer como predeterminada
                    </button>
                  </div>
                </div>
                
                <div className="agregar-direccion">
                  <button className="btn-agregar-direccion">
                    <i className="fas fa-plus"></i> Añadir nueva dirección
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;