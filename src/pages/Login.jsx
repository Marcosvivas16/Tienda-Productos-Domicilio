import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Aquí se conectaría con la API de backend
      // Por ahora simulamos una respuesta exitosa después de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular inicio de sesión exitoso
      if (email === "usuario@ejemplo.com" && password === "123456") {
        // Guardar info de usuario en localStorage (como simulación de sesión)
        const userData = {
          id: 1,
          nombre: "Usuario Ejemplo",
          email: email,
          direccion: "Calle Ejemplo, 123",
          isAuthenticated: true
        };
        
        localStorage.setItem("usuario", JSON.stringify(userData));
        navigate("/");
      } else {
        setError("Credenciales incorrectas. Intenta con usuario@ejemplo.com / 123456");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Guardar info básica de invitado
    const guestData = {
      isGuest: true,
      isAuthenticated: false
    };
    
    localStorage.setItem("usuario", JSON.stringify(guestData));
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>¡Bienvenido a FastDelivery!</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>
          
          <div className="login-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Recordarme</label>
            </div>
            <Link to="/recuperar-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
        
        <div className="login-separator">
          <span>o</span>
        </div>
        
        <button onClick={handleGuestAccess} className="btn-guest">
          Continuar como Invitado
        </button>
        
        <div className="register-option">
          ¿No tienes cuenta? 
          <Link to="/registro" className="register-link">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;