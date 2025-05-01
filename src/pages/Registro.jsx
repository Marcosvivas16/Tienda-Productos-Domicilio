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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, login } = useAuth(); // también importamos login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // Registro del usuario
      await register(formData.nombre, formData.email, formData.password);
      
      // Login automático tras registro
      await login(formData.email, formData.password);

      // Redirigir a la página de perfil (o inicio)
      navigate("/perfil");
    } catch (err) {
      console.error("Error de registro:", err);
      setError(err.message || "Error al registrar usuario. Intenta con otro email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <h2>Crear Cuenta</h2>
          <p>¡Únete a FastDelivery y disfruta de todos los beneficios!</p>
        </div>

        {error && <div className="registro-error">{error}</div>}

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
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
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