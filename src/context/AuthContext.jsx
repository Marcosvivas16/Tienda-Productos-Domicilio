import React, { createContext, useState, useEffect, useContext } from "react";

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

  const login = (userData) => {
    localStorage.setItem("usuario", JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
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
    logout,
    isGuest,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};