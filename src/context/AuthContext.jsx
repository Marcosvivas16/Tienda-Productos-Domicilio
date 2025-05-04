/**
 * Proyecto Software
 * 2025
 * @author Marcos Vivas
 */
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
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      localStorage.removeItem("cartItems"); 
      setCurrentUser(null);
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
    
    if (!data.token) {
      throw new Error("Respuesta de login inválida");
    }
    
    const userId = data.user?.id || extractUserIdFromToken(data.token);
    
    const userWithId = {
      id: userId,
      email: email,
      nombre: data.user?.nombre || email.split('@')[0],
      token: data.token,
      isAuthenticated: true,
      isGuest: false
    };
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(userWithId));
    setCurrentUser(userWithId);
    
    return userWithId;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

function extractUserIdFromToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    
    return payload.userId || payload.sub || payload.user?.id;
  } catch (e) {
    console.error("Error decodificando token:", e);
    return null;
  }
}


const register = async (nombre, email, password) => {
  try {
    if (!nombre || !email || !password) {
      throw new Error("Todos los campos son obligatorios");
    }

    if (!email.includes('@') || !email.includes('.')) {
      throw new Error("El formato del email es incorrecto");
    }

    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    const userData = {
      nombre: nombre,
      email: email,
      password: password
    };

    console.log("Enviando datos de registro:", JSON.stringify(userData, null, 2));

    const response = await fetch(`${API_BASE_URL}/usuarios/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData && errorData.message 
        ? errorData.message 
        : `Error ${response.status} al registrar usuario`;
      
      console.error("Error respuesta API:", errorMessage);
      
      if (response.status === 400) {
        if (errorMessage.includes("email")) {
          throw new Error("Este email ya está registrado");
        }
        throw new Error("Datos de registro incorrectos");
      }
      
      throw new Error("Error al registrar usuario");
    }

    const data = await response.json();
    
    if (!data.token) {
      throw new Error("Respuesta del servidor incompleta");
    }
    
    const newUser = {
      id: data.user?.id || extractUserIdFromToken(data.token),
      nombre: nombre,
      email: email,
      isGuest: false
    };
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(newUser));
    setCurrentUser(newUser);
    
    return newUser;
  } catch (error) {
    console.error("Error en registro:", error);
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