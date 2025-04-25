import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Perfil.css";

const Perfil = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("datos");
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
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

  // Limpiar el mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);
  
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
    setIsLoading(true);
    
    // Simulamos una llamada a API
    setTimeout(() => {
      // Aquí iría la lógica para guardar en la base de datos
      setIsLoading(false);
      setSaveSuccess(true);
    }, 800);
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);
    
    // Simulamos una llamada a API
    setTimeout(() => {
      // Aquí iría la lógica para cambiar la contraseña en la base de datos
      setIsLoading(false);
      setSaveSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }, 800);
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
              <img src={`https://ui-avatars.com/api/?name=${formData.nombre}+${formData.apellidos}&background=2196F3&color=fff&size=100`} alt="Avatar" />
            </div>
            <div className="usuario-detalles">
              <h3>{formData.nombre} {formData.apellidos}</h3>
              <p>{formData.email}</p>
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
          {saveSuccess && (
            <div className="save-success-message">
              <i className="fas fa-check-circle"></i> Cambios guardados correctamente
            </div>
          )}
          
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
                      className="form-input"
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
                      className="form-input"
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
                      className="form-input disabled"
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
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="direccion">Dirección</label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ciudad">Ciudad</label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="codigoPostal">Código Postal</label>
                    <input
                      type="text"
                      id="codigoPostal"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group checkbox-group">
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
                  <button 
                    type="submit" 
                    className={`btn-guardar ${isLoading ? 'loading' : ''}`} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
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
                    className="form-input"
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
                    className="form-input"
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
                    className="form-input"
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className={`btn-guardar ${isLoading ? 'loading' : ''}`} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Actualizando...
                      </>
                    ) : (
                      'Actualizar contraseña'
                    )}
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
                    <p><strong>{formData.nombre} {formData.apellidos}</strong></p>
                    <p>{formData.direccion}</p>
                    <p>{formData.ciudad}, {formData.codigoPostal}</p>
                    <p><i className="fas fa-phone-alt"></i> {formData.telefono}</p>
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
                    <p><strong>{formData.nombre} {formData.apellidos}</strong></p>
                    <p>Avenida Trabajo 456</p>
                    <p>Ciudad Trabajo, 28002</p>
                    <p><i className="fas fa-phone-alt"></i> {formData.telefono}</p>
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