/**
 * Proyecto Software
 * 2025
 * @author Marcos Vivas
 */
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAuth }) => {
  const { currentUser, isAuthenticated } = useAuth();

  // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir a login
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;