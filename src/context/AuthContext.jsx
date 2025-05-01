import React, { createContext, useState, useEffect, useContext } from "react";
import { obtenerUsuario, iniciarSesion, logout as apiLogout } from "../services/api";

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
      // Obtener datos del usuario al iniciar sesión
      const userData = await iniciarSesion(email, password);
      // Verificar y asegurar que el objeto userData tenga un id válido
      const userWithId = {
        ...userData,
        id: userData.id || userData._id || userData.usuario_id || userData.userId,
        isAuthenticated: true,
        isGuest: false
      };
      
      // Imprimir para depuración
      console.log("Usuario después de login:", userWithId);
      
      // Guardar en localStorage y actualizar estado
      localStorage.setItem("token", userData.token);
      localStorage.setItem("usuario", JSON.stringify(userWithId));
      setCurrentUser(userWithId);
      
      return userWithId;
    } catch (error) {
      throw error;
    }
  };


  const register = async (nombre, email, password) => {
    try {
      // Llamada a la API para registrar al usuario
      const response = await fetch('http://155.210.71.196:1234/usuarios/register', {
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
      
      // Verificar la estructura completa de la respuesta
      console.log("Respuesta completa de registro:", data);
      
      // Asegurar que el usuario tenga un ID válido
      const userId = data.user?.id || data.user?._id || data.usuario_id || data.id;
      
      if (!userId) {
        console.warn("Advertencia: La respuesta no contiene un ID de usuario visible:", data);
      }
      
      // Crear el objeto de usuario con todas las propiedades necesarias
      const userData = {
        ...data.user,
        id: userId, // Asignar el ID identificado
        isAuthenticated: true,
        isGuest: false
      };
      
      console.log("Usuario después de registro:", userData);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(userData));
      
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
    apiLogout();
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
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