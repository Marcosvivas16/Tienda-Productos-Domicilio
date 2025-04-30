import React, { createContext, useState, useEffect, useContext } from "react";
import { obtenerUsuario, iniciarSesion, cerrarSesion } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario en localStorage al cargar la app
    const checkLoggedIn = () => {
      const userData = localStorage.getItem("usuario");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      // En un entorno real, esto llamaría a tu API
      const userData = await iniciarSesion(email, password);
      localStorage.setItem("usuario", JSON.stringify(userData));
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };


  const register = async (nombre, email, password) => {
    try {
      // Llamada a la API para registrar al usuario
      const response = await fetch('http://localhost:1234/usuarios/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          password
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }
  
      const data = await response.json();
      
      // Crear el objeto de usuario con la propiedad isAuthenticated
      const userData = {
        ...data.user,
        isAuthenticated: true,  // Añadir esta propiedad para mantener coherencia
        isGuest: false          // Indicar explícitamente que no es un invitado
      };
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(userData)); // Usar 'usuario' como en login()
      
      // Actualizar el estado
      setCurrentUser(userData);
      
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const loginAsGuest = () => {
    const guestData = {
      id: "guest-" + Date.now(),
      nombre: "Invitado",
      isGuest: true,
      isAuthenticated: false
    };
    localStorage.setItem("usuario", JSON.stringify(guestData));
    setCurrentUser(guestData);
    return guestData;
  };

  const logout = () => {
    // En un entorno real, esto llamaría a tu API
    cerrarSesion();
    localStorage.removeItem("usuario");
    setCurrentUser(null);
  };

  const isGuest = () => {
    return currentUser && currentUser.isGuest;
  };

  const isAuthenticated = () => {
    return currentUser && currentUser.isAuthenticated;
  };

  const value = {
    currentUser,
    login,
    loginAsGuest,
    logout,
    isGuest,
    isAuthenticated,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};