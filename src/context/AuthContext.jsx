import React, { createContext, useState, useEffect, useContext } from "react";
import { obtenerUsuario, iniciarSesion, logout as apiLogout } from "../services/api";
import { syncFullCart } from "../services/api";

const AuthContext = createContext();
const API_BASE_URL = "http://155.210.71.196:1234";
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

  const logout = async () => {
    try {
      // Si hay usuario autenticado, intentar sincronizar el carrito
      if (currentUser && currentUser.id && isAuthenticated()) {
        const token = localStorage.getItem('token');
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        // Sincronizar con carrito vacío para limpiar
        await syncFullCart(currentUser.id, token, []);
      }
    } catch (error) {
      console.error("Error al sincronizar durante logout:", error);
    } finally {
      // Continuar con el proceso normal de logout
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      setCurrentUser(null);
    }
  };
  
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();
    console.log("Respuesta completa de login:", data);
    
    // Verificar estructura de la respuesta
    if (!data.token) {
      throw new Error("Respuesta de login inválida");
    }
    
    // Obtener información del usuario desde el token o la respuesta
    const userId = data.user?.id || extractUserIdFromToken(data.token);
    
    // Crear objeto de usuario
    const userWithId = {
      id: userId,
      email: email,
      nombre: data.user?.nombre || email.split('@')[0],
      token: data.token,
      isAuthenticated: true,
      isGuest: false
    };
    
    // Guardar token y datos de usuario
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(userWithId));
    setCurrentUser(userWithId);
    
    return userWithId;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

// Función para extraer el ID del usuario desde un token JWT
function extractUserIdFromToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    
    // Dependiendo de cómo el backend estructure el token:
    return payload.userId || payload.sub || payload.user?.id;
  } catch (e) {
    console.error("Error decodificando token:", e);
    return null;
  }
}


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