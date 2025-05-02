import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Registro.css";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  // Reemplazar el estado error por errors (objeto para múltiples errores)
  const [errors, setErrors] = useState({});
  // Reemplazar loading por isSubmitting para mantener consistencia
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    
    // Validaciones en el frontend
    let hasErrors = false;
    const newErrors = {};
    
    if (!formData.nombre) {
      newErrors.nombre = "El nombre es obligatorio";
      hasErrors = true;
    }
    
    if (!formData.email) {
      newErrors.email = "El email es obligatorio";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email no válido";
      hasErrors = true;
    }
    
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
      hasErrors = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      hasErrors = true;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Enviar solo los campos necesarios
      await register(
        formData.nombre.trim(), 
        formData.email.trim().toLowerCase(), 
        formData.password
      );
      
      // Redirigir tras registro exitoso
      navigate("/");
    } catch (error) {
      console.error("Error de registro:", error);
      setErrors({ general: error.message || "Error al registrar usuario" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <h2>Crear Cuenta</h2>
          <p>¡Únete a FastDelivery y disfruta de todos los beneficios!</p>
        </div>

        {/* Mostrar error general si existe */}
        {errors.general && <div className="registro-error">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre completo"
            />
            {errors.nombre && <div className="error-message">{errors.nombre}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="terms-privacy">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              Acepto los <Link to="/terminos">Términos y Condiciones</Link> y la <Link to="/privacidad">Política de Privacidad</Link>
            </label>
          </div>

          <button
            type="submit"
            className="btn-registro"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="registro-separator">
          <span>o</span>
        </div>

        <div className="login-option">
          ¿Ya tienes cuenta?
          <Link to="/login" className="login-link">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;